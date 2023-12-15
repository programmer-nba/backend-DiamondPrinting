const route = require('express').Router()

// controllers
const Product = require('../controllers/product_controller.js')


route.post('/', Product.addProduct)
route.get('/', Product.getProducts)
//route.get('/:id', Product.getProduct)
route.put('/:id', Product.updateProduct)
//route.delete('/:id', Product.deleteProduct)
route.delete('/:id/:option', Product.deleteOption)

module.exports = route