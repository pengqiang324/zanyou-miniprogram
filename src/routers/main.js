const indexList = require('./indexList')
const address = require('./address')
const internal = require('./internal')
const orderBuy = require('./orderBuy')
const payment = require('./payment')

module.exports = [
  ...indexList,
  ...address,
  ...internal,
  ...orderBuy,
  ...payment
]
