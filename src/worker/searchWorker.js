let words = []

function search(prefix) {
  if (!prefix) return []

  prefix = prefix.toLowerCase()

  const results = []
  for (let w of words) {
    if (w.startsWith(prefix)) {
      results.push(w)
      if (results.length > 500) break
    }
  }

  return results
}

function findTraps(results, length) {
  const traps = {}

  for (let w of results) {
    if (w.length <= length) continue

    const ending = w.slice(-length)

    if (!traps[ending]) traps[ending] = []
    traps[ending].push(w)
  }

  return Object.entries(traps)
    .map(([ending, solutions]) => ({ ending, solutions }))
    .filter(t => t.solutions.length <= 7 && t.solutions.length > 0)
}

self.onmessage = e => {
  const { type, payload } = e.data

  if (type === "LOAD") {
    words = payload
    return
  }

  if (type === "SEARCH") {
    const results = search(payload)

    const trap2 = findTraps(results, 2)
    const trap3 = findTraps(results, 3)
    const trap4 = findTraps(results, 4)

    postMessage({
      results,
      trap2,
      trap3,
      trap4
    })
  }
}