import React, { useRef } from 'react'
import { doSearch } from './utils'
import './style.scss'



export default function SearchInput () {
  const inputRef = useRef<HTMLInputElement>(null)
  
  return (
  <div className="search">
    <input type="text" autoFocus className="search-term" ref={inputRef} onKeyUp={onKeyUp} placeholder="searching for power!" />
    <button type="button" className="search-button" onClick={e => onSumbit(inputRef.current?.value) }>Search</button>
  </div>
  )
}

function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.keyCode === 13) {
    // @ts-ignore
    onSumbit(e.target.value)
  }
}

function onSumbit(val?: string) {
  if (!val || !val.trim()) return
  const kwd = val.trim()
  console.warn(kwd)
  doSearch('google', kwd)
}