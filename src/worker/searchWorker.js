let commonWords = []
let extraWords = []

let commonWordSet = new Set()

const commonIndex = new Map()
const extraIndex = new Map()
const allIndex = new Map()

const trapCache = new Map()

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

function search(prefix){

  const common = commonIndex.get(prefix) || []
  const extra = extraIndex.get(prefix) || []

  return { common, extra }

}

function getResponses(trap,index){

  const list = index.get(trap) || []

  const responses = []

  const s = trap+"s"
  const es = trap+"es"

  const pluralExists =
    commonWordSet.has(s) ||
    commonWordSet.has(es)

  for(const w of list){

    // NEW RULE: must be at least +3 length
    if(
      w !== trap &&
      !pluralExists &&
      w.length >= trap.length + 3
    ){
      responses.push(w)
    }

  }

  return responses

}

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

    const responses = getResponses(trap,index)

    if(responses.length > 0 && responses.length <= 7){

      if(!trapMap.has(trap)){

        trapMap.set(trap,{
          ending: trap,
          solutions: responses.slice(0,6),
          plays:[]
        })

      }

      trapMap.get(trap).plays.push(word)

    }

    if(trapMap.size > 30) break

  }

  const traps = Array.from(trapMap.values())

  trapCache.set(cacheKey,traps)

  return traps

}

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

    // ❌ REMOVED traps2

    const traps3 = buildTraps(prefix,3,commonIndex).slice(0,10)
    const traps4 = buildTraps(prefix,4,commonIndex).slice(0,10)

    // ❌ BEST WITHOUT 2-letter traps
    const best = [
      ...buildTraps(prefix,3,allIndex),
      ...buildTraps(prefix,4,allIndex)
    ]
    .filter(t => t.solutions.length <= 2)
    .sort((a,b)=>a.solutions.length-b.solutions.length)
    .slice(0,20)

    postMessage({

      resultsCommon,
      resultsExtra,
      traps3,
      traps4,
      best

    })

  }

}