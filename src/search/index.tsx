import React, { useRef, useState, useEffect } from 'react'
import { doSearch, getAvailableMirrorOf, initialSearchParams, getAlternativeMirrorOf } from './utils'
import './style.scss'

const searchCategories = [
  {
    name: 'google',
    help: () => {
      const [url, setUrl] = useState({})
      useEffect(() => {
        getAvailableMirrorOf('google').then(u => setUrl(u))
      }, [])
      return (<span>
        using mirror for Google search: <SLink {...url} />,
        for more visit <SLink url={getAlternativeMirrorOf('google')} title='Mirrors' />
        </span>)
    }
  },
  {
    name: 'wiki',
    help: () => {
      const [url, setUrl] = useState({})
      useEffect(() => {
        getAvailableMirrorOf('wiki').then(u => setUrl(u))
      }, [])
      return <span>using mirror for Wiki search: <SLink {...url} /></span>
    }
  },
  {
    name: 'scholar',
    help: () => {
      const [url, setUrl] = useState({})
      const [sci, setSci] = useState({})
      useEffect(() => {
        getAvailableMirrorOf('scholar').then(u => setUrl(u))
        getAvailableMirrorOf('sci-hub').then(u => setSci(u))
      }, [])
      // @ts-ignore
      return (<span>using mirror for Scholar search: <SLink {...url} /> {sci.url ? <>, or you can try <SLink {...sci} title="sci-hub" /> instead</> : '' }</span>)
    }
  }
]

export default function SearchInput () {
  const inputRef = useRef<HTMLInputElement>(null)
  const [cat, setCat] = useState(initialSearchParams.type)

  useEffect(() => {
    if (!initialSearchParams.q) return
    doSearch(initialSearchParams.type, initialSearchParams.q)
    if (inputRef.current) {
      inputRef.current.value = initialSearchParams.q
    }
  }, [])

  const onChangeCat = (c: string) => {
    setCat(c)
    history.replaceState({}, '', `?type=${c}`)
    inputRef.current?.focus()
  }

  return (
  <div className="search">
    <ul className="search-cat">
    {searchCategories.map(category => <li className={category.name === cat ? 'active' : ''} key={category.name} onClick={e => onChangeCat(category.name)}>{category.name}</li>)}
    </ul>
    <div className="search-field">
      <input type="search" autoFocus className="search-term" ref={inputRef} onKeyUp={e => onKeyUp(e, cat)} placeholder="searching the world" />
      <button type="button" className="search-button" onClick={e => onSubmit(cat, inputRef.current?.value) }>Search</button>
    </div>
    <HelpInfo cat={cat} />
  </div>
  )
}

function SLink(props: {isFailed?: boolean, url?: string, title?: string}) {
  return props.url ? <a className={props.isFailed ? 'is-failed' : ''} href={props.url} target="_blank">{props.title || props.url}</a> : <>detecting...</>
}

function HelpInfo (props: {cat: string}) {
  const Tip = searchCategories.find(category => category.name === props.cat)?.help
  return Tip ? <div className="help"><Tip /></div> : null
}

function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>, cat: string) {
  if (e.keyCode === 13) {
    // @ts-ignore
    onSubmit(cat, e.target.value)
  }
}

function onSubmit(cat: string, val?: string) {
  if (!val || !val.trim()) return
  const kwd = val.trim()
  doSearch(cat, kwd)
}