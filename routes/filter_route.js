const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Print_2 = require('../controllers/print_2_controller.js')
const Coating = require('../controllers/coating_controller.js')
const Customer = require('../controllers/customer_controller.js')

route.get('/rawMatt-type', RawMatt.getRawMattTypes)
route.get('/rawMatt-option', RawMatt.getRawMattOptions)

route.get('/print-color', Print_2.getPrint_2_Colors)

route.get('/coating-type', Coating.getCoatingTypes)
route.get('/coating-option/:type', Coating.getCoatingOptions)

route.get('/customers-name-tax', Customer.customersSearch)

module.exports = route