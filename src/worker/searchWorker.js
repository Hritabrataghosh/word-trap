let commonWords = []
let extraWords = []

let commonWordSet = new Set()

const commonIndex = new Map()
const extraIndex = new Map()
const allIndex = new Map()

const trapCache = new Map()

// 🔹 BUILD INDEX (FAST PREFIX MAP)
function buildIndex(words,map){

  for(const w of words){

    const limit = Math.min(4,w.length)

    for(let i=1;i<=limit;i++){

      const p = w.slice(0,i)

      if(!map.has(p)){
        map.set(p,[])
      }

      map.get(p).push(w)

    }

  }

}

// 🔹 MERGE INDEXES
function mergeIndexes(){

  for(const [k,v] of commonIndex){
    if(!allIndex.has(k)) allIndex.set(k,[])
    allIndex.get(k).push(...v)
  }

  for(const [k,v] of extraIndex){
    if(!allIndex.has(k)) allIndex.set(k,[])
    allIndex.get(k).push(...v)
  }

}

// 🔹 SEARCH
function search(prefix){
  return {
    common: commonIndex.get(prefix) || [],
    extra: extraIndex.get(prefix) || []
  }
}

// 🔥 FAST VALIDATION (NO FULL SCAN)
function isValidTrap(trap,index){

  const list = index.get(trap) || []
  const minLen = trap.length + 3

  for(const w of list){
    if(w.length < minLen){
      return false
    }
  }

  return true
}

// 🔹 GET RESPONSES
function getResponses(trap,index){

  const list = index.get(trap) || []
  const responses = []
  const minLen = trap.length + 3

  for(const w of list){

    if(w !== trap && w.length >= minLen){
      responses.push(w)
    }

  }

  return responses

}

// 🔹 BUILD TRAPS
function buildTraps(prefix,len,index){

  const cacheKey = prefix+"-"+len+"-"+(index===allIndex?"all":"common")

  if(trapCache.has(cacheKey)){
    return trapCache.get(cacheKey)
  }

  const playable = index.get(prefix) || []
  const trapMap = new Map()

  for(const word of playable){

    if(word.length <= prefix.length + len) continue

    const trap = word.slice(-len)

    // 🔥 STRICT VALIDATION
    if(!isValidTrap(trap,index)) continue

    const responses = getResponses(trap,index)

    if(responses.length > 0){

      if(!trapMap.has(trap)){

        trapMap.set(trap,{
          ending: trap,
          solutions: responses.slice(0,8),
          plays:[]
        })

      }

      trapMap.get(trap).plays.push(word)

    }

    if(trapMap.size > 40) break

  }

  const traps = Array.from(trapMap.values())

  trapCache.set(cacheKey,traps)

  return traps

}

// 🔹 WORKER
self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_COMMON"){
    commonWords = payload
    commonWordSet = new Set(commonWords)
    buildIndex(commonWords,commonIndex)
    return
  }

  if(type==="LOAD_EXTRA"){
    extraWords = payload
    buildIndex(extraWords,extraIndex)
    mergeIndexes()
    return
  }

  if(type==="SEARCH"){

    const prefix = payload

    const {common,extra} = search(prefix)

    const resultsCommon = common.slice(0,30)

    let resultsExtra = []
    if(resultsCommon.length < 30){
      resultsExtra = extra.slice(0,30-resultsCommon.length)
    }

    // 🎯 NORMAL TRAPS
    const traps3 = buildTraps(prefix,3,commonIndex)
      .filter(t => t.solutions.length <= 7)
      .slice(0,10)

    const traps4 = buildTraps(prefix,4,commonIndex)
      .filter(t => t.solutions.length <= 7)
      .slice(0,10)

    // 🧨 BEST TRAPS (hardest)
    const best = [
      ...buildTraps(prefix,3,allIndex),
      ...buildTraps(prefix,4,allIndex)
    ]
    .filter(t => t.solutions.length <= 2)
    .sort((a,b)=>a.solutions.length-b.solutions.length)
    .slice(0,20)

    // 🔁 SPAMMABLE TRAPS (like eux, hoch)
    const spammable = [
      ...buildTraps(prefix,3,commonIndex),
      ...buildTraps(prefix,4,commonIndex)
    ]
    .filter(t => t.solutions.length >= 4)
    .sort((a,b)=>b.solutions.length-a.solutions.length)
    .slice(0,20)

    postMessage({
      resultsCommon,
      resultsExtra,
      traps3,
      traps4,
      best,
      spammable
    })

  }

}