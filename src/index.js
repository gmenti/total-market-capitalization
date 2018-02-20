const fs = require('fs')
const json2xls = require('json2xls')
const graphs = require('./graphs')
const storage = require('./storage')

setImmediate(async () => {
  console.log('Fetching updates from coinmarketcap...')
  const data = storage.load()
  const lastDate = data.length ? data[data.length - 1].date : new Date(2017, 9, 1, 0, 0, 0, 0)
  const updates = data.length

  let firstTime = lastDate.getTime()
  while (true) {
    const chartData = await graphs.getChartData(firstTime, firstTime + 86400000)
    if (!chartData['volume_usd'].length) {
      break
    }
    for (let i = 0; i < chartData['volume_usd'].length; i++) {
      const [id, volume] = chartData['volume_usd'][i]
      const [, marketCap] = chartData['market_cap_by_available_supply'][i]
      if ((data.length && data[data.length - 1].id !== id) || (!data.length && new Date(id).getDay() >= lastDate.getDay())) {
        data.push({ id, volume, marketCap, date: new Date(id) })
      }
    }
    firstTime = data[data.length - 1].id + 300000
  }

  const installedUpdates = data.length - updates
  if (installedUpdates) {
    console.log(installedUpdates + ' new updates addeds')
    storage.save(data)
  } else {
    console.log('No new updates')
  }

  const existXls = fs.existsSync('data.xls')
  if (installedUpdates > 0 || !existXls) {
    const xls = json2xls(data.map(update => ({
      'Timestamp': update.id,
      'Volume USD': update.volume,
      'Market Cap': update.marketCap,
      'Date': update.date
    })))
  
    fs.writeFileSync('data.xls', xls, 'binary')
    console.log(existXls ? 'Content of data.xls was overwritten with new updates' : 'Created file data.xls with content of updates')
  }
})
