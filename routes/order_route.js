const route = require('express').Router()

// middlewares
const verifyToken = require('../middlewares/verifyToken.js')

// controllers
const Order = require('../controllers/order_controller.js')

route.post('/pre-order', verifyToken, Order.addPreOrder)
route.get('/pre-orders', Order.getPreOrders)
route.get('/pre-order/:id', Order.getPreOrder)
route.put('/pre-order/:id', verifyToken, Order.updatePreOrder)
route.put('/pre-order-stampsize-edit/:id', verifyToken, Order.editStampSize)
route.put('/pre-order-embosssize-edit/:id', verifyToken, Order.editEmbossSize)
route.delete('/pre-order/:id', verifyToken, Order.deletePreOrder)
route.get('/pre-productions/:id', Order.getPreProductionsOfOrder)
route.delete('/pre-orders', verifyToken, Order.deletePreOrders)

route.post('/pre-production/:id', verifyToken, Order.addPreProduction)
route.get('/pre-productions', Order.getPreProductions)
route.get('/pre-production/:id', Order.getPreProduction)
route.put('/pre-production/:id', verifyToken, Order.updatePreProduction)
route.delete('/pre-production/:id', verifyToken, Order.deletePreProduction)

route.post('/quotation', verifyToken, Order.creatQuotation)
route.get('/quotations', Order.getQuotations)
route.get('/quotations-new', Order.getNewQuotations)
route.get('/quotations-approved', Order.getApprovedQuotations)
route.get('/quotations-rejected', Order.getRejectedQuotations)
route.get('/quotation/:id', Order.getQuotation)
route.delete('/quotation/:id', verifyToken, Order.deleteQuotation)
route.get('/quotations/:id', Order.getQuotationOfpreOrder)
route.put('/quotation-ok/:id',verifyToken, Order.approveQuotation)
route.put('/quotation-reject/:id',verifyToken, Order.rejectQuotation)

route.post('/order', verifyToken, Order.createOrder)
route.get('/orders', Order.getAllOrders)
route.get('/order/:id', Order.getOrder)
route.put('/order/:id', verifyToken, Order.editOrder)
route.delete('/order/:id', verifyToken, Order.deleteOrder)
route.delete('/orders/:id', verifyToken, Order.deleteOrders)

module.exports = route