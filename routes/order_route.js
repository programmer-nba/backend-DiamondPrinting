const route = require('express').Router()

// controllers
const Order = require('../controllers/order_controller.js')

route.post('/pre-order', Order.addPreOrder)
route.get('/pre-orders', Order.getPreOrders)
route.get('/pre-order/:id', Order.getPreOrder)
route.put('/pre-order/:id', Order.updatePreOrder)
route.delete('/pre-order/:id', Order.deletePreOrder)
route.get('/pre-productions/:id', Order.getPreProductionsOfOrder)

route.post('/pre-production/:id', Order.addPreProduction)
route.get('/pre-productions', Order.getPreProductions)
route.get('/pre-production/:id', Order.getPreProduction)
route.put('/pre-production/:id', Order.updatePreProduction)
route.delete('/pre-production/:id', Order.deletePreProduction)

module.exports = route