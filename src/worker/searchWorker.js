let commonWords = []
let extraWords = []

let commonWordSet = new Set()

const trapCache = new Map()

class TrieNode{
  constructor(){
    this.children = {}
    this.words = []
  }
}

const commonTrie = new TrieNode()
const extraTrie = new TrieNode()
const allTrie = new TrieNode()

function insertWord(root,word){

  let node = root

  for(const c of word){

    if(!node.children[c]){
      node.children[c] = new TrieNode()
    }

    node = node.children[c]

    node.words.push(word)

  }

}

function buildTrie(words,root){

  for(const w of words){
    insertWord(root,w)
  }

}

function searchTrie(root,prefix){

  let node = root

  for(const c of prefix){

    if(!node.children[c]){
      return []
    }

    node = node.children[c]

  }

  return node.words

}

function mergeTrieWords(root){

  const stack = [root]

  while(stack.length){

    const node = stack.pop()

    for(const c in node.children){

      const child = node.children[c]

      child.words = [...child.words]

      stack.push(child)

    }

  }

}

function getResponses(trap,trie){

  const list = searchTrie(trie,trap)

  const responses = []

  for(const w of list){

    if(
      w !== trap &&
      !commonWordSet.has(trap+"s") &&
      !commonWordSet.has(trap+"es")
    ){
      responses.push(w)
    }

  }

  return responses

}

function buildTraps(prefix,len,trie){

  const cacheKey = prefix+"-"+len

  if(trapCache.has(cacheKey)){
    return trapCache.get(cacheKey)
  }

  const playable = searchTrie(trie,prefix)

  const trapMap = new Map()

  for(const word of playable){

    if(word.length <= prefix.length + len) continue

    const trap = word.slice(-len)

    const responses = getResponses(trap,trie)

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

    buildTrie(commonWords,commonTrie)
    buildTrie(commonWords,allTrie)

    return

  }

  if(type==="LOAD_EXTRA"){

    extraWords = payload

    buildTrie(extraWords,extraTrie)
    buildTrie(extraWords,allTrie)

    mergeTrieWords(allTrie)

    return

  }

  if(type==="SEARCH"){

    const prefix = payload

    const common = searchTrie(commonTrie,prefix)
    const extra = searchTrie(extraTrie,prefix)

    const resultsCommon = common.slice(0,30)

    let resultsExtra = []

    if(resultsCommon.length < 30){
      resultsExtra = extra.slice(0,30-resultsCommon.length)
    }

    const traps2 = buildTraps(prefix,2,commonTrie).slice(0,10)
    const traps3 = buildTraps(prefix,3,commonTrie).slice(0,10)
    const traps4 = buildTraps(prefix,4,commonTrie).slice(0,10)

    const best = [
      ...buildTraps(prefix,2,allTrie),
      ...buildTraps(prefix,3,allTrie),
      ...buildTraps(prefix,4,allTrie)
    ]
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