const crypto = require('crypto')
const fs = require('fs')
const manifest = require('./utils/manifest')

//this is fake for dev
const rootDir = `${__dirname}/builds/dev/m2m`

const generateManifest = async (rootDir) => {
  const files = manifest.generate(rootDir)
  let hashes = await Promise.all(
    files.map(async (path) => {
      const hash = new Promise((resolve, reject) => {
        console.log('hash', path)
        let hash = crypto.createHash('md5')
        let stream = fs.createReadStream(path)
        stream.on('error', (e) => {
          throw e
          reject(e)
        })
        stream.on('data', (data) => {
          hash.update(data)
        })
        stream.on('close', () => {
          resolve(hash.digest('hex'))
        })
      })
      return hash
    })
  )
  let checksums = files.map((path, i) => {
    return {
      path: path.replace(rootDir, ':root'),
      hash: hashes[i],
    }
  })
  const checksumJSON = JSON.stringify(checksums, undefined, '\t')
  fs.writeFile(`${__dirname}/manifest.json`, checksumJSON, (e) => {
    if (e) {
      throw e
    }
  })
  console.log(checksums)
}

generateManifest(rootDir)

module.exports = { generateManifest }
