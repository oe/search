import React, { useEffect, useRef, useState } from 'react'
import { getCache, saveCache } from '../common/utils'
import { isUrlAccessible } from '../search/utils'
import './style.scss'

const IS_MOBILE = window.screen.width <= 640
const TOKEN = '563492ad6f91700001000001f3033fed2e21442a8816554456902bc5'
const BASE_URL = 'https://api.pexels.com/v1/'
const TIME_GAP = 5 * 60 * 1000

export default function Bg() {
  const ref = useRef<HTMLDivElement>(null)
  const timeRef = useRef<any>({tid: 0, tid2: 0})
  const [photo, setPhoto] = useState<IPhoto | undefined>()

  useEffect(() => {
    const updatePhoto = async () => {
      const pho = await getPhoto()
      timeRef.current.lastTime = Date.now()
      timeRef.current.duration = 0
      if (!ref.current || !pho) return
      const imgUrl = getPhotoUrl(pho)
      if (!imgUrl) return
      isUrlAccessible(imgUrl, true).then(() => {
        setPhoto(pho)
        ref.current!.style.backgroundImage = `url(${imgUrl})`
        ref.current!.style.opacity = '1'
      })

    }
    updatePhoto()
    window.addEventListener('blur', () => {
      if (!timeRef.current.duration) timeRef.current.duration = 0
      timeRef.current.duration += timeRef.current.lastTime 
        ? Date.now() - (timeRef.current.lastActive || timeRef.current.lastTime) : 0
      clearTimeout(timeRef.current.tid2)
      clearInterval(timeRef.current.tid)
    })
    window.addEventListener('focus', () => {
      timeRef.current.lastActive = Date.now()
      const timeout = TIME_GAP - timeRef.current.duration
      timeRef.current.tid2 = setTimeout(updatePhoto, timeout < 0 || !timeout ? 0 : timeout)
      timeRef.current.tid = setInterval(updatePhoto, TIME_GAP)
    })
    timeRef.current.tid = setInterval(updatePhoto, TIME_GAP)
  }, [])
  return (
    <div ref={ref} className="bg">
      {photo ? <div className="author">
        <a target="_blank" href={photo.url}> Photo </a> 
         by <a href={photo.photographer_url} target="_blank"> {photo.photographer} </a>
        from <a target="_blank" href="https://www.pexels.com/">Pexels</a>
      </div> : null}
    </div>
  )
}

async function getPhoto() {
  try {
    const result = getCache('bg') as ICache | undefined
    let photos: IPhoto[] = []
    let photo: IPhoto
    let page = 1
    if (result && result.photos && result.photos.length) {
      page = result.page
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
    saveCache('bg', { photos, page, id: photo && photo.id })
    if (!photo) return
    return photo
  } catch (error) {
    console.warn('failed to get wallpaper', error)
  }
}

function getPhotoUrl(photo?: IPhoto) {
  if (!photo) return
  const srcs = photo.src
  return IS_MOBILE && srcs.portrait || srcs.landscape || srcs.original
}

interface ICache {
  photos: Array<IPhoto>
  page: number
  id: number
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
