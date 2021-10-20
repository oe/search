const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      'https://www.google.com',
      'https://search.iwiki.uk',
      'https://search.みさか.tw',
      'https://search.サクラ.tw',
      'https://txt.guoqiangti.ga',
      'https://www.google-fix.com',
      'https://txt.guoqiangti.ga',
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
      'https://www.wikipedia.iwiki.uk',
      'https://www.wikipedia.維基.台灣',
    ]
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