const route = require('express').Router()

// middlewares
const verifyToken = require('../middlewares/verifyToken.js')
const upload = require('../middlewares/uploadFiles.js')

// controllers
const Order = require('../controllers/order_controller.js')
const File = require('../controllers/upload_controller.js')

route.post('/upload', upload.single('file'), File.fileUpload)

route.post('/pre-order', verifyToken, Order.addPreOrder)
route.get('/pre-orders', Order.getPreOrders)
route.get('/pre-order/:id', Order.getPreOrder)
route.put('/pre-order/:id', verifyToken, Order.updatePreOrder)
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
route.get('/quotation/:id', Order.getQuotation)
route.delete('/quotation/:id', verifyToken, Order.deleteQuotation)
route.get('/quotations/:id', Order.getQuotationOfpreOrder)

module.exports = route