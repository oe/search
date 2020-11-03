import React, { useRef, useState, useEffect } from 'react'
import { doSearch, getAvailableMirrorOf, initialSearchParams, IMirrorResult } from './utils'
import './style.scss'


const searchCategories = [
  {
    name: 'google',
    help: () => {
      const [url, setUrl] = useState('')
      useEffect(() => {
        getAvailableMirrorOf('google').then(u => setUrl(u.url))
      }, [])
      return <span>using mirror for Google search: {!url ? 'detecting' : <a href={url} target="_blank">{url}</a>}</span>
    }
  },
  {
    name: 'wiki',
    help: () => {
      const [url, setUrl] = useState('')
      useEffect(() => {
        getAvailableMirrorOf('wiki').then(u => setUrl(u.url))
      }, [])
      return <span>using mirror for Wiki search: {!url ? 'detecting' : <a href={url} target="_blank">{url}</a>}</span>
    }
  },
  {
    name: 'scholar',
    help: () => {
      const [url, setUrl] = useState('')
      const [sci, setSci] = useState('')
      useEffect(() => {
        getAvailableMirrorOf('scholar').then(u => setUrl(u.url))
        getAvailableMirrorOf('sci-hub').then(u => setSci(u.url))
      }, [])
      return (<span>using mirror for Scholar search: {!url ? 'detecting' : <a href={url} target="_blank">{url}</a>} {sci ? <>, or you can try <a href={sci} target="_blank">sci-hub</a> instead</> : '' }</span>)
    }
  }
]


export default function SearchInput () {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cat, setCat] = useState(initialSearchParams.type)
  const onChnageCat = (c: string) => {
    setCat(c)
    inputRef.current?.focus()
  }
  return (
  <div className="search">
    <ul className="search-cat">
    {searchCategories.map(category => <li className={category.name === cat ? 'active' : ''} key={category.name} onClick={e => onChnageCat(category.name)}>{category.name}</li>)}
    </ul>
    <div className="search-field">
      <input type="text" autoFocus className="search-term" ref={inputRef} onKeyUp={e => onKeyUp(e, cat)} placeholder="searching for power!" />
      <button type="button" className="search-button" onClick={e => onSumbit(cat, inputRef.current?.value) }>Search</button>
    </div>
    <HelpInfo cat={cat} />
  </div>
  )
}


// function SLink(props: IMirrorResult) {

// }


function HelpInfo (props: {cat: string}) {
  const Tip = searchCategories.find(category => category.name === props.cat)?.help
  return Tip ? <div className="help"><Tip /></div> : null
}

function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>, cat: string) {
  if (e.keyCode === 13) {
    // @ts-ignore
    onSumbit(cat, e.target.value)
  }
}

function onSumbit(cat: string, val?: string) {
  if (!val || !val.trim()) return
  const kwd = val.trim()
  console.warn(kwd)
  doSearch(cat, kwd)
}