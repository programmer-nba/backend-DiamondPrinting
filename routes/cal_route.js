const route = require('express').Router()

// controllers
const Cal = require('../controllers/calculate_controller.js')

route.post('/all/:id', Cal.calAll)
route.post('/rawMatt', Cal.calRawMaterial)
route.post('/plate', Cal.calPlate)
route.post('/print-2', Cal.calPrint2)
route.post('/print-4', Cal.calPrint4)
route.post('/coating', Cal.calCoating)
route.post('/emboss', Cal.calEmboss)
route.post('/stamp', Cal.calHotStamp)
route.post('/diecut', Cal.calDiecut)

module.exports = route