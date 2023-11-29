import urlConfig from './url-config.json'

const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      "https://www.google.com",
      'http://45.32.251.247/',
      'https://so.niostack.com/',
      'https://g.savalone.com/',
      'https://xn--flw351e.mc-serve.cf/',
      'https://ge2.azurewebsites.net/',
      'https://g.luciaz.me/',
      'https://xgoogle.xyz/',
    ].concat(urlConfig.google),
    alternative: 'https://mirror.js.org/'
  },
  wiki: {
    name: 'wiki',
    path: '/wiki/Special:Search/%q',
    urls: [
      "https://www.wikipedia.org/",
      'https://zh-one.iwiki.icu/',
      'https://www.baidu.wikimirror.net/',
    ].concat(urlConfig.wiki)
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
      'https://so2.pismin.com/',
    ].concat(urlConfig.scholar),
    alternative: 'https://ac.scmor.com/'
  },
  'sci-hub': {
    name: 'sci-hub',
    urls: [
      'https://sci-hub.ren/',
      'https://sci-hub.mobi/',
      'https://sci-hub.ee/',
      'https://www.sci-hub.live/'
    ]
  }
}

console.log(`more Google mirrors: ${mirrors.google.alternative}`)

export default mirrors