const route = require('express').Router()

const Admin = require('../controllers/admin_controller.js')

route.get('/members', Admin.getAllMembers)
route.delete('/:id', Admin.deleteAdmin)
route.delete('/sale/:id', Admin.deleteSale)
route.delete('/production/:id', Admin.deleteProduction)

module.exports = route