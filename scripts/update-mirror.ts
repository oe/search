import fs from 'fs'
import jsdom from 'jsdom'
import path from 'path'

const { JSDOM } = jsdom

const destPath = path.join(__dirname, '../src/search/mirrors.json')

const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      "https://www.google.com",
      'https://so.niostack.com/',
      'https://g.savalone.com/',
      'https://g.luciaz.me/',
    ],
    alternative: 'https://mirror.js.org/'
  },
  wiki: {
    name: 'wiki',
    path: '/wiki/Special:Search/%q',
    urls: [
      "https://www.wikipedia.org/",
      "https://54e1ad4b4888.kfd.me/",
      "https://zh-two.iwiki.icu/",
      "https://wiwiki.kfd.me/",
    ],
  },
  scholar: {
    name: 'scholar',
    path: '/scholar?q=%q',
    urls: [
      "https://scholar.google.com",
      "https://xueshu.lanfanshu.cn/",
      "https://xs.hiqq.com.cn/",
      "https://x.sci-hub.org.cn/",
      "https://sc.panda985.com/",
      'https://scholar.lanfanshu.cn',
      'https://sc.panda321.com/',
    ],
    alternative: 'https://ac.scmor.com/'
  },
  'sci-hub': {
    name: 'sci-hub',
    urls: [
      'https://sci-hub.ren/',
      'https://sci-hub.ee/',
    ]
  }
} as const

async function updateMirrors() {

  const idMap = {
    google: '谷歌搜索',
    wiki: '维基百科',
    scholar: '谷歌学术',
    'sci-hub': 'sci-hub'
  }

  try {
    const dom = await JSDOM.fromURL('https://mirror.js.org/')
    const doc = dom.window.document
    Object.keys(idMap).forEach(id => {
      const name = idMap[id]
      const secTitle = doc.getElementById(name)
      if (!secTitle) return
      const urls: string[] = []
      let sec = secTitle.nextElementSibling
      while (sec && sec.tagName !== 'H2') {
        if (sec.tagName === 'P' && /(https?:[a-z\d./&?=-]+)/i.test(sec.textContent || '')) {
          try {
            const url = new URL(RegExp.$1.trim())
            // ignore url if has path
            if (url.pathname === '/') {
              urls.push(url.href) 
            }
          } catch (error) {
            console.log('\tinvalid url', RegExp.$1.trim())
          }
        }
        sec = sec.nextElementSibling
      }
      if (urls.length) {
        mirrors[id].urls.push(...urls)
      }
    })
  } catch (error) {
    if (process.env.IS_SCHEDULE) {
      throw error
    }
  }

  Object.keys(mirrors).forEach(key => {
    const mirror = mirrors[key]
    mirror.urls = mirror.urls.filter((url, index, arr) => url && arr.indexOf(url) === index)
  })
}

async function checkMirrors() {
  const keys = Object.keys(mirrors)
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const mirror = mirrors[key]
    const availableUrls = await asyncFilter(mirror.urls, isUrlAvailable)
    if (availableUrls.length) {
      mirror.urls = availableUrls
    } 
  }
}


function asyncFilter<T>(arr: T[], predicate: (item: T) => Promise<boolean>) {
  return Promise.all(arr.map(predicate)).then((results) => {
    return arr.filter((_v, index) => results[index])
  })
}


async function isUrlAvailable(url: string) {
  return new Promise<boolean>(resolve => {
    const abortcontroller = new AbortController()
    const { signal } = abortcontroller
    setTimeout(() => {
      abortcontroller.abort()
    }, 2000);
    fetch(url, {
      method: 'HEAD',
      signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' }
    })
      .then(res => {
        resolve(res.status === 200)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

function needUpdate() {
  try {
    const stat = fs.statSync(destPath)
    // update more than 10 minutes
    return (Date.now() - stat.mtime.getTime()) > 1000 * 60 * 10
  } catch (error) {
    return true
  }
}

async function main() {
  const isDev = process.argv.includes('--dev')
  if (isDev && !needUpdate()) {
    console.log('\tskip mirror update')
    return
  }
  console.log('update mirrors')
  await updateMirrors()
  console.log('check mirrors availability')
  await checkMirrors()
  fs.writeFileSync(destPath, JSON.stringify(mirrors, null, 2))
}


main()