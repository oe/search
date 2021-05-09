import React, { useEffect, useRef } from 'react'
import './style.scss'

const IS_MOBILE = window.screen.width <= 640
const CACHE_KEY = '__background_cache__'
const TOKEN = '563492ad6f91700001000001f3033fed2e21442a8816554456902bc5'
const BASE_URL = 'https://api.pexels.com/v1/'

export default function Bg() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const setPhoto = async () => {
      const url = await getPhoto()
      if (!ref.current || !url) return
      ref.current.style.backgroundImage = `url(${url})`
    }
    setPhoto()
    setInterval(setPhoto, 5 * 60 * 1000)
  }, [])
  return (
    <div ref={ref} className="bg" />
  )
}

async function getPhoto() {
  try {
    const result = getCache()
    let photos: IPhoto[] = []
    let photo: IPhoto
    let page = 1
    if (result && result.photos && result.photos.length) {
      photos = result.photos
    } else {
      photos = await fetchPhotos({ path: 'curated', query: { per_page: 20, page }})
    }
    if (result) {
      const idx = result.photos.findIndex(p => p.id === result.id)
      if (idx === -1) {
        photo = result.photos[0]
      } else if ((idx + 1) >= result.photos.length) {
        page = result.page + 1
        photos = await fetchPhotos({
          path: 'curated',
          query: { per_page: 20, page }
        })
        photo = photos[0]
      } else {
        photo = result.photos[idx + 1]
      }
    } else {
      photo = photos[0]
    }
    saveCache({ photos, page, id: photo && photo.id })
    if (!photo) return
    const srcs = photo.src
    return IS_MOBILE && srcs.portrait || srcs.landscape || srcs.original
  } catch (error) {
    console.warn('failed to get wallpaper', error)
  }
}

interface ICache {
  photos: Array<IPhoto>
  page: number
  id: number
}

function getCache() {
  try {
    const valStr = localStorage.getItem(CACHE_KEY)
    return valStr ? JSON.parse(valStr) as ICache : undefined
  } catch (error) {
    return
  }
}

function saveCache(obj: any) {
  const existing = getCache()
  localStorage.setItem(CACHE_KEY, JSON.stringify(Object.assign({}, existing, obj)))
}


interface IPhotoOptions {
  path: string
  query?: Record<string, any>
}

function fetchPhotos(options: IPhotoOptions): Promise<Array<IPhoto>> {
  const headers = new Headers({ Authorization: TOKEN })
  const url = BASE_URL + options.path + '?' + new URLSearchParams(options.query)
  return fetch(url, {
    method: 'GET',
    headers,
  })
  .then(res => res.json())
  .then(res => res.photos)
}

interface IPhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

interface IPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: Partial<IPhotoSrc>;
  liked: boolean;
}
