const route = require('express').Router()

// controllers
const Cal = require('../controllers/calculate_controller.js')

route.post('/cal', Cal.calRawMaterial)

module.exports = route