const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Print = require('../controllers/print_controller.js')

route.get('/rawMatt-type', RawMatt.getRawMattTypes)
route.get('/rawMatt-option', RawMatt.getRawMattOptions)

route.get('/print-color', Print.getPrintColors)
//route.get('/rawMatt-option', RawMatt.getRawMattOptions)

module.exports = route