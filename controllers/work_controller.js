const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')
const Quotation = require('../models/orders/quotation_model.js')
const Order = require('../models/orders/order_model.js')
const PlaningSchedule = require('../models/orders/Schedules/planingSchedule_model.js')
const PurchaseSchedule = require('../models/orders/Schedules/purchaseSchedule_model.js')
const ProductionSchedule = require('../models/orders/Schedules/productionSchedule_model.js')
const QCSchedule = require('../models/orders/Schedules/QCSchedule_model.js')
const TransferSchedule = require('../models/orders/Schedules/transferSchedule_model.js')

/*  Planing  */
exports.createNewPlaningSchedule = async (req, res) => {
    const {
        orderId, // required
        start_time, // required
        end_time, // required
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const new_schedule = {
            order: orderId,
            start_time: start_time,
            end_time: end_time,
            progress: {
                status: 'new',
                percent: 0
            },
            status: {
                name: 'new',
                text: 'ตารางงานใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            },
        }
        const schedule = new PlaningSchedule(new_schedule)
        const saved_schedule = await schedule.save()
        if(!saved_schedule){
            return res.send({
                message: 'สร้างตารางงานไม่สำเร็จ',
                planingSchedule: saved_schedule
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่แล้ว',
            planingSchedule: saved_schedule,
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
        })
    }
}

exports.getPlaningSchedules = async (req, res) => {
    try {
        const schedules = await PlaningSchedule.find()
        if(!schedules && schedules.length < 1){
            return res.send({
                message: 'ไม่พบตารางงาน',
                planingSchedule: schedules || []
            })
        }

        return res.send({
            message: `มีตารางงานทั้งหมด ${schedules.length}`,
            amount: schedules.length,
            planingSchedule: schedules,
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
        })
    }
}

exports.getPlaningSchedule = async (req, res) => {
    const {id} = req.params
    try {
        const schedule = await PlaningSchedule.findById(id)
        if(!schedule){
            return res.send({
                message: 'ไม่พบตารางงาน',
                planingSchedule: schedule
            })
        }

        return res.send({
            planingSchedule: schedule,
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
        })
    }
}

exports.editPlaningSchedule = async (req, res) => {
    const { id } = req.params
    const {
        start_time, // required
        end_time, // required
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const schedule = await PlaningSchedule.findByIdAndUpdate(id, {
            $set: {
                start_time: start_time,
                end_time: end_time,
            },
            $push: {
                status: {
                    name: 'edit',
                    text: 'แก้ไขตารางงาน',
                    sender: {
                        name: `${userName.first} ${userName.last}`,
                        _id: userId,
                        code: userCode
                    },
                    createAt: new Date()
                },
            }
        })
        if(!schedule){
            return res.send({
                message: 'แก้ไขตารางงานไม่สำเร็จ',
                planingSchedule: schedule
            })
        }

        return res.send({
            message: 'แก้ไขตารางงานสำเร็จแล้ว',
            planingSchedule: schedule,
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
        })
    }
}

exports.deletePlaningSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const schedule = await PlaningSchedule.findByIdAndDelete( id )
        if(!schedule){
            return res.send({
                message: 'ไม่พบตารางงาน',
                planingSchedule: schedule
            })
        }

        return res.send({
            message: 'ลบตารางงานเรียบร้อย',
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
        })
    }
}

/*  Purchase  */
exports.createNewPurchaseSchedule = async (req, res) => {
    const { 
        orderId, // required
        scheduleId, // required
        start_time, // required
        end_time, // required
        remark
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const new_schedule = {
            order: orderId,
            planingSchedule: scheduleId,
            start_time: start_time,
            end_time: end_time,
            progress: {
                status: 'new',
                percent: 0
            },
            remark: remark || '-',
            status: {
                name: 'new',
                text: 'ตารางงานใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            }
        }
        const schedule = new PurchaseSchedule(new_schedule)
        const saved_schedule = await schedule.save()
        if(!saved_schedule){
            return res.send({
                message: 'ไม่สามารถสร้างตารางงานใหม่',
                purchaseSchedule: saved_schedule
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            purchaseSchedule: saved_schedule,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message
        })
    }
}

/*  Production  */
exports.createNewProductionSchedule = async (req, res) => {
    const { 
        orderId, // required
        scheduleId, // required
        start_time, // required
        end_time, // required
        remark
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const new_schedule = {
            order: orderId,
            planingSchedule: scheduleId,
            start_time: start_time,
            end_time: end_time,
            progress: {
                status: 'new',
                percent: 0
            },
            remark: remark || '-',
            status: {
                name: 'new',
                text: 'ตารางงานใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            }
        }
        const schedule = new ProductionSchedule(new_schedule)
        const saved_schedule = await schedule.save()
        if(!saved_schedule){
            return res.send({
                message: 'ไม่สามารถสร้างตารางงานใหม่',
                productionSchedule: saved_schedule
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            productionSchedule: saved_schedule,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message
        })
    }
}

/*  QC  */
exports.createNewQCSchedule = async (req, res) => {
    const { 
        orderId, // required
        scheduleId, // required
        start_time, // required
        end_time, // required
        remark
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const new_schedule = {
            order: orderId,
            planingSchedule: scheduleId,
            start_time: start_time,
            end_time: end_time,
            progress: {
                status: 'new',
                percent: 0
            },
            remark: remark || '-',
            status: {
                name: 'new',
                text: 'ตารางงานใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            }
        }
        const schedule = new QCSchedule(new_schedule)
        const saved_schedule = await schedule.save()
        if(!saved_schedule){
            return res.send({
                message: 'ไม่สามารถสร้างตารางงานใหม่',
                qcSchedule: saved_schedule
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            qcSchedule: saved_schedule,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message
        })
    }
}

/*  Transfer  */
exports.createNewTransferSchedule = async (req, res) => {
    const { 
        orderId, // required
        scheduleId, // required
        start_time, // required
        end_time, // required
        remark
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const new_schedule = {
            order: orderId,
            planingSchedule: scheduleId,
            start_time: start_time,
            end_time: end_time,
            progress: {
                status: 'new',
                percent: 0
            },
            remark: remark || '-',
            status: {
                name: 'new',
                text: 'ตารางงานใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            }
        }
        const schedule = new TransferSchedule(new_schedule)
        const saved_schedule = await schedule.save()
        if(!saved_schedule){
            return res.send({
                message: 'ไม่สามารถสร้างตารางงานใหม่',
                transferSchedule: saved_schedule
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            transferSchedule: saved_schedule,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message
        })
    }
}