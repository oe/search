import urlConfig from './url-config.json'

const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      "https://www.google.com",
      'https://googlehnzyc.azurewebsites.net',
    ].concat(urlConfig.google),
    alternative: 'https://www.library.ac.cn'
  },
  wiki: {
    name: 'wiki',
    path: '/wiki/Special:Search/%q',
    urls: [
      "https://www.wikipedia.org",
      'https://zh-one.iwiki.icu',
    ].concat(urlConfig.wiki)
  },
  scholar: {
    name: 'scholar',
    path: '/scholar?q=%q',
    urls: [
      "https://scholar.google.com",
      'https://scholar.lanfanshu.cn',
      'https://x.sci-hub.org.cn',
      'https://sc.panda321.com',
    ].concat(urlConfig.scholar)
  },
  'sci-hub': {
    name: 'sci-hub',
    urls: [
      'https://sci-hub.ren',
      'https://sci-hub.st',
      'https://sci-hub.se'
    ]
  }
};

console.log('Google mirrors form Universities: https://www.library.ac.cn/')

export default mirrors