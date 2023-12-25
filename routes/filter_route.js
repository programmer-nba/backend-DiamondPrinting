const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Print_2 = require('../controllers/print_2_controller.js')
const Print_4 = require('../controllers/print_4_controller.js')
const Coating = require('../controllers/coating_controller.js')
const Customer = require('../controllers/customer_controller.js')

route.get('/rawMatt-type', RawMatt.getRawMattTypes)
route.get('/rawMatt-option', RawMatt.getRawMattOptions)

route.get('/print-2-color', Print_2.getPrint_2_Colors)
route.get('/print-2-option', Print_2.getPrint_2_Options)
route.get('/print-4-color', Print_4.getPrint_4_Colors)
route.get('/print-4-option', Print_4.getPrint_4_Options)

route.get('/coating-type', Coating.getCoatingTypes)
route.get('/coating-option/:type', Coating.getCoatingOptions)

route.get('/customers-name-tax', Customer.customersSearch)

module.exports = route