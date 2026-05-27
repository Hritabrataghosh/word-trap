let words = []

const index = new Map()

const banned = [
  "s",
  "es",
  "ed",
  "er",
  "ers",
  "ing",
  "ings",
  "ly"
]

function buildIndex(){

  for(const word of words){

    if(word.length < 3) continue

    for(let i=1;i<=8;i++){

      if(word.length < i) break

      const key = word.slice(0,i)

      if(!index.has(key)){
        index.set(key,[])
      }

      index.get(key).push(word)

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

function isFakeTrap(trap,word){

  if(word === trap){
    return true
  }

  if(word.length - trap.length <= 2){
    return true
  }

  for(const b of banned){

    if(word === trap + b){
      return true
    }

  }

  return false

}

function getResponses(trap){

  const list = index.get(trap) || []

  const valid = []

  for(const w of list){

    if(w.length < 3) continue

    if(isFakeTrap(trap,w)){
      return []
    }

    valid.push(w)

    if(valid.length > 7){
      return []
    }

  }

  return valid

}

function buildTraps(prefix,len,max=7){

  const playable = index.get(prefix) || []

  const out = []

  const used = new Set()

  for(const word of playable.slice(0,120)){

    if(word.length <= prefix.length + len){
      continue
    }

    const trap = word.slice(-len)

    if(trap.length < 3){
      continue
    }

    if(used.has(trap)){
      continue
    }

    used.add(trap)

    const responses = getResponses(trap)

    if(
      responses.length > 0 &&
      responses.length <= max
    ){

      out.push({
        ending:trap,
        word,
        solutions:sortWords(responses)
      })

    }

    if(out.length >= 10){
      break
    }

  }

  return out

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_WORDS"){

    words = payload.filter(w=>w.length >= 3)

    buildIndex()

    return

  }

  if(type==="SEARCH"){

    const raw = payload.trim()

    const parts = raw.split(" ")

    const start = parts[0] || ""
    const end = parts[1] || ""

    const results = search(start,end)

    const traps3 = buildTraps(start,3)

    const traps4 = buildTraps(start,4)

    const best = [
      ...buildTraps(start,3,2),
      ...buildTraps(start,4,2)
    ].slice(0,15)

    postMessage({
      results,
      best,
      traps3,
      traps4
    })

  }

}