const route = require('express').Router()

// controllers
const Cal = require('../controllers/calculate_controller.js')

route.post('/rawMatt', Cal.calRawMaterial)
route.post('/plate', Cal.calPlate)

module.exports = route