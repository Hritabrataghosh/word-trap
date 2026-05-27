let words = []

const index = new Map()

const bannedEndings = [
  "s",
  "es",
  "ed",
  "er",
  "ers",
  "ing",
  "ings",
  "ly",
  "d",
  "r"
]

function buildIndex(){

  for(const w of words){

    if(w.length < 3) continue

    for(let i=1;i<=8;i++){

      if(w.length < i) break

      const p = w.slice(0,i)

      if(!index.has(p)){
        index.set(p,[])
      }

      index.get(p).push(w)

    }

  }

}

function sortWords(arr){

  return [...arr].sort((a,b)=>{

    if(a.length !== b.length){
      return a.length - b.length
    }

    return a.localeCompare(b)

  })

}

function search(start,end=""){

  let results = index.get(start) || []

  results = results.filter(w=>w.length >= 3)

  if(end){
    results = results.filter(w=>w.endsWith(end))
  }

  return sortWords(results).slice(0,30)

}

function invalidSolve(trap,word){

  if(word === trap) return true

  if(word.length - trap.length <= 2){
    return true
  }

  for(const b of bannedEndings){

    if(word === trap + b){
      return true
    }

  }

  return false

}

function getResponses(trap){

  const list = index.get(trap) || []

  return list.filter(w=>{

    if(w.length < 3) return false

    return !invalidSolve(trap,w)

  })

}

function buildTraps(prefix,len,maxSolves=7){

  const playable = index.get(prefix) || []

  const trapMap = new Map()

  for(const word of playable.slice(0,250)){

    if(word.length <= prefix.length + len){
      continue
    }

    const trap = word.slice(-len)

    if(trap.length < 3){
      continue
    }

    if(trapMap.has(trap)){
      continue
    }

    const responses = getResponses(trap)

    if(
      responses.length > 0 &&
      responses.length <= maxSolves
    ){

      trapMap.set(trap,{
        ending:trap,
        word,
        solutions:sortWords(responses).slice(0,6)
      })

    }

  }

  return Array.from(trapMap.values())
  .sort((a,b)=>{

    if(a.solutions.length !== b.solutions.length){
      return a.solutions.length - b.solutions.length
    }

    return a.word.length - b.word.length

  })

}

function buildSpam(prefix){

  const spamEndings = [
    "ters",
    "raph",
    "ally",
    "ines",
    "eise",
    "ream",
    "lers",
    "hm",
    "omo"
  ]

  const playable = index.get(prefix) || []

  const spam = []

  for(const word of playable.slice(0,400)){

    for(const e of spamEndings){

      if(word.endsWith(e)){

        spam.push({
          ending:e,
          word
        })

      }

    }

  }

  return spam.slice(0,25)

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_WORDS"){

    words = payload
      .map(w=>w.trim().toLowerCase())
      .filter(w=>w.length >= 3)

    buildIndex()

    return

  }

  if(type==="SEARCH"){

    const raw = payload.trim()

    const parts = raw.split(" ")

    const start = parts[0] || ""
    const end = parts[1] || ""

    const results = search(start,end)

    const traps3 = buildTraps(start,3).slice(0,10)

    const traps4 = buildTraps(start,4).slice(0,10)

    const best = [
      ...buildTraps(start,3,2),
      ...buildTraps(start,4,2)
    ].slice(0,20)

    const spam = buildSpam(start)

    postMessage({
      results,
      traps3,
      traps4,
      best,
      spam
    })

  }

}