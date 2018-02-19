const axios = require('axios')

const instance = axios.create({
  baseURL: 'https://graphs2.coinmarketcap.com/'
})

instance.interceptors.response
  .use(response => response, (err) => {
    throw err
  })

module.exports = {
  async getChartData (startDate, endDate) {
    return (await instance.get(`global/marketcap-total/${startDate.getTime()}/${endDate.getTime()}/`)).data
  },
  async getDailyChartData (startDate, endDate) {
    const lines = []
    const promises = []
    while (startDate <= endDate) {
      promises.push(async () => {
        lines.push(await this.getChartData(startDate, endDate))
      })
      startDate = new Date(new Date().getTime() + 86400000)
    }
    await Promise.all(promises)
  }
}
