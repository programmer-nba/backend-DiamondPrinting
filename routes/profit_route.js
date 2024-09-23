const route = require('express').Router()
// middlewares
const verifyToken = require('../middlewares/verifyToken.js')

// controllers
const Profit = require('../controllers/profit_controller.js')

route.post('/', Profit.createProfit)
route.get('/', Profit.getProfits)
route.put('/:id', Profit.updateProfit)

module.exports = route