let commonWords = []
let extraWords = []

const commonIndex = new Map()
const extraIndex = new Map()
const allIndex = new Map()

const responseCache = new Map()

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

function buildIndex(words,map){

  for(const w of words){

    if(w.length < 3) continue

    for(let i=1;i<=8;i++){

      if(w.length < i) break

      const p = w.slice(0,i)

      if(!map.has(p)){
        map.set(p,[])
      }

      map.get(p).push(w)

    }

  }

}

function mergeIndexes(){

  for(const [k,v] of commonIndex){

    if(!allIndex.has(k)){
      allIndex.set(k,[])
    }

    allIndex.get(k).push(...v)

  }

  for(const [k,v] of extraIndex){

    if(!allIndex.has(k)){
      allIndex.set(k,[])
    }

    allIndex.get(k).push(...v)

  }

}

function sortShortest(words){

  return [...words].sort((a,b)=>{

    if(a.length !== b.length){
      return a.length - b.length
    }

    return a.localeCompare(b)

  })

}

function search(prefix){

  const common = commonIndex.get(prefix) || []
  const extra = extraIndex.get(prefix) || []

  return {
    common: sortShortest(common),
    extra: sortShortest(extra)
  }

}

function isEasySolve(trap,word){

  if(word === trap) return true

  if(word.length - trap.length <= 2){
    return true
  }

  for(const end of bannedEndings){

    if(word === trap + end){
      return true
    }

  }

  return false

}

function getResponses(trap,index){

  const cacheKey = trap + "_" + (index === commonIndex ? "c" : "a")

  if(responseCache.has(cacheKey)){
    return responseCache.get(cacheKey)
  }

  const list = index.get(trap) || []

  const filtered = list.filter(w=>{

    if(w.length < 3) return false

    return !isEasySolve(trap,w)

  })

  responseCache.set(cacheKey,filtered)

  return filtered

}

function buildTraps(prefix,len,index){

  const playable = index.get(prefix) || []

  const trapMap = new Map()

  const limitedPlayable = playable.slice(0,300)

  for(const word of limitedPlayable){

    if(word.length <= prefix.length + len){
      continue
    }

    const trap = word.slice(-len)

    if(trap.length < 3) continue

    if(trapMap.has(trap)) continue

    const responses = getResponses(trap,index)

    if(responses.length === 0){
      continue
    }

    let valid = true

    for(const r of responses){

      if(isEasySolve(trap,r)){
        valid = false
        break
      }

    }

    if(!valid){
      continue
    }

    trapMap.set(trap,{
      ending: trap,
      solutions: sortShortest(responses).slice(0,6),
      plays:[word]
    })

  }

  return Array.from(trapMap.values())
    .sort((a,b)=>{

      if(a.solutions.length !== b.solutions.length){
        return a.solutions.length - b.solutions.length
      }

      return a.ending.localeCompare(b.ending)

    })

}

function buildSpam(prefix){

  const categories = [
    "ters",
    "raph",
    "ally",
    "ines",
    "eise",
    "ream",
    "lers",
    "ends",
    "ings",
    "ment"
  ]

  const playable = commonIndex.get(prefix) || []

  const spam = []

  for(const w of playable.slice(0,400)){

    if(w.length < 5) continue

    for(const c of categories){

      if(w.endsWith(c)){

        spam.push({
          ending:c,
          word:w
        })

      }

    }

  }

  return spam.slice(0,20)

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_COMMON"){

    commonWords = payload.filter(w=>w.length >= 3)

    buildIndex(commonWords,commonIndex)

    return

  }

  if(type==="LOAD_EXTRA"){

    extraWords = payload.filter(w=>w.length >= 3)

    buildIndex(extraWords,extraIndex)

    mergeIndexes()

    return

  }

  if(type==="SEARCH"){

    responseCache.clear()

    const raw = payload.trim()

    const parts = raw.split(" ")

    const start = parts[0] || ""
    const end = parts[1] || ""

    const {common,extra} = search(start)

    let resultsCommon = common.filter(w=>w.length >= 3)

    if(end){
      resultsCommon = resultsCommon.filter(w=>w.endsWith(end))
    }

    resultsCommon = resultsCommon.slice(0,30)

    let resultsExtra = extra.filter(w=>w.length >= 3)

    if(end){
      resultsExtra = resultsExtra.filter(w=>w.endsWith(end))
    }

    resultsExtra = resultsExtra.slice(0,30)

    const traps3 = buildTraps(start,3,commonIndex).slice(0,10)

    const traps4 = buildTraps(start,4,commonIndex).slice(0,10)

    const best = [
      ...buildTraps(start,3,allIndex),
      ...buildTraps(start,4,allIndex)
    ]
    .filter(t=>t.solutions.length <= 2)
    .slice(0,20)

    const spam = buildSpam(start)

    postMessage({

      resultsCommon,
      resultsExtra,
      traps3,
      traps4,
      best,
      spam

    })

  }

}