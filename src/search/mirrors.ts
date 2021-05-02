const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      'https://www.google.com',
      'https://search.njuu.cf',
      'https://search.ahau.cf',
      'https://search.hfut.cf',
      'https://search.ahut.cf',
      'https://search.aufe.cf',
      'https://search.ahnu.cf',
      'https://hkbn.search.sjtu.cf:54740',
      'https://wtt.search.sjtu.cf:54740',
      'https://hgc.search.sjtu.cf:54740',
      'https://hkbn.search.sjtu.cf:54740',
      'https://goo.gle.workers.dev',
      'https://g.caduo.ml'
    ],
    alternative: 'https://www.library.ac.cn'
  },
  wiki: {
    name: 'wiki',
    path: '/wiki/Special:Search/%q',
    urls: [
      'https://www.wikipedia.org',
      'https://www.wikipedia.ahmu.cf',
      'https://www.wikipedia.ahau.cf',
      'https://www.wikipedia.hfut.cf',
      'https://www.wikipedia.ahut.cf',
      'https://www.wikipedia.iwiki.eu.org',
      'https://wiki.ry4.me'
    ]
  },
  scholar: {
    name: 'scholar',
    path: '/scholar?q=%q',
    urls: [
      'https://scholar.google.com',
      'https://scholar.seuu.cf',
      'https://scholar.njuu.cf',
      'https://g0.nuaa.cf/extdomains/scholar.google.com',
      'https://so.hiqq.com.cn',
      'https://sc.panda321.com',
      'https://xueshu.lanfanshu.cn',
      'https://xueshu.soogle.top',
      'https://x.sci-hub.org.cn'
    ]
  },
  'sci-hub': {
    name: 'sci-hub',
    urls: [
      'https://sci-hub.tf',
      'https://sci-hub.ren',
      'https://sci-hub.st',
      'https://sci-hub.se'
    ]
  }
};

console.log('Google mirrors form Universities: https://www.library.ac.cn/')

export default mirrors