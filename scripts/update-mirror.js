const fs = require('fs')
const jsdom = require('jsdom')
const path = require('path')

const { JSDOM } = jsdom

const destPath = path.join(__dirname, '../src/search/url-config.json')

async function parseLibraryAc() {
  let result = {
    google: [],
    wiki: [],
    scholar: []
  }
  try {
    const dom = await JSDOM.fromURL('https://www.library.ac.cn')
    const doc = dom.window.document
    const google = Array.from(doc.querySelectorAll('#GoogleSearch a'))
      .map(a => a.getAttribute('href').replace(/\/$/, ''))
    const scholar = Array.from(doc.querySelectorAll('#GoogleScholar a'))
      .map(a => a.getAttribute('href').replace(/\/$/, ''))
    const wiki = Array.from(doc.querySelectorAll('#Wikipedia a'))
      .map(a => a.getAttribute('href').replace(/\/$/, ''))
  
    result = {
      google,
      wiki,
      scholar
    }
  } catch (error) {
    if (process.env.IS_SCHEDULE) {
      throw error
    }
  }
  fs.writeFileSync(destPath, JSON.stringify(result, null, 2))
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

async function main(params) {
  const isDev = process.argv.includes('--dev')
  if (isDev && !needUpdate()) {
    console.log('\tskip mirror update')
    return
  }
  await parseLibraryAc()
}

main()