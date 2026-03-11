let commonWords = []
let extraWords = []

const commonIndex = new Map()
const extraIndex = new Map()

function buildIndex(words,map){

  for(const w of words){

    for(let i=1;i<=4;i++){

      if(w.length < i) break

      const p = w.slice(0,i)

      if(!map.has(p)){
        map.set(p,[])
      }

      map.get(p).push(w)

    }

  }

}

function search(prefix){

  const common = commonIndex.get(prefix) || []
  const extra = extraIndex.get(prefix) || []

  return { common, extra }

}

function buildTraps(prefix,len){

  const trapMap = new Map()

  // only words that start with the search prefix
  const playableWords = commonIndex.get(prefix) || []

  for(const w of playableWords){

    if(w.length <= prefix.length + len) continue

    const end = w.slice(-len)

    if(!trapMap.has(end)){
      trapMap.set(end,[])
    }

    trapMap.get(end).push(w)

  }

  const traps = []

  for(const [ending,list] of trapMap.entries()){

    const responses = commonIndex.get(ending) || []

    const valid = responses.filter(w => w !== ending)

    if(valid.length > 0 && valid.length <= 7){

      traps.push({
        ending,
        solutions: valid.slice(0,6)
      })

    }

  }

  return traps

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_COMMON"){

    commonWords = payload
    buildIndex(commonWords,commonIndex)
    return

  }

  if(type==="LOAD_EXTRA"){

    extraWords = payload
    buildIndex(extraWords,extraIndex)
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

    const traps2 = buildTraps(prefix,2).slice(0,10)
    const traps3 = buildTraps(prefix,3).slice(0,10)
    const traps4 = buildTraps(prefix,4).slice(0,10)

    const best = [...traps2,...traps3,...traps4]
      .filter(t => t.solutions.length <= 2)
      .sort((a,b)=>a.solutions.length-b.solutions.length)
      .slice(0,20)

    postMessage({

      resultsCommon,
      resultsExtra,

      traps2,
      traps3,
      traps4,
      best

    })

  }

}