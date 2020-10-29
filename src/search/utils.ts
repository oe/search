
export function isUrlAccessible(url: string) {
  const u = new URL(url)
  const imageUrl = u.origin + '/favicon.ico'
  const startedAt = Date.now()
  const img = new Image()
  return new Promise((resolve, reject) => {
    img.onload = () => {
      resolve({url, time: Date.now() - startedAt})
    }
    img.onerror = (e) => {
      console.log(e)
      reject({url, time: Date.now() - startedAt, e})
    }
    img.src = imageUrl
  })
}

export function isUrlsAccessible(urls: string[], callback: Function, maxParallel = 5, needFirstOnly = true) {
  const tasks = urls.slice(0).reverse()
  let isFullFilled = false

  const doCallback = (result: any) => {
    if (isFullFilled) return
    if (needFirstOnly) isFullFilled = true
    callback(result)
  }

  const doNext = () => {
    if (isFullFilled) return
    const nextUrl = urls.pop()
    if (nextUrl) {
      checkUrl(nextUrl)
    }
  }

  const checkUrl = (url: string) => {
    isUrlAccessible(url)
    .then(res => {
      doCallback(res)
      doNext()
    })
    .catch(e => {
      doNext()
    })
  }

  tasks.splice(-maxParallel).forEach(checkUrl)
}