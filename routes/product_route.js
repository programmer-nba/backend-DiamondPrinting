const route = require('express').Router()

// controllers
const Product = require('../controllers/product_controller.js')

route.post('/rawmatt', Product.addRawMatt)
route.get('/rawmatt', Product.getRawMatts)
//route.get('/:id', Product.getProduct)
route.put('/rawmatt/:id', Product.updateRawMattOption)
//route.delete('/:id', Product.deleteProduct)
route.delete('/rawmatt/:id/:option', Product.deleteRawMattOption)

module.exports = route