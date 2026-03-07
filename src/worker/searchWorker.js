let words = []
let prefixMap = {}

function buildPrefixIndex(){

  for (let w of words){

    for(let i=1;i<=4;i++){

      if(w.length < i) continue

      const p = w.slice(0,i)

      if(!prefixMap[p]) prefixMap[p] = []

      prefixMap[p].push(w)

    }

  }

}

function search(prefix){

  if(!prefix) return []

  prefix = prefix.toLowerCase()

  return prefixMap[prefix] || []

}

function buildTraps(results,len){

  const traps = {}

  for(const word of results){

    if(word.length <= len) continue

    const ending = word.slice(-len)

    const next = results.filter(w => w.startsWith(ending))

    const count = next.length

    if(count > 0 && count <= 6){

      if(!traps[ending]){

        traps[ending] = next.slice(0,6)

      }

    }

  }

  return Object.entries(traps).map(([ending,solutions])=>({

    ending,
    solutions

  }))

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD"){

    words = payload

    buildPrefixIndex()

    return

  }

  if(type==="SEARCH"){

  const allResults = search(payload)

  // limit displayed words
  const results = allResults.slice(0,30)

  const trap2 = buildTraps(allResults,2,payload)
const trap3 = buildTraps(allResults,3,payload)
const trap4 = buildTraps(allResults,4,payload)

  const best = [...trap2,...trap3,...trap4]
    .sort((a,b)=>a.solutions.length-b.solutions.length)
    .slice(0,20)

  postMessage({

    results,
    trap2,
    trap3,
    trap4,
    best

  })

}

}