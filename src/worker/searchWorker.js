let words = []

// prefix index
const prefixMap = new Map()

// build prefix index once
function buildIndex(){

  for(const w of words){

    for(let i=1;i<=4;i++){

      if(w.length < i) break

      const p = w.slice(0,i)

      if(!prefixMap.has(p)){
        prefixMap.set(p,[])
      }

      prefixMap.get(p).push(w)

    }

  }

}

// fast prefix search
function search(prefix){

  if(!prefix) return []

  return prefixMap.get(prefix) || []

}

// build traps
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

  if(type==="LOAD"){

    words = payload

    buildIndex()

    return

  }

  if(type==="SEARCH"){

    const allResults = search(payload)

    const results = allResults.slice(0,30)

    const trap2 = buildTraps(allResults,2)
    const trap3 = buildTraps(allResults,3)
    const trap4 = buildTraps(allResults,4)

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