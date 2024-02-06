const route = require('express').Router()

// middlewares
const verifyToken = require('../middlewares/verifyToken.js')

// controllers
const Work = require('../controllers/work_controller.js')

route.post('/planing', verifyToken, Work.createNewPlaningSchedule)
route.get('/planings', verifyToken, Work.getPlaningSchedules)
route.get('/planing/:id', verifyToken, Work.getPlaningSchedule)
route.put('/planing/:id', verifyToken, Work.editPlaningSchedule)
route.delete('/planing/:id', verifyToken, Work.deletePlaningSchedule)

route.post('/purchase', verifyToken, Work.createNewPurchaseSchedule) // planing
route.put('/purchase-edit/:id', verifyToken, Work.editDatePurchaseSchedule) // planing
route.get('/purchases', verifyToken, Work.getPurchaseSchedules) // planing
route.put('/purchase-accept/:id', verifyToken, Work.acceptPurchaseSchedule)
route.put('/purchase-update/:id', verifyToken, Work.updatePurchaseSchedule)
route.get('/purchase/:id', verifyToken, Work.getPurchaseSchedule)

route.post('/production', verifyToken, Work.createNewProductionSchedule)
route.post('/qc', verifyToken, Work.createNewQCSchedule)
route.post('/transfer', verifyToken, Work.createNewTransferSchedule)

module.exports = route