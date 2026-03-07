import { useState, useEffect } from "react"

export default function SearchBar({ onSearch }) {

  const [query, setQuery] = useState("")

  useEffect(() => {

    const t = setTimeout(() => {
      onSearch(query)
    }, 150)

    return () => clearTimeout(t)

  }, [query])

  return (

    <input
      className="search"
      placeholder="Type starting letters..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      onFocus={() => setQuery("")}
    />

  )
}