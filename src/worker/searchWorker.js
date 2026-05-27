let commonWords = []
let extraWords = []

const commonIndex = new Map()
const extraIndex = new Map()
const allIndex = new Map()

const spamCategories = [
  "ters",
  "ally",
  "omo",
  "ler",
  "raph",
  "ines",
  "hm",
  "eise",
  "ream",
  "enders"
]

// ---------------- INDEX ----------------

function buildIndex(words,map){

  for(const w of words){

    for(let i=1;i<=6;i++){

      if(w.length < i) break

      const p = w.slice(0,i)

      if(!map.has(p)){
        map.set(p,[])
      }

      map.get(p).push(w)

    }

  }

}

// ---------------- MERGE ----------------

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

// ---------------- QUERY ----------------

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

  }else{

    prefix = parts[0]
    suffix = parts[1]

  }

  return {prefix,suffix}

}

// ---------------- FILTER ----------------

function filterWords(words,prefix,suffix){

  return words
  .filter(w=>{

    if(prefix && !w.startsWith(prefix)) return false
    if(suffix && !w.endsWith(suffix)) return false

    return true

  })
  .sort((a,b)=>a.length-b.length)

}

// ---------------- RESPONSE ----------------

function getResponses(trap,index){

  if(!index) return []

  const list = index.get(trap) || []

  return list.filter(w=>{

    if(w===trap) return false

    const add = w.slice(trap.length)

    const commonCheap = [
      "s",
      "es",
      "ed",
      "d",
      "er",
      "ers",
      "ing",
      "ly",
      "e"
    ]

    if(commonCheap.includes(add)) return false

    return true

  })

}

// ---------------- VALID TRAP ----------------

function validTrap(trap,responses){

  if(responses.length===0) return false

  // STRICT AUTO VALID
  const allBig = responses.every(
    r=>r.length >= trap.length+3
  )

  if(allBig) return true

  // SMALL EXTENSION CHECK
  for(const r of responses){

    const add = r.slice(trap.length)

    const cheap = [
      "s",
      "es",
      "ed",
      "d",
      "er",
      "ers",
      "e",
      "ly",
      "ing"
    ]

    if(cheap.includes(add)){
      return false
    }

  }

  return true

}

// ---------------- BUILD TRAPS ----------------

function buildTraps(prefix,len,index){

  if(!index || !prefix) return []

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
        solutions:responses
        .sort((a,b)=>a.length-b.length)
        .slice(0,6),
        plays:[]
      })

    }

    trapMap.get(trap).plays.push(word)

  }

  return Array
  .from(trapMap.values())
  .sort((a,b)=>a.solutions.length-b.solutions.length)

}

// ---------------- SPAMS ----------------

function buildSpam(prefix,index){

  if(!prefix) return []

  const playable = index.get(prefix) || []

  const result = []

  for(const word of playable){

    for(const spam of spamCategories){

      if(word.endsWith(spam)){

        result.push({
          ending:spam,
          play:word
        })

      }

    }

  }

  return result.slice(0,30)

}

// ---------------- MAIN ----------------

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

    let common = filterWords(
      commonWords,
      prefix,
      suffix
    )

    let extra = filterWords(
      extraWords,
      prefix,
      suffix
    )

    const resultsCommon = common.slice(0,30)

    const resultsExtra =
    extra.slice(0,20)

    const traps3 =
    buildTraps(prefix,3,commonIndex)
    .slice(0,10)

    const traps4 =
    buildTraps(prefix,4,commonIndex)
    .slice(0,10)

    const best = [
      ...buildTraps(prefix,3,allIndex),
      ...buildTraps(prefix,4,allIndex)
    ]
    .filter(t=>t.solutions.length<=2)
    .slice(0,20)

    const spammable =
    buildSpam(prefix,allIndex)

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