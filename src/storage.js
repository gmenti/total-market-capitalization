const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../storage.json')

module.exports = {
  load () {
    return require(filePath)
  },
  save (data) {
    fs.writeFile('data.json', data)
  }
}
