const axios = require('axios')

const instance = axios.create({
  baseURL: 'https://graphs2.coinmarketcap.com/'
})

module.exports = {
  async getChartData (startTimestamp, endTimestamp) {
    return (await instance.get(`global/marketcap-total/${startTimestamp}/${endTimestamp}/`)).data
  }
}
