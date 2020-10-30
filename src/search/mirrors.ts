const mirrors = [
  {
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
      'http://map.cnmaps.cn',
      'http://g.histsci.org',
      'https://gug1.icu',
      'https://g.caduo.ml',
      'https://so.roy233.com',
    ],
    alternative: 'https://www.library.ac.cn'
  },
  {
    name: 'wiki',
    urls: [
      'https://www.wikipedia.org',
      'https://www.wikipedia.iwiki.eu.org',
    ],
  },
  {
    name: 'scholar',
    urls: [
      'https://scholar.google.com',
      'http://so.hiqq.com.cn',
      'https://sc.panda321.com',
      'https://xueshu.lanfanshu.cn',
      'https://xueshu.soogle.top',
      'https://x.sci-hub.org.cn',
    ]
  },
  {
    name: 'sci-hub',
    urls: [
      'https://sci-hub.tf',
      'https://sci-hub.ren',
      'https://sci-hub.st',
      'https://sci-hub.se',
    ]
  }
]

console.log('Google mirrors form Universities: https://www.library.ac.cn/')

export default mirrors