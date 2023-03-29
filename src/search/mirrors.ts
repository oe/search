import urlConfig from './url-config.json'

const mirrors = {
  google: {
    name: 'google',
    path: '/search?q=%q',
    urls: [
      "https://www.google.com",
      'https://googlehnzyc.azurewebsites.net/',
      'https://g20.i-research.edu.eu.org/',
    ].concat(urlConfig.google),
    alternative: 'https://www.library.ac.cn'
  },
  wiki: {
    name: 'wiki',
    path: '/wiki/Special:Search/%q',
    urls: ["https://www.wikipedia.org"].concat(urlConfig.wiki)
  },
  scholar: {
    name: 'scholar',
    path: '/scholar?q=%q',
    urls: ["https://scholar.google.com"].concat(urlConfig.scholar)
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