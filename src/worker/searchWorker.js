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

function getResponses(trap){

  const list = commonIndex.get(trap) || []

  return list.filter(w => w !== trap)

}

function buildTraps(prefix,len){

  const playable = commonIndex.get(prefix) || []

  const trapMap = new Map()

  for(const word of playable){

    if(word.length <= prefix.length + len) continue

    const trap = word.slice(-len)

    const responses = getResponses(trap)

    if(responses.length > 0 && responses.length <= 7){

      if(!trapMap.has(trap)){

        trapMap.set(trap,{
          ending: trap,
          solutions: [],
          plays: []
        })

      }

      trapMap.get(trap).plays.push(word)

    }

  }

  const traps = []

  for(const [trap,data] of trapMap){

    const responses = getResponses(trap)

    traps.push({
      ending: trap,
      solutions: responses.slice(0,6),
      plays: data.plays.slice(0,6)
    })

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