let words = []

const index = new Map()

const banned = [
  "s",
  "es",
  "ed",
  "er",
  "ers",
  "ing",
  "ings",
  "ly"
]

const spamEndings = [

  "ters",
  "setter",
  "seller",
  "raph",
  "graph",
  "grapher",
  "ally",
  "ically",
  "ality",
  "alism",
  "ation",
  "ations",
  "izer",
  "izers",
  "iness",
  "inesses",
  "ines",
  "eines",
  "eise",
  "heimer",
  "stein",
  "ology",
  "ologist",
  "ologists",
  "arium",
  "ariums",
  "esque",
  "esques",
  "scape",
  "scapes",
  "storm",
  "caster",
  "casters",
  "blade",
  "blades",
  "smith",
  "smiths",
  "craft",
  "crafter",
  "crafters",
  "mancer",
  "mancers",
  "phobia",
  "phobias",
  "phile",
  "philes",
  "verse",
  "verses",
  "zilla",
  "tron",
  "topia",
  "topiae",
  "topia",
  "topiae",
  "topia",
  "topiae",
  "topia",
  "ream",
  "lers",
  "omo",
  "hm",
  "eaux",
  "tion",
  "sion",
  "cious",
  "tious",
  "gasm",
  "gasms",
  "tainment",
  "tainments",
  "tainmental",
  "tainmentally"

]

function buildIndex(){

  for(const word of words){

    if(word.length < 3) continue

    for(let i=1;i<=8;i++){

      if(word.length < i) break

      const key = word.slice(0,i)

      if(!index.has(key)){
        index.set(key,[])
      }

      index.get(key).push(word)

    }

  }

}

function sortWords(arr){

  return [...arr].sort((a,b)=>{

    if(a.length !== b.length){
      return a.length - b.length
    }

    return a.localeCompare(b)

  })

}

function search(start,end=""){

  let results = []

  if(start){

    results = index.get(start) || []

  }else{

    results = words

  }

  results = results.filter(w=>w.length >= 3)

  if(end){

    results = results.filter(w=>w.endsWith(end))

  }

  return sortWords(results).slice(0,30)

}

function isFakeTrap(trap,word){

  if(word === trap){
    return true
  }

  if(word.length - trap.length <= 2){
    return true
  }

  for(const b of banned){

    if(word === trap + b){
      return true
    }

  }

  return false

}

function getResponses(trap){

  const list = index.get(trap) || []

  const valid = []

  for(const w of list){

    if(w.length < 3) continue

    if(isFakeTrap(trap,w)){
      return []
    }

    valid.push(w)

    if(valid.length > 7){
      return []
    }

  }

  return sortWords(valid)

}

function buildTraps(prefix,len,max=7){

  const playable = index.get(prefix) || []

  const out = []

  const used = new Set()

  for(const playWord of playable.slice(0,220)){

    if(playWord.length <= prefix.length + len){
      continue
    }

    const trap = playWord.slice(-len)

    if(trap.length < 3){
      continue
    }

    if(used.has(trap)){
      continue
    }

    used.add(trap)

    const responses = getResponses(trap)

    if(
      responses.length > 0 &&
      responses.length <= max
    ){

      out.push({
        play:playWord,
        trap,
        solutions:responses
      })

    }

  }

  return out

}

function buildSpam(prefix){

  const playable = index.get(prefix) || []

  const categories = {

    ters: [],
    ler: [],
    raph: [],
    ally: [],
    omo: [],
    ines: [],
    ion: []

  }

  for(const w of playable.slice(0,1200)){

    if(w.length < 5) continue

    if(w.endsWith("ters")){
      categories.ters.push(w)
    }

    if(
      w.endsWith("ler") ||
      w.endsWith("lers")
    ){
      categories.ler.push(w)
    }

    if(
      w.endsWith("raph") ||
      w.endsWith("graph")
    ){
      categories.raph.push(w)
    }

    if(
      w.endsWith("ally") ||
      w.endsWith("ically")
    ){
      categories.ally.push(w)
    }

    if(
      w.endsWith("omo")
    ){
      categories.omo.push(w)
    }

    if(
      w.endsWith("ines") ||
      w.endsWith("eines")
    ){
      categories.ines.push(w)
    }

    if(
      w.endsWith("tion") ||
      w.endsWith("ation")
    ){
      categories.ion.push(w)
    }

  }

  const result = []

  function addSome(arr,label,max=6){

    const sorted = sortWords(arr)

    for(const word of sorted.slice(0,max)){

      result.push({
        word,
        ending:label
      })

    }

  }

  addSome(categories.ters,"ters")
  addSome(categories.ler,"ler")
  addSome(categories.raph,"raph")
  addSome(categories.ally,"ally")
  addSome(categories.omo,"omo")
  addSome(categories.ines,"ines")
  addSome(categories.ion,"ion")

  return result.slice(0,40)

}

self.onmessage = e =>{

  const {type,payload} = e.data

  if(type==="LOAD_WORDS"){

    words = payload
      .map(w=>w.trim().toLowerCase())
      .filter(w=>w.length >= 3)

    buildIndex()

    return

  }

  if(type==="SEARCH"){

    const raw = payload.toLowerCase()

    let start = ""
    let end = ""

    if(raw.startsWith(" ")){

      end = raw.trim()

    }else{

      const parts = raw.split(" ")

      start = parts[0] || ""
      end = parts[1] || ""

    }

    const results = search(start,end)

    let traps3 = []
    let traps4 = []
    let best = []

    if(start){

      traps3 = buildTraps(start,3).slice(0,10)

      traps4 = buildTraps(start,4).slice(0,10)

      best = [
        ...buildTraps(start,3,1),
        ...buildTraps(start,4,1)
      ].slice(0,10)

    }

    const spam = start
      ? buildSpam(start)
      : []

    postMessage({
      results,
      best,
      traps3,
      traps4,
      spam
    })

  }

}