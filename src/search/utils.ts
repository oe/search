import mirrors from './mirrors'

export function isUrlAccessible(url: string) {
  const u = new URL(url)
  const imageUrl = u.origin + '/favicon.ico'
  const startedAt = Date.now()
  const img = new Image()
  return new Promise<{url: string, time: number}>((resolve, reject) => {
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

interface ITask {
  url: string
  taskID: number
}

// all urls need to check
let URLS_QUEUE: ITask[] = []
// max checking task at the same time
const MAX_PARALLEL = 5
// checking task count which are undone
let resInUse = 0
// batch task id
let taskID = 0
// task info, including task count, official url, promise resolve
let taskInfos: {[k: number]: {taskCount: number, resolve: Function, officialUrl: string}} = {}

const doCallback = (result?: any) => {
  // release checking task resource
  --resInUse
  // task is unresolved
  if (taskInfos[result.taskID]) {
    // decrease task count
    --taskInfos[result.taskID].taskCount
    // success
    if (result.url) {
      const cID = result.taskID
      taskInfos[result.taskID].resolve(result)
      // remove all pending task in the queue with the resolved taskID
      URLS_QUEUE = URLS_QUEUE.filter(itm => itm.taskID !== cID)
      delete taskInfos[result.taskID]
      // failed and no more tasks to wait
    } else if (!taskInfos[result.taskID].taskCount) {
      // mark as failed and return the official url
      taskInfos[result.taskID].resolve({fallback: taskInfos[result.taskID].officialUrl})
      delete taskInfos[result.taskID]
    }
  }
  // do rest task in queue by rest resource amount
  if (URLS_QUEUE.length) {
    URLS_QUEUE.splice(0, MAX_PARALLEL - resInUse).forEach(checkUrl)
  }
}

const checkUrl = (task: ITask) => {
  // occupy a resource
  ++resInUse

  isUrlAccessible(task.url)
  .then(res => {
    const result = Object.assign(res, {taskID: task.taskID})
    doCallback(result)
  })
  .catch(e => {
    doCallback({taskID: task.taskID})
  })
}

export function isUrlsAccessible(urls: string[]) {
  ++taskID
  URLS_QUEUE.push(...urls.map(url => ({taskID, url})))
  return new Promise((resolve) => {
    taskInfos[taskID] = {
      taskCount: urls.length,
      resolve,
      officialUrl: urls[0]
    }


    // run
    URLS_QUEUE.splice(0, MAX_PARALLEL - resInUse).forEach(checkUrl)
  })
}

export function getCurrentSearchParams() {
  const search = location.search.replace(/^\?/, '')
  if (!search) return {}
  const searchParams = new URLSearchParams(search)
  return {
    type: searchParams.get('type'),
    q: searchParams.get('q')
  }
}

export const initialSearchParams = getCurrentSearchParams()

type IMirrorResult = {url: string} | {fallback: string}

const mirrorsResult: { [k: string]: Promise<IMirrorResult> } = {};

(function runAllMirrorsCheck() {
  const allMirrors = mirrors.slice()
  if (initialSearchParams.type) {
    const idx = allMirrors.findIndex(mirror => mirror.name === initialSearchParams.type)
    if (idx > 0) {
      const first = allMirrors.splice(idx, 1)
      allMirrors.unshift(first[0])
    }
  }
  allMirrors.map(mirror => {
    const promise = isUrlsAccessible(mirror.urls) as Promise<IMirrorResult>
    mirrorsResult[mirror.name] = promise
  })
})()

function encodeQuery (kwd: string) {
  return encodeURIComponent(kwd).replace(/%20/g, "+")
}
// runAllMirrorsCheck

export async function doSearch(type: string, kwd: string) {
  if (!mirrors.some(mirror => mirror.name === type)) type = 'google'
  const mirror = mirrors.find(mirror => mirror.name === type)
  const encodedKwd = encodeQuery(kwd)
  const result = await mirrorsResult[type]
  // @ts-ignore
  const url = (result.url || result.fallback) + mirror.path
  console.log(result, url, url.replace('%q', encodedKwd))
  location.href = url.replace('%q', encodedKwd)
}