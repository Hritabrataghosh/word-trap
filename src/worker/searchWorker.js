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

  return {
    common,
    extra
  }

}

function buildTraps(results,len){

  const trapMap = new Map()

  for(const w of results){

    if(w.length <= len) continue

    const end = w.slice(-len)

    if(!trapMap.has(end)){
      trapMap.set(end,[])
    }

    trapMap.get(end).push(w)

  }

  const traps = []

  for(const [ending,list] of trapMap.entries()){

    if(list.length <= 6){

      traps.push({
        ending,
        solutions:list.slice(0,6)
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

    const {common,extra} = search(payload)

    const resultsCommon = common.slice(0,30)

    let resultsExtra = []

    if(resultsCommon.length < 30){
      resultsExtra = extra.slice(0,30-resultsCommon.length)
    }

    const traps2 = buildTraps(common,2)
    const traps3 = buildTraps(common,3)
    const traps4 = buildTraps(common,4)

    const best = [...traps2,...traps3,...traps4]
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