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
route.get('/purchase-files/:id', verifyToken, Work.getFilesPurchase)

route.post('/production', verifyToken, Work.createNewProductionSchedule)
route.put('/production-edit/:id', verifyToken, Work.editDateProductionSchedule) // planing
route.get('/productions', verifyToken, Work.getProductionSchedules) // planing
route.put('/production-accept/:id', verifyToken, Work.acceptProductionSchedule)
route.put('/production-update/:id', verifyToken, Work.updateProductionSchedule)
route.get('/production/:id', verifyToken, Work.getProductionSchedule)

route.post('/qc', verifyToken, Work.createNewQCSchedule)
route.put('/qc-edit/:id', verifyToken, Work.editDateQCSchedule) // planing
route.get('/qcs', verifyToken, Work.getQCSchedules) // planing
route.put('/qc-accept/:id', verifyToken, Work.acceptQCSchedule)
route.put('/qc-update/:id', verifyToken, Work.updateQCSchedule)
route.get('/qc/:id', verifyToken, Work.getQCSchedule)


route.post('/transfer', verifyToken, Work.createNewTransferSchedule)
route.put('/transfer-edit/:id', verifyToken, Work.editDateTransferSchedule) // planing
route.get('/transfers', verifyToken, Work.getTransferSchedules) // planing
route.put('/transfer-accept/:id', verifyToken, Work.acceptTransferSchedule)
route.put('/transfer-update/:id', verifyToken, Work.updateTransferSchedule)
route.get('/transfer/:id', verifyToken, Work.getTransferSchedule)
route.get('/transfer-files/:id', verifyToken, Work.getFilesTransfer)

module.exports = route