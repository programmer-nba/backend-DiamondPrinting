const route = require('express').Router()

// controllers
const Order = require('../controllers/order_controller.js')

route.post('/pre-order', Order.addPreOrder)

module.exports = route