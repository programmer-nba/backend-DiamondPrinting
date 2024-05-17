const route = require('express').Router()

// controllers
const Auth = require('../controllers/auth_controller.js')

// register
route.post('/register/admin', Auth.adminRegister) // admin
route.post('/register/sale', Auth.saleRegister) // sale
route.post('/register/purchase', Auth.purchaseRegister) // purchase
route.post('/register/account', Auth.accountRegister) // account
route.post('/register/planing', Auth.planingRegister) // planing
route.post('/register/production', Auth.productionRegister) // production
route.post('/register/transfer', Auth.transferRegister) // production

// login
route.post('/login', Auth.login)

module.exports = route