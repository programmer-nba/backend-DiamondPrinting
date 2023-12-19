const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Plate = require('../controllers/plate_controller.js')
const Print = require('../controllers/print_controller.js')
const Coating = require('../controllers/coating_controller.js')
const Emboss = require('../controllers/emboss_controller.js')

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

/* --------------Print-------------- */ 
route.post('/print', Print.addPrintColor)
route.get('/prints', Print.getPrints)
route.get('/print/:id', Print.getPrint)
route.put('/print/:id', Print.updatePrintOption)
route.delete('/print/:id/:option', Print.deletePrintOption)
route.delete('/print/:id', Print.deletePrint)

/* --------------Coating-------------- */
route.post('/coating', Coating.addCoating)
route.get('/coatings', Coating.getCoatings)
route.put('/coating/:id', Coating.updateCoatingOption)
route.delete('/coating/:id/:option', Coating.deleteCoatingOption)

/* --------------Emboss-------------- */
route.post('/emboss', Emboss.addEmboss)
route.get('/embosses', Emboss.getEmbosses)
route.put('/emboss/:id', Emboss.updateEmbossOption)
route.delete('/emboss/:id', Emboss.deleteEmboss)

module.exports = route