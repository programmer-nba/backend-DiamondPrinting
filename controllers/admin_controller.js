const Admin = require('../models/members/admin_model.js')
const Sale = require('../models/members/sale_model.js')
const Production = require('../models/members/production_model.js')
const Purchase = require('../models/members/purchase_model.js')
const Planing = require('../models/members/planing_model.js')
const Account = require('../models/members/account_model.js')

exports.getAllMembers = async ( req, res ) => {
    try {
        let members = {}

        const admins = await Admin.find()
        if(!admins || admins.length === 0){
            members.admin = []
        } else {
            members.admin = admins
        }

        const sales = await Sale.find()
        if(!sales || sales.length === 0){
            members.sale = []
        } else {
            members.sale = sales
        }

        const productions = await Production.find()
        if(!productions || productions.length === 0){
            members.production = []
        } else {
            members.production = productions
        }

        const purchases = await Purchase.find()
        if(!purchases || purchases.length === 0){
            members.purchase = []
        } else {
            members.purchase = purchases
        }

        const planings = await Planing.find()
        if(!planings || planings.length === 0){
            members.planing = []
        } else {
            members.planing = planings
        }

        const accounts = await Account.find()
        if(!accounts || accounts.length === 0){
            members.account = []
        } else {
            members.account = accounts
        }

        const members_data = [].concat(...Object.values(members))

        const members_key = Object.keys(members)
        members.roles = members_key

        return res.send({
            message: `มีสมาชิกทั้งหมด ${members_data.length}`,
            members : members,
            success : true
        })
    }
    catch (err) {
        console.log( err )
        return res.status(500).send({
            message: err.message
        })
    }
}

