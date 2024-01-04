const route = require('express').Router()

// controllers
const RawMatt = require('../controllers/rawMatt_controller.js')
const Plate = require('../controllers/plate_controller.js')
const Print_2 = require('../controllers/print_2_controller.js')
const Print_4 = require('../controllers/print_4_controller.js')
const Coating = require('../controllers/coating_controller.js')
const Emboss = require('../controllers/emboss_controller.js')
const HotStamp = require('../controllers/hotStamp_controller.js')
const Diecut = require('../controllers/diecut_controller.js')
const Glue = require('../controllers/glue_controller.js')

/* --------------RawMatt-------------- */
route.post('/rawmatt', RawMatt.addRawMatt)
route.get('/rawmatts', RawMatt.getRawMatts)
route.get('/rawmatt/:id', RawMatt.getRawMatt)
route.put('/rawmatt/:id', RawMatt.editRawMattType)
route.put('/rawmatt-option/:id', RawMatt.addRawMattOption)
route.delete('/rawmatt/:id', RawMatt.deleteRawMatt)
route.delete('/rawmatt/:id/:option', RawMatt.deleteRawMattOption)
route.put('/rawmatt-edit-option/:id/:option', RawMatt.editRawMattOption)

/* --------------Plate-------------- */ 
route.post('/plate', Plate.addPlate)
route.get('/plates', Plate.getPlates)
route.put('/plate/:id', Plate.updatePlatePrice)
route.delete('/plate/:id', Plate.deletePlate)

/* --------------Print2-------------- */ 
route.post('/print-2', Print_2.addPrint_2_Color)
route.put('/print-2-edit/:id', Print_2.editPrint_2_Color)
route.get('/prints-2', Print_2.getPrints_2)
route.get('/print-2/:id', Print_2.getPrint_2)
route.put('/print-2/:id', Print_2.addPrint_2_Option)
route.delete('/print-2/:id/:option', Print_2.deletePrint_2_Option)
route.delete('/print-2/:id', Print_2.deletePrint_2)
route.put('/print-2-edit/:id/:option', Print_2.editPrint_2_Option)

/* --------------Print4-------------- */ 
route.post('/print-4', Print_4.addPrint_4_Color)
route.put('/print-4-edit/:id', Print_4.editPrint_4_Color)
route.get('/prints-4', Print_4.getPrints_4)
route.get('/print-4/:id', Print_4.getPrint_4)
route.put('/print-4/:id', Print_4.addPrint_4_Option)
route.delete('/print-4/:id/:option', Print_4.deletePrint_4_Option)
route.delete('/print-4/:id', Print_4.deletePrint_4)
route.put('/print-4-edit/:id/:option', Print_4.editPrint_4_Option)

/* --------------Coating-------------- */
route.post('/coating', Coating.addCoating)
route.put('/coating-edit/:id', Coating.editCoating)
route.get('/coatings', Coating.getCoatings)
route.put('/coating/:id', Coating.addCoatingOption)
route.put('/coating-edit-option/:id/:option', Coating.editCoatingOption)
route.delete('/coating/:id', Coating.deleteCoating)
route.delete('/coating/:id/:option', Coating.deleteCoatingOption)

/* --------------Emboss-------------- */
route.post('/emboss', Emboss.addEmboss)
route.put('/emboss-edit/:id', Emboss.editEmboss)
route.get('/embosses', Emboss.getEmbosses)
route.put('/emboss/:id', Emboss.addEmbossOption)
route.put('/emboss-edit-option/:id/:option', Emboss.editEmbossOption)
route.delete('/emboss/:id', Emboss.deleteEmboss)
route.delete('/emboss/:id/:option', Emboss.deleteEmbossOption)

/* --------------HotStamp-------------- */
route.post('/stamp', HotStamp.addHotStamp)
route.get('/stamps', HotStamp.getHotStamps)
route.get('/stamp/:id', HotStamp.getHotStamp)
route.put('/stamp/:id', HotStamp.updateHotStamp)
route.delete('/stamp/:id', HotStamp.deleteHotStamp)

/* --------------Diecut-------------- */
route.post('/diecut', Diecut.addDiecut)
route.get('/diecuts', Diecut.getDiecuts)
route.get('/diecut/:id', Diecut.getDiecut)
route.put('/diecut/:id', Diecut.editDiecut)
route.delete('/diecut/:id', Diecut.deleteDiecut)
route.put('/diecut-option/:id/:option', Diecut.editDiecutOption)
route.put('/diecut-option/:id', Diecut.addDiecutOption)
route.delete('/diecut-option/:id/:option', Diecut.deleteDiecutOption)

/* --------------Glue-------------- */
route.post('/glue', Glue.addGlue)
route.get('/glues', Glue.getGlues)
route.delete('/glue/:id', Glue.deleteGlue)

module.exports = route