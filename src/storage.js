const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../storage.json')

module.exports = {
  load () {
    try {
      const data = JSON.parse(fs.readFileSync(filePath).toString())
      data.forEach((line) => {
        line.date = new Date(line.date)
      })
      return data
    } catch (err) {
      return []
    }  
  },
  save (data) {
    fs.writeFileSync(filePath, JSON.stringify(data))
  }
}
