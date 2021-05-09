import mirrors from './mirrors'

const APP_START_AT = Date.now()

export function isUrlAccessible(url: string, isImg?: boolean) {
  let imageUrl = url
  const startedAt = Date.now()
  if (!isImg) {
    const u = new URL(url)
    imageUrl = u.origin + '/favicon.ico?t=' + Math.random()
  }
  const img = new Image()
  img.referrerPolicy = 'no-referrer'
  return new Promise<{url: string, time: number, isFailed?: boolean}>((resolve) => {
    img.onload = () => {
      resolve({url, time: Date.now() - startedAt})
    }
    img.onerror = (e) => {
      resolve({isFailed: true, url, time: Date.now() - startedAt})
    }
    img.src = imageUrl
  })
}

export function isUrlsAccessible(urls: string[], maxParallel = 5) {
  const tasks = urls.slice(0).reverse()
  let isFullFilled = false
  return new Promise<{isFailed: boolean, url: string}>((resolve) => {
    const doCallback = (result: any) => {
      if (isFullFilled) return
      isFullFilled = true
      resolve(result)
    }
  
    const doNext = () => {
      if (isFullFilled) return
      const nextUrl = urls.pop()
      if (nextUrl) {
        checkUrl(nextUrl)
      } else {
        resolve({isFailed: true, url: urls[0]})
      }
    }
  
    const checkUrl = (url: string) => {
      isUrlAccessible(url)
      .then(res => {
        res.isFailed || doCallback(res)
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

export interface IMirrorResult {
  isFailed?: boolean,
  url: string
}

const mirrorsResult: { [k: string]: Promise<IMirrorResult> } = {};

export function getAvailableMirrorOf(type: string): Promise<IMirrorResult> {
  const promise = mirrorsResult[type]
  if (promise) return promise
  // @ts-ignore
  const mirror = mirrors[type]
  const result = new Promise<IMirrorResult>((resolve) =>{
    setTimeout(() => {
      isUrlsAccessible(mirror.urls).then(resolve)
    }, Math.max(200 - (Date.now() - APP_START_AT), 0) )
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
  const url = result.url + mirror.path
  openUrl(url.replace('%q', encodedKwd))
}

export function openUrl(url: string) {
  const link = document.createElement('a')
  link.setAttribute('rel', 'noopener noreferrer')
  link.href = url
  link.click()
}