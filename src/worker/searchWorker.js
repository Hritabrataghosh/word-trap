let commonWords = []
let extraWords = []

const commonIndex = new Map()
const extraIndex = new Map()
const allIndex = new Map()

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

function parseQuery(q){

  const parts = q.trim().split(/\s+/)

  let prefix = ""
  let suffix = ""

  if(parts.length === 1){

    if(q.startsWith(" ")){
      suffix = parts[0]
    }else{
      prefix = parts[0]
    }

  }else if(parts.length >= 2){

    prefix = parts[0]
    suffix = parts[1]

  }

  return {prefix,suffix}

}

function filterWords(words,prefix,suffix){

  return words.filter(w=>{

    if(prefix && !w.startsWith(prefix)) return false
    if(suffix && !w.endsWith(suffix)) return false

    return true

  })

}

function getResponses(trap,index){

  const list = index.get(trap) || []

  const invalid = new Set([
    trap,
    trap+"s",
    trap+"es"
  ])

  return list.filter(w => !invalid.has(w))

}

function validTrap(trap,responses){

  if(responses.length === 0 || responses.length > 7) return false

  for(const r of responses){

    if(r.length < trap.length + 3){
      return false
    }

  }

  return true

}

function buildTraps(prefix,len,index){

  const playable = index.get(prefix) || []

  const trapMap = new Map()

  for(const word of playable){

    if(word.length <= prefix.length + len) continue

    const trap = word.slice(-len)

    const responses = getResponses(trap,index)

    if(!validTrap(trap,responses)) continue

    if(!trapMap.has(trap)){

      trapMap.set(trap,{
        ending:trap,
        solutions:responses.slice(0,6),
        plays:[]
      })

    }

    trapMap.get(trap).plays.push(word)

  }

  return Array.from(trapMap.values())

}

function buildSpammable(prefix,index){

  const playable = index.get(prefix) || []

  const trapMap = new Map()

  for(const word of playable){

    if(word.length <= prefix.length + 3) continue

    const trap = word.slice(-3)

    const responses = getResponses(trap,index)

    if(responses.length < 3 || responses.length > 7) continue

    if(!validTrap(trap,responses)) continue

    if(!trapMap.has(trap)){

      trapMap.set(trap,{
        ending:trap,
        solutions:responses.slice(0,6),
        plays:[]
      })

    }

    trapMap.get(trap).plays.push(word)

  }

  return Array.from(trapMap.values()).slice(0,10)

}

self.onmessage = e=>{

  const {type,payload} = e.data

  if(type==="LOAD_COMMON"){

    commonWords = payload
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

    const {prefix,suffix} = parseQuery(payload)

    let common = commonWords
    let extra = extraWords

    common = filterWords(common,prefix,suffix)
    extra = filterWords(extra,prefix,suffix)

    const resultsCommon = common.slice(0,30)

    let resultsExtra = []

    if(resultsCommon.length < 30){
      resultsExtra = extra.slice(0,30-resultsCommon.length)
    }

    let traps3 = []
    let traps4 = []
    let best = []
    let spammable = []

    if(prefix){

      traps3 = buildTraps(prefix,3,commonIndex).slice(0,10)
      traps4 = buildTraps(prefix,4,commonIndex).slice(0,10)

      best = [
        ...buildTraps(prefix,3,allIndex),
        ...buildTraps(prefix,4,allIndex)
      ]
      .filter(t=>t.solutions.length<=2)
      .slice(0,20)

      spammable = buildSpammable(prefix,allIndex)

    }

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