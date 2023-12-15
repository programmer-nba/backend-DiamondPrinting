const route = require('express').Router()

// controllers
const Auth = require('../controllers/auth_controller.js')

// register
route.post('/register/admin', Auth.adminRegister) // admin
route.post('/register/sale', Auth.saleRegister) // sale
route.post('/register/purchase', Auth.purchaseRegister) // purchase
route.post('/register/account', Auth.accountRegister) // account

// login
route.post('/login', Auth.login)

module.exports = route