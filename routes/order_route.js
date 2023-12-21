const route = require('express').Router()

// controllers
const Order = require('../controllers/order_controller.js')

route.post('/pre-order', Order.addPreOrder)
route.get('/pre-orders', Order.getPreOrders)
route.get('/pre-order/:id', Order.getPreOrder)
route.put('/pre-order/:id', Order.updatePreOrder)

module.exports = route