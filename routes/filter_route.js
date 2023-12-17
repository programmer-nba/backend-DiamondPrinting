const route = require('express').Router()

// controllers
const Product = require('../controllers/product_controller.js')

route.get('/rawMatt-type', Product.getRawMattTypes)
route.get('/rawMatt-option', Product.getRawMattOptions)

module.exports = route