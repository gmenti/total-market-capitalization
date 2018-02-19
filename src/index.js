const fs = require('fs')
const json2xls = require('json2xls')
const graphsApi = require('./graphsApi')

const initialDate = new Date(2017, 09, 1, 0, 0, 0, 0)

setImmediate(async () => {
  let date = new Date()
  const lines = []
  while (date.getTime() > initialDate.getTime()) {
    const yesterday = new Date(date.getTime() - 86400000)
    const chartData = await graphsApi.getChartData(yesterday, date)
    const marketcapByAvailableSupply = chartData['market_cap_by_available_supply']
    const volumeUsd = chartData['volume_usd']
    const infoByDate = []

    marketcapByAvailableSupply.forEach(([ timestamp, marketcap ]) => {
      infoByDate.push({ timestamp, marketcap })
    })

    volumeUsd.forEach(([ timestamp, volume ]) => {
      const info = infoByDate.find(info => info.timestamp === timestamp)
      if (info) {
        info.volumeUsd = volume
      }
    })

    infoByDate.forEach(info => lines.push({
      'Date': new Date(info.timestamp),
      'Time': info.timestamp,
      'Market cap': info.marketcap,
      'Volume USD': info.volumeUsd
    }))

    date = yesterday
  }

  lines.sort((l1, l2) => l1.timestamp > l2.timestamp)
  console.log(lines)
  const xls = json2xls(lines)
  fs.writeFileSync('data.xls', xls, 'binary')
})