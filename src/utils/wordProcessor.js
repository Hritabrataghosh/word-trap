class TrieNode {
constructor(){
this.children = {};
this.words = [];
}
}

const root = new TrieNode();
const startIndex = {};

export function loadWords(text){

const valid = /^[a-zA-Z]+$/;

const words = text
.split("\n")
.map(w=>w.trim().toLowerCase())
.filter(w=>valid.test(w));

for(let w of words){

insertTrie(w);

for(let i=2;i<=4;i++){

if(w.length<i) continue;

const start = w.slice(0,i);

if(!startIndex[start]) startIndex[start] = [];
startIndex[start].push(w);

}

}

return words;

}

function insertTrie(word){

let node = root;

for(let c of word){

if(!node.children[c]) node.children[c] = new TrieNode();

node = node.children[c];
node.words.push(word);

}

}

export function fastSearch(prefix){

if(!prefix) return [];

let node = root;

for(let c of prefix){

if(!node.children[c]) return [];

node = node.children[c];

}

return node.words;

}

export function findSearchTraps(results, size){

  const traps = [];

  for (let w of results) {

    if (w.length <= size) continue;

    const ending = w.slice(-size);

    const solutions = startIndex[ending] || [];

    if (solutions.length > 0 && solutions.length <= 7) {
      traps.push({
        word: w,
        ending,
        solutions: solutions.length
      });
    }
  }

  // strongest traps first
  return traps.sort((a,b) => a.solutions - b.solutions);
}