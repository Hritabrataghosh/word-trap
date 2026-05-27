let words = []

const index = new Map()

function buildIndex(list){

  for(const w of list){

    if(w.length < 3) continue

    for(let i=1;i<=6;i++){

      if(w.length < i) break

      const p = w.slice(0,i)

      if(!index.has(p)){
        index.set(p,[])
      }

      index.get(p).push(w)

    }

  }

}

function shuffle(arr){

  const a = [...arr]

  for(let i=a.length-1;i>0;i--){

    const j = Math.floor(Math.random()*(i+1))

    ;[a[i],a[j]] = [a[j],a[i]]

  }

  return a

}

function sortWords(words){

  const unique = [...new Set(words)]
    .filter(w => w.length >= 3)

  const groups = new Map()

  for(const w of unique){

    const len = w.length

    if(!groups.has(len)){
      groups.set(len,[])
    }

    groups.get(len).push(w)

  }

  const result = []

  const lengths = [...groups.keys()]
    .sort((a,b)=>a-b)

  for(const len of lengths){

    result.push(
      ...shuffle(groups.get(len))
    )

  }

  return result

}

function randomizeObjects(arr){

  const groups = new Map()

  for(const obj of arr){

    const len = obj.play.length

    if(!groups.has(len)){
      groups.set(len,[])
    }

    groups.get(len).push(obj)

  }

  const result = []

  const lengths = [...groups.keys()]
    .sort((a,b)=>a-b)

  for(const len of lengths){

    result.push(
      ...shuffle(groups.get(len))
    )

  }

  return result

}

function search(query){

  const raw = query

  if(raw.startsWith(" ")){

    const suffix = raw.trim()

    const results = []

    for(const w of words){

      if(w.endsWith(suffix)){
        results.push(w)
      }

      if(results.length >= 80) break

    }

    return sortWords(results)

  }

  const parts = raw.split(" ")

  const prefix = parts[0] || ""
  const suffix = parts[1] || ""

  let results = index.get(prefix) || []

  if(suffix){

    results = results.filter(w =>
      w.endsWith(suffix)
    )

  }

  return sortWords(results)

}

function getResponses(trap){

  const responses = index.get(trap) || []

  return responses.filter(w => {

    if(w === trap) return false

    if(w.length <= trap.length + 2){
      return false
    }

    const bad = [
      trap + "s",
      trap + "es",
      trap + "ed",
      trap + "er",
      trap + "d",
      trap + "r",
      trap + "ing"
    ]

    if(bad.includes(w)){
      return false
    }

    return true

  })

}function getResponses(trap){

  const responses = index.get(trap) || []

  return responses.filter(w => {

    if(w === trap) return false

    const diff = w.length - trap.length

    const bad = [
      trap + "s",
      trap + "es",
      trap + "ed",
      trap + "er",
      trap + "d",
      trap + "r",
      trap + "ing"
    ]

    if(bad.includes(w)){
      return false
    }

    // auto accept hard long solves
    if(diff >= 3){
      return true
    }

    // reject short/common solves
    if(diff <= 2){

      // common easy patterns
      if(
        w.endsWith("s") ||
        w.endsWith("es") ||
        w.endsWith("ed") ||
        w.endsWith("er") ||
        w.endsWith("ly") ||
        w.endsWith("ing")
      ){
        return false
      }

      // reject very short/easy words
      if(w.length <= trap.length + 2){
        return false
      }

    }

    return true

  })

}

function buildTraps(prefix,len,min,max){

  const playable = index.get(prefix) || []

  const trapMap = new Map()

  for(const word of shuffle(playable).slice(0,1200)){

    if(word.length <= prefix.length + len){
      continue
    }

    const trap = word.slice(-len)

    const responses = getResponses(trap)

    // NEW RULE:
    // traps must have at least 3 solves

    if(
      responses.length >= 3 &&
      responses.length <= max
    ){

      if(!trapMap.has(trap)){

        trapMap.set(trap,{
          play: word,
          ending: trap,
          solutions: sortWords(responses).slice(0,6)
        })

      }

    }

  }

  return randomizeObjects(
    [...trapMap.values()]
  ).slice(0,10)

}

function buildSpam(prefix){

  const playable = shuffle(
    index.get(prefix) || []
  )

  const categories = {

    ters: [],
    ler: [],
    raph: [],
    ally: [],
    omo: [],
    ines: [],
    ion: []

  }

  for(const w of playable.slice(0,2000)){

    if(w.length < 5) continue

    if(w.endsWith("ters")){
      categories.ters.push(w)
    }

    if(
      w.endsWith("ler") ||
      w.endsWith("lers")
    ){
      categories.ler.push(w)
    }

    if(
      w.endsWith("raph") ||
      w.endsWith("graph")
    ){
      categories.raph.push(w)
    }

    if(
      w.endsWith("ally") ||
      w.endsWith("ically")
    ){
      categories.ally.push(w)
    }

    if(w.endsWith("omo")){
      categories.omo.push(w)
    }

    if(
      w.endsWith("ines") ||
      w.endsWith("eines")
    ){
      categories.ines.push(w)
    }

    if(
      w.endsWith("tion") ||
      w.endsWith("ation")
    ){
      categories.ion.push(w)
    }

  }

  for(const k in categories){

    categories[k] = shuffle(
      sortWords(categories[k])
    )

  }

  const order = [
    "ters",
    "ler",
    "raph",
    "ally",
    "omo",
    "ines",
    "ion"
  ]

  const result = []

  let round = 0
  let added = true

  while(added && result.length < 40){

    added = false

    for(const type of order){

      const arr = categories[type]

      if(arr[round]){

        result.push({
          word: arr[round],
          ending: type
        })

        added = true

      }

    }

    round++

  }

  return shuffle(result)

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_WORDS"){

    words = payload
      .map(w=>w.trim().toLowerCase())
      .filter(w => w.length >= 3)

    buildIndex(words)

    return

  }

  if(type==="SEARCH"){

    const query = payload.toLowerCase()

    const results = search(query)
      .slice(0,30)

    const traps3 = buildTraps(query,3,1,7)

    const traps4 = buildTraps(query,4,1,7)

    const best = randomizeObjects([

      ...buildTraps(query,3,1,1),

      ...buildTraps(query,4,1,1)

    ]).slice(0,20)

    const spam = buildSpam(query)

    postMessage({

      results,
      traps3,
      traps4,
      best,
      spam

    })

  }

}