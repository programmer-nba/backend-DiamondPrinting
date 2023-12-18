const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Plate = require('../controllers/plate_controller.js')

/* --------------RawMatt-------------- */
route.post('/rawmatt', RawMatt.addRawMatt)
route.get('/rawmatts', RawMatt.getRawMatts)
//route.get('/:id', RawMatt.getProduct)
route.put('/rawmatt/:id', RawMatt.updateRawMattOption)
//route.delete('/:id', RawMatt.deleteProduct)
route.delete('/rawmatt/:id/:option', RawMatt.deleteRawMattOption)

/* --------------Plate-------------- */ 
route.post('/plate', Plate.addPlate)
route.get('/plates', Plate.getPlates)
route.put('/plate/:id', Plate.updatePlatePrice)
route.delete('/plate/:id', Plate.deletePlate)

module.exports = route