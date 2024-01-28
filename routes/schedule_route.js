const route = require('express').Router()

// middlewares
const verifyToken = require('../middlewares/verifyToken.js')

// controllers
const Work = require('../controllers/work_controller.js')

route.post('/planing', verifyToken, Work.createNewPlaningSchedule)
route.post('/purchase', verifyToken, Work.createNewPurchaseSchedule)
route.post('/production', verifyToken, Work.createNewProductionSchedule)
route.post('/qc', verifyToken, Work.createNewQCSchedule)
route.post('/transfer', verifyToken, Work.createNewTransferSchedule)

module.exports = route