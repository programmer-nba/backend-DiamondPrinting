const jwt = require('jsonwebtoken')

// models
const Sale = require('../models/members/sale_model.js')
const Admin = require('../models/members/admin_model.js')
const Purchase = require('../models/members/purchase_model.js')
const Account = require('../models/members/account_model.js')
const Production = require('../models/members/production_model.js')
const Planing = require('../models/members/planing_model.js')

// middleware
const validateDuplicate = async (data) => {

    const {username, email, phone_number} = data

    try {
        //validate duplicate username in admin
        const existAdmin = await Admin.findOne({
            $or: [
                {username: username}
            ]
        })
        if(existAdmin && existAdmin.username === username) {
            const message = `ไม่สามารถใช้ username ${username} นี้ได้`
            return message
        }

        //validate duplicate username in sale
        const existSale = await Sale.findOne({
            $or: [
                {username: username},
                {email: email},
                {phone_number: phone_number}
            ]
        })
        if(existSale && existSale.username === username) {
            const message = `username ${username} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existSale && existSale.email === email) {
            const message = `อีเมล ${email} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existSale && existSale.phone_number === phone_number) {
            const message = `เบอร์โทร ${phone_number} มีผู้ใช้งานแล้ว`
            return message
        }

        //validate duplicate username in purchase
        const existPurchase = await Purchase.findOne({
            $or: [
                {username: username},
                {email: email},
                {phone_number: phone_number}
            ]
        })
        if(existPurchase && existPurchase.username === username) {
            const message = `username ${username} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existPurchase && existPurchase.email === email) {
            const message = `อีเมล ${email} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existPurchase && existPurchase.phone_number === phone_number) {
            const message = `เบอร์โทร ${phone_number} มีผู้ใช้งานแล้ว`
            return message
        }

        //validate duplicate username in account
        const existAccount = await Account.findOne({
            $or: [
                {username: username},
                {email: email},
                {phone_number: phone_number}
            ]
        })
        if(existAccount && existAccount.username === username) {
            const message = `username ${username} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existAccount && existAccount.email === email) {
            const message = `อีเมล ${email} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existAccount && existAccount.phone_number === phone_number) {
            const message = `เบอร์โทร ${phone_number} มีผู้ใช้งานแล้ว`
            return message
        }

        //validate duplicate username in production
        const existProduction = await Production.findOne({
            $or: [
                {username: username},
                {email: email},
                {phone_number: phone_number}
            ]
        })
        if(existProduction && existProduction.username === username) {
            const message = `username ${username} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existProduction && existProduction.email === email) {
            const message = `อีเมล ${email} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existProduction && existProduction.phone_number === phone_number) {
            const message = `เบอร์โทร ${phone_number} มีผู้ใช้งานแล้ว`
            return message
        }

        //validate duplicate username in production
        const existPlaning = await Planing.findOne({
            $or: [
                {username: username},
                {email: email},
                {phone_number: phone_number}
            ]
        })
        if(existPlaning && existPlaning.username === username) {
            const message = `username ${username} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existPlaning && existPlaning.email === email) {
            const message = `อีเมล ${email} มีผู้ใช้งานแล้ว`
            return message
        }
        if(existPlaning && existPlaning.phone_number === phone_number) {
            const message = `เบอร์โทร ${phone_number} มีผู้ใช้งานแล้ว`
            return message
        }
    }
    catch (err) {
        console.log(err.message)
        const message = `'validate duplicate error' ${err.message}`
        return message
    }
    
}

/*
--------------------------
           main
--------------------------
*/ 

// register -admin-
exports.adminRegister = async (req, res) => {
    const {
        username, password, phone_number, email
    } = req.body
    try {

        const validateData = {username:username, phone_number:phone_number, email:email}
        const duplicate = await validateDuplicate(validateData)
        if(duplicate) {
            return res.status(500).send({
                message: duplicate
            })
        }

        const admin = await Admin.find()

        const admin_code = `AM-${admin.length}`
        const ipAddress = req.ip || req.connection.remoteAddress

        const new_admin = new Admin({
            username: username,
            password: password,
            phone_number: phone_number,
            email: email,
            role: {
                main: 'แอดมิน',
                sub: null,
            },
            code: admin_code,
            logedInHis: {
                time: new Date(),
                ip: ipAddress,
            },
        })

        const saved_admin = await new_admin.save()
        if(!saved_admin){
            return res.status(500).send({
                message: 'ไม่สามารถสมัครสมาชิกได้',
                new_sale: new_admin,
                saved_sale: saved_admin
            })
        }

        return res.status(200).send({
            message: 'ลงทะเบียน admin สำเร็จ',
            user: saved_admin
        })

    }
    catch (err) {
        res.send({
            message: "ไม่สามารถสมัครสมาชิกได้",
            error: err.message
        })
        console.log(err.message)
    }
}

// register -sale-
exports.saleRegister = async (req, res) => {
    const {
        username, password, phone_number, email,
        first_name, last_name,
    } = req.body
    try {
        const validateData = {username:username, phone_number:phone_number, email:email}
        const duplicate = await validateDuplicate(validateData)
        if(duplicate) {
            return res.status(500).send({
                message: duplicate
            })
        }

        const sale = await Sale.find()

        const sale_code = `SA-${sale.length}`
        const ipAddress = req.ip || req.connection.remoteAddress

        const new_sale = new Sale({
            name: {
                first: first_name,
                last: last_name,
            },
            username: username,
            password: password,
            phone_number: phone_number,
            email: email,
            role: {
                main: 'เซลล์',
                sub: null,
            },
            code: sale_code,
            logedInHis: 
                {
                    time: new Date(),
                    ip: ipAddress,
                },
            rank: 'normal'
        })

        const saved_sale = await new_sale.save()
        if(!saved_sale){
            return res.status(500).send({
                message: 'ไม่สามารถสมัครสมาชิกได้',
                new_sale: new_sale,
                saved_sale: saved_sale
            })
        }

        return res.status(200).send({
            message: 'ลงทะเบียน sale สำเร็จ',
            user: saved_sale
        })

    }
    catch (err) {
        res.send({
            message: "ไม่สามารถสมัครสมาชิกได้",
            error: err.message
        })
        console.log(err.message)
    }
}

// register -purchase-
exports.purchaseRegister = async (req, res) => {
    const {
        username, password, phone_number, email,
        first_name, last_name,
    } = req.body
    try {
        const validateData = {username:username, phone_number:phone_number, email:email}
        const duplicate = await validateDuplicate(validateData)
        if(duplicate) {
            return res.status(500).send({
                message: duplicate
            })
        }

        const purchase = await Purchase.find()

        const purchase_code = `PC-${purchase.length}`
        const ipAddress = req.ip || req.connection.remoteAddress

        const new_purchase = new Purchase({
            name: {
                first: first_name,
                last: last_name,
            },
            username: username,
            password: password,
            phone_number: phone_number,
            email: email,
            role: {
                main: 'จัดซื้อ',
                sub: null,
            },
            code: purchase_code,
            logedInHis: 
                {
                    time: new Date(),
                    ip: ipAddress,
                },
            rank: 'normal'
        })

        const saved_purchase = await new_purchase.save()
        if(!saved_purchase){
            return res.status(500).send({
                message: 'ไม่สามารถสมัครสมาชิกได้',
                new_sale: new_sale,
                saved_purchase: saved_purchase
            })
        }

        return res.status(200).send({
            message: 'ลงทะเบียน ฝ่ายจัดซื้อ สำเร็จ',
            user: saved_purchase
        })

    }
    catch (err) {
        res.send({
            message: "ไม่สามารถสมัครสมาชิกได้",
            error: err.message
        })
        console.log(err.message)
    }
}

// register -account-
exports.accountRegister = async (req, res) => {
    const {
        username, password, phone_number, email,
        first_name, last_name,
    } = req.body
    try {

        const validateData = {username:username, phone_number:phone_number, email:email}
        const duplicate = await validateDuplicate(validateData)
        if(duplicate) {
            return res.status(500).send({
                message: duplicate
            })
        }

        const account = await Account.find()

        const account_code = `AC-${account.length}`
        const ipAddress = req.ip || req.connection.remoteAddress

        const new_account = new Account({
            name: {
                first: first_name,
                last: last_name,
            },
            username: username,
            password: password,
            phone_number: phone_number,
            email: email,
            role: {
                main: 'บัญชี',
                sub: null,
            },
            code: account_code,
            logedInHis: 
                {
                    time: new Date(),
                    ip: ipAddress,
                },
            rank: 'normal'
        })

        const saved_account = await new_account.save()
        if(!saved_account){
            return res.status(500).send({
                message: 'ไม่สามารถสมัครสมาชิกได้',
                new_sale: new_account,
                saved_purchase: saved_account
            })
        }

        return res.status(200).send({
            message: 'ลงทะเบียน ฝ่ายบัญชี สำเร็จ',
            user: saved_account
        })

    }
    catch (err) {
        res.send({
            message: "ไม่สามารถสมัครสมาชิกได้",
            error: err.message
        })
        console.log(err.message)
    }
}

// register -planing-
exports.planingRegister = async (req, res) => {
    const {
        username, password, phone_number, email,
        first_name, last_name,
    } = req.body
    try {

        const validateData = {username:username, phone_number:phone_number, email:email}
        const duplicate = await validateDuplicate(validateData)
        if(duplicate) {
            return res.status(500).send({
                message: duplicate
            })
        }

        const planing = await Planing.find()

        const planing_code = `PL-${planing.length}`
        const ipAddress = req.ip || req.connection.remoteAddress

        const new_planing = new Planing({
            name: {
                first: first_name,
                last: last_name,
            },
            username: username,
            password: password,
            phone_number: phone_number,
            email: email,
            role: {
                main: 'แพลนนิ่ง',
                sub: null,
            },
            code: planing_code,
            logedInHis: 
                {
                    time: new Date(),
                    ip: ipAddress,
                },
            rank: 'normal'
        })

        const saved_planing = await new_planing.save()
        if(!saved_planing){
            return res.status(500).send({
                message: 'ไม่สามารถสมัครสมาชิกได้',
                new_sale: new_planing,
                saved_purchase: saved_planing
            })
        }

        return res.status(200).send({
            message: 'ลงทะเบียน ฝ่ายแพลนนิ่ง สำเร็จ',
            user: saved_planing
        })

    }
    catch (err) {
        res.send({
            message: "ไม่สามารถสมัครสมาชิกได้",
            error: err.message
        })
        console.log(err.message)
    }
}

// register -production-
exports.productionRegister = async (req, res) => {
    const {
        username, password, phone_number, email,
        first_name, last_name,
    } = req.body
    try {

        const validateData = {username:username, phone_number:phone_number, email:email}
        const duplicate = await validateDuplicate(validateData)
        if(duplicate) {
            return res.status(500).send({
                message: duplicate
            })
        }

        const production = await Production.find()

        const production_code = `PD-${production.length}`
        const ipAddress = req.ip || req.connection.remoteAddress

        const new_production = new Production({
            name: {
                first: first_name,
                last: last_name,
            },
            username: username,
            password: password,
            phone_number: phone_number,
            email: email,
            role: {
                main: 'โปรดักชัน',
                sub: null,
            },
            code: production_code,
            logedInHis: 
                {
                    time: new Date(),
                    ip: ipAddress,
                },
            rank: 'normal'
        })

        const saved_production = await new_production.save()
        if(!saved_production){
            return res.status(500).send({
                message: 'ไม่สามารถสมัครสมาชิกได้',
                new_sale: new_production,
                saved_purchase: saved_production
            })
        }

        return res.status(200).send({
            message: 'ลงทะเบียน ฝ่ายโปรดักชัน สำเร็จ',
            user: saved_production
        })

    }
    catch (err) {
        res.send({
            message: "ไม่สามารถสมัครสมาชิกได้",
            error: err.message
        })
        console.log(err.message)
    }
}

exports.login = async (req, res) => {
    const {username, password} = req.body
    try {
        const sale = await Sale.findOne({username: username})
        const admin = await Admin.findOne({username:username})
        const purchase = await Purchase.findOne({username:username})
        const account = await Account.findOne({username:username})
        const production = await Production.findOne({username:username})
        const planing = await Planing.findOne({username:username})

        if (!sale && !admin && !purchase && !account && !production && !planing) {
            return res.send({
                message: 'ไม่พบ username นี้ในระบบ',
            })
        }
        
        if (sale && password!==sale.password) {
            return res.send({
                message: 'รหัสผ่านไม่ถูกต้อง',
            })
        }

        if (admin && password!==admin.password) {
            return res.send({
                message: 'รหัสผ่านไม่ถูกต้อง',
            })
        }

        if (purchase && password!==purchase.password) {
            return res.send({
                message: 'รหัสผ่านไม่ถูกต้อง',
            })
        }

        if (account && password!==account.password) {
            return res.send({
                message: 'รหัสผ่านไม่ถูกต้อง',
            })
        }

        if (production && password!==production.password) {
            return res.send({
                message: 'รหัสผ่านไม่ถูกต้อง',
            })
        }

        if (planing && password!==planing.password) {
            return res.send({
                message: 'รหัสผ่านไม่ถูกต้อง',
            })
        }

        const secretKey = process.env.SECRET_KEY

        const payload 
        = (sale) ? {
            id: sale._id ,
            code: sale.code,
            role: sale.role,
            name: sale.name,
        } 
        : (admin) ? {
            id: admin._id ,
            code: admin.code,
            role: admin.role,
        }
        : (account) ? {
            id: account._id ,
            code: account.code,
            role: account.role,
            name: account.name,
        }
        : (planing) ? {
            id: planing._id ,
            code: planing.code,
            role: planing.role,
            name: planing.name,
        }
        : (production) ? {
            id: production._id ,
            code: production.code,
            role: production.role,
            name: production.name,
        }
        : (purchase) ? {
            id: purchase._id ,
            code: purchase.code,
            role: purchase.role,
            name: purchase.name,
        }
        : null


        const token = jwt.sign(payload, secretKey, {expiresIn: '90d'})

        return res.send({
            message: 'เข้าสู่ระบบสำเร็จ',
            token: token,
            user: payload,
            success: true
        })
    }
    catch (err) {
        res.send({
            message: "ไม่สามารถเข้าสู่ระบบได้",
            error: err.message
        })
        console.log(err.message)
    }
}