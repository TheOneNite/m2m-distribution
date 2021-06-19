const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const listenPort = 3389
const manifestPath = __dirname + '/manifest.json'

const rootDir =
  'C:/Users/Travis/Documents/Workspaces/MiniMars/Mission2Mars_depot/Distribution/builds/dev/m2m'

app.use(bodyParser.json())
app.use(cors({ origin: true }))

app.get('/manifest', (req, res) => {
  console.log('GET/manifest')
  fs.readFile(manifestPath, 'utf-8', (e, data) => {
    if (e) {
      console.log(e)
    }
    console.log(data)
    res.send(JSON.stringify(data))
  })
})

app.get('/install-full', (req, res) => {})
app.post('/fetch-file', (req, res) => {
  console.log(`POST/fetch-file`)
  console.log(req.body)
  let path = req.body.file
  path = path.replace(':root', rootDir)
  res.setHeader('content-type', 'arraybugger')
  fs.createReadStream(path).pipe(res)
})

app.listen(listenPort, () => {
  console.log(`fileServer up on ${listenPort}`)
})
