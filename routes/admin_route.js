const route = require('express').Router()

const Admin = require('../controllers/admin_controller.js')

route.get('/members', Admin.getAllMembers)

module.exports = route