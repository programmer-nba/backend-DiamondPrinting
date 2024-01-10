const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Print_2 = require('../controllers/print_2_controller.js')
const Print_4 = require('../controllers/print_4_controller.js')
const Coating = require('../controllers/coating_controller.js')
const Customer = require('../controllers/customer_controller.js')
const Plate = require('../controllers/plate_controller.js')
const HotStamp = require('../controllers/hotStamp_controller.js')

route.get('/rawmatt-type', RawMatt.getRawMattTypes)
route.get('/rawmatt-subtype/:type', RawMatt.getRawMattSubTypes)
route.post('/rawmatt-option', RawMatt.getRawMattOptions)
route.post('/rawmatt-option-w', RawMatt.getRawMattWidths)
route.post('/rawmatt-option-l', RawMatt.getRawMattLongs)

route.get('/print-2-color', Print_2.getPrint_2_Colors)
route.get('/print-2-option/:color', Print_2.getPrint_2_Options)
route.get('/print-4-color', Print_4.getPrint_4_Colors)
route.get('/print-4-option/:color', Print_4.getPrint_4_Options)

route.get('/plate-size', Plate.getPlatesSize)

route.get('/stamp-color', HotStamp.getHotStampColors)

route.get('/coating-type', Coating.getCoatingTypes)
route.get('/coating-option/:type', Coating.getCoatingOptions)

route.get('/customers-name', Customer.customersSearch)
route.get('/customer/:id', Customer.getCustomer)
route.get('/customers', Customer.getCustomers)
route.post('/customer-new', Customer.createCustomer)
route.delete('/customer/:id', Customer.deleteCustomer)
route.put('/customer/:id', Customer.updateCustomer)

module.exports = route