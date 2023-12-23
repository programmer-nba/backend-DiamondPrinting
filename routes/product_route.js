const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Plate = require('../controllers/plate_controller.js')
const Print_2 = require('../controllers/print_2_controller.js')
const Print_4 = require('../controllers/print_4_controller.js')
const Coating = require('../controllers/coating_controller.js')
const Emboss = require('../controllers/emboss_controller.js')
const HotStamp = require('../controllers/hotStamp_controller.js')

/* --------------RawMatt-------------- */
route.post('/rawmatt', RawMatt.addRawMatt)
route.get('/rawmatts', RawMatt.getRawMatts)
//route.get('/:id', RawMatt.getProduct)
route.put('/rawmatt/:id', RawMatt.updateRawMattOption)
route.delete('/rawmatt/:id', RawMatt.deleteRawMatt)
route.delete('/rawmatt/:id/:option', RawMatt.deleteRawMattOption)

/* --------------Plate-------------- */ 
route.post('/plate', Plate.addPlate)
route.get('/plates', Plate.getPlates)
route.put('/plate/:id', Plate.updatePlatePrice)
route.delete('/plate/:id', Plate.deletePlate)

/* --------------Print2-------------- */ 
route.post('/print-2', Print_2.addPrint_2_Color)
route.get('/prints-2', Print_2.getPrints_2)
route.get('/print-2/:id', Print_2.getPrint_2)
route.put('/print-2/:id', Print_2.updatePrint_2_Option)
route.delete('/print-2/:id/:option', Print_2.deletePrint_2_Option)
route.delete('/print-2/:id', Print_2.deletePrint_2)

/* --------------Print4-------------- */ 
route.post('/print-4', Print_4.addPrint_4_Color)
route.get('/prints-4', Print_4.getPrints_4)
route.get('/print-4/:id', Print_4.getPrint_4)
route.put('/print-4/:id', Print_4.updatePrint_4_Option)
route.delete('/print-4/:id/:option', Print_4.deletePrint_4_Option)
route.delete('/print-4/:id', Print_4.deletePrint_4)

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
route.delete('/emboss/:id/:option', Emboss.deleteEmbossOption)

/* --------------HotStamp-------------- */
route.post('/stamp', HotStamp.addHotStamp)
route.get('/stamps', HotStamp.getHotStamps)
route.get('/stamp/:id', HotStamp.getHotStamp)
route.put('/stamp/:id', HotStamp.updateHotStamp)
route.delete('/stamp/:id', HotStamp.deleteHotStamp)

module.exports = route