import mirrors from './mirrors.json'
import { getCache, saveCache } from '../common/utils'

const APP_START_AT = Date.now()

// 5 minutes
const MAX_CACHE_TIME = 1000 * 60 * 5

export function isUrlAccessible(url: string, isImg?: boolean) {
  let imageUrl = url
  const startedAt = Date.now()
  if (!isImg) {
    const u = new URL(url)
    imageUrl = u.origin + '/favicon.ico?t=' + Math.random()
  }
  const img = new Image()
  img.referrerPolicy = 'no-referrer'
  return new Promise<IMirrorResult>((resolve) => {
    img.onload = () => {
      const now = Date.now()
      resolve({url, duration: now - startedAt, time: now})
    }
    img.onerror = (e) => {
      resolve({isFailed: true, url, time: Date.now()})
    }
    img.src = imageUrl
  })
}

export function isUrlsAccessible(urls: string[], maxParallel = 5) {
  const tasks = urls.slice(0).reverse()
  let isFullFilled = false
  let taskCount = urls.length
  return new Promise<IMirrorResult>((resolve) => {
    const doCallback = (result: any) => {
      if (isFullFilled) return
      isFullFilled = true
      resolve(result)
    }
  
    const doNext = () => {
      if (isFullFilled) return
      const nextUrl = tasks.pop()
      if (nextUrl) {
        checkUrl(nextUrl)
      } else if (!taskCount) {
        resolve({isFailed: true, time: Date.now(), url: urls[0]})
      }
    }
  
    const checkUrl = (url: string) => {
      isUrlAccessible(url)
      .then(res => {
        if (!res.isFailed) doCallback(res)
        --taskCount
        doNext()
      })
    }
  
    tasks.splice(-maxParallel).forEach(checkUrl)
  })
}


export function getCurrentSearchParams() {
  const search = location.search.replace(/^\?/, '')
  if (!search) return {
    type: 'google',
    q: ''
  }
  const searchParams = new URLSearchParams(search)
  
  const result = {
    type: searchParams.get('type') || 'google',
    q: searchParams.get('q')
  }
  // @ts-ignore
  if (!mirrors[result.type]) {
    result.type = 'google'
  }
  return result
}

export const initialSearchParams = getCurrentSearchParams()

function encodeQuery (kwd: string) {
  return encodeURIComponent(kwd).replace(/%20/g, "+")
}

export type IMirrorResult = {
  isFailed?: false,
  url: string
  duration: number
  /** result time */
  time: number
} | {
  isFailed: true,
  url: string
  time: number
}

const mirrorsResult: { [k: string]: Promise<IMirrorResult> } = {};

export function getAvailableMirrorOf(type: string): Promise<IMirrorResult> {
  const promise = mirrorsResult[type]
  if (promise) return promise
  const cached = getCache('search') as Record<string, IMirrorResult>
  const current = cached && cached[type]
  // result cached in 5 mins
  if (current && Date.now() - current.time < MAX_CACHE_TIME && !current.isFailed) {
    const timeCached = getCache('time') as Record<string, number>
    // page not refresh in 2 seconds
    if (!timeCached || !timeCached[type] || Date.now() - timeCached[type] > 2 * 1000) {
      mirrorsResult[type] = Promise.resolve(current)
      saveCache('time', {[type]: Date.now()})
      return mirrorsResult[type]
    }
  }
  // @ts-ignore
  const mirror = mirrors[type]
  const result = new Promise<IMirrorResult>((resolve) =>{
    setTimeout(() => {
      isUrlsAccessible(mirror.urls).then(resolve)
    }, Math.max(200 - (Date.now() - APP_START_AT), 0) )
  })
  result.then(res => {
    saveCache('search', {[type]: res})
  })
  // @ts-ignore
  mirrorsResult[type] = result
  return result
}

export async function doSearch(type: string, kwd: string) {
  // @ts-ignore
  const mirror = mirrors[type] || mirrors.google
  const encodedKwd = encodeQuery(kwd)
  const result = await getAvailableMirrorOf(mirror.name)
  // @ts-ignore
  const url = result.url.replace(/\/$/, '') + mirror.path
  openUrl(url.replace('%q', encodedKwd))
}

export function openUrl(url: string) {
  const link = document.createElement('a')
  link.setAttribute('rel', 'noopener noreferrer')
  link.href = url
  link.click()
}

export function getAlternativeMirrorOf(type: string) {
  // @ts-ignore
  const mirror = mirrors[type]
  if (!mirror) return null
  return mirror.alternative
}