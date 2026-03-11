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

    const valid = list.filter(w => w !== ending)

    if(valid.length > 0 && valid.length <= 7){

      traps.push({
        ending,
        solutions: valid
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

    const traps2 = buildTraps(common,2).slice(0,10)
const traps3 = buildTraps(common,3).slice(0,10)
const traps4 = buildTraps(common,4).slice(0,10)

const best = [...traps2,...traps3,...traps4]
  .filter(t => t.solutions.length <= 2)
  .sort((a,b)=>a.solutions.length-b.solutions.length)
  .slice(0,20)

const actual2 = traps2.slice(0,10)
const actual3 = traps3.slice(0,10)
const actual4 = traps4.slice(0,10)

    postMessage({

  resultsCommon,
  resultsExtra,

  best,

  traps2: actual2,
  traps3: actual3,
  traps4: actual4

})
  }

}