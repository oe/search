const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      'https://www.google.com',
      'https://goo.gle.workers.dev',
      'https://gl.ry4.me',
      'https://chacha.design',
      'https://gogoo.ml',
      'https://www.lovec.ltd',
      'https://g.jnkip.cn',
      'https://gug1.icu',
      'https://g.caduo.ml',
      'https://so.roy233.com',
    ],
    alternative: 'https://www.library.ac.cn'
  },
  wiki: {
    name: 'wiki',
    path: '/wiki/Special:Search/%q',
    urls: [
      'https://www.wikipedia.org',
      'https://www.wikipedia.iwiki.eu.org',
      'https://wiki.ry4.me'
    ],
  },
  scholar: {
    name: 'scholar',
    path: '/scholar?q=%q',
    urls: [
      'https://scholar.google.com',
      'https://so.hiqq.com.cn',
      'https://sc.panda321.com',
      'https://xueshu.lanfanshu.cn',
      'https://xueshu.soogle.top',
      'https://x.sci-hub.org.cn',
    ]
  },
  'sci-hub': {
    name: 'sci-hub',
    urls: [
      'https://sci-hub.tf',
      'https://sci-hub.ren',
      'https://sci-hub.st',
      'https://sci-hub.se',
    ]
  }
}

console.log('Google mirrors form Universities: https://www.library.ac.cn/')

export default mirrors