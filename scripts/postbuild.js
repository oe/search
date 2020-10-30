const glob = require('glob')
const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.join(__dirname, '../dist')

function main() {
  // update opensearch.xml favicon.ico path
  const fav = glob.sync('favicon.*.ico', { cwd: ROOT_DIR })[0]
  const xml = glob.sync('opensearch.*.xml', { cwd: ROOT_DIR })[0]
  const xmlContent = fs.readFileSync(path.join(ROOT_DIR, xml), 'utf8')
  fs.writeFileSync(path.join(ROOT_DIR, xml), xmlContent.replace('favicon.ico', fav), 'utf8')
}

main()
