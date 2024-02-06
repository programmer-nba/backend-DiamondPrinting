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
        const schedules = await PlaningSchedule.find().populate('order')
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
            remark: {
                name: remark,
                createAt: new Date()
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

exports.editDatePurchaseSchedule = async (req, res) => {
    const { id } = req.params
    const { 
        start_time, // required
        end_time, // required
        remark
    } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const schedule = await PurchaseSchedule.findByIdAndUpdate( id, 
            {
                $set: {
                    start_time: start_time,
                    end_time: end_time,
                    remark: remark || '-',
                },
            },
            {
                new : true
            }
        )
        if(!schedule){
            return res.send({
                message: 'ไม่สามารถแก้ไขตารางงาน',
                purchaseSchedule: schedule
            })
        }

        return res.send({
            message: 'แก้ไขตารางงานสำเร็จ',
            purchaseSchedule: schedule,
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

exports.acceptPurchaseSchedule = async (req, res) => {
    const { id } = req.params
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const purchaseSchedule = await PurchaseSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: 'accept',
                        text: 'รับงานแล้ว',
                        sender: {
                            name: `${userName.first} ${userName.last}`,
                            _id: userId,
                            code: userCode
                        },
                        createAt: new Date()
                    }
                }
            },
            {
                new : true
            }   
        )
        if(!purchaseSchedule){
            return res.send({
                message: 'รับงานล้มเหลว',
                purchaseSchedule: purchaseSchedule
            })
        }

        return res.send({
            message: 'รับงานสำเร็จ',
            purchaseSchedule: purchaseSchedule,
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

exports.updatePurchaseSchedule = async (req, res) => {
    const { id } = req.params
    const { remark, status } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const purchaseSchedule = await PurchaseSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: status,
                        text: 'อัพเดทงานแล้ว',
                        sender: {
                            name: `${userName.first} ${userName.last}`,
                            _id: userId,
                            code: userCode
                        },
                        createAt: new Date()
                    },
                    remark: {
                        name: remark,
                        createAt: new Date()
                    }
                }
            },
            {
                new : true
            }   
        )
        if(!purchaseSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                purchaseSchedule: purchaseSchedule
            })
        }

        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            purchaseSchedule: purchaseSchedule,
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

exports.getPurchaseSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const purchaseSchedule = 
            await PurchaseSchedule.findById( id )
            .populate('order', 'data')
        if(!purchaseSchedule){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                purchaseSchedule: purchaseSchedule
            })
        }
        const statusLastIndex = purchaseSchedule.status.length > 0 ? purchaseSchedule.status.length-1 : 0
        const remarkLastIndex = purchaseSchedule.remark.length > 0 ? purchaseSchedule.remark.length-1 : 0
        const schedule = {
            start_time: purchaseSchedule.start_time,
            end_time: purchaseSchedule.end_time,
            progress: purchaseSchedule.progress,
            status: purchaseSchedule.status[statusLastIndex],
            remark: purchaseSchedule.remark[remarkLastIndex]
        }
        
        const datas = {}
        purchaseSchedule.order.data.cal_data.forEach(item => {
            const key = Object.keys(item)[0]
            datas[key] = item[key]
        })

        const data = {
            order: purchaseSchedule.order.amount,
            paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
            paper_cost: datas.rawMatt.paper.cost,
            paper_amount: datas.rawMatt.paper.amount,
        }

        return res.send({
            purchaseSchedule: schedule,
            data: data,
            _id: purchaseSchedule._id,
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

exports.getPurchaseSchedules = async (req, res) => {
    try {
        const purchaseSchedules = await PurchaseSchedule.find().populate('order', 'data')
        if(!purchaseSchedules){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                purchaseSchedules: purchaseSchedules
            })
        } else if (purchaseSchedules.length < 1){
            return res.send({
                message: 'มีงาน 0 งาน',
                purchaseSchedules: [],
                success: true
            })
        }
        const formatSchedules = purchaseSchedules.map((purchaseSchedule)=>{
            const statusLastIndex = purchaseSchedule.status.length > 0 ? purchaseSchedule.status.length-1 : 0
            const remarkLastIndex = purchaseSchedule.remark.length > 0 ? purchaseSchedule.remark.length-1 : 0
            const schedule = {
                start_time: purchaseSchedule.start_time,
                end_time: purchaseSchedule.end_time,
                progress: purchaseSchedule.progress,
                status: purchaseSchedule.status[statusLastIndex],
                remark: purchaseSchedule.remark[remarkLastIndex]
            }
            
            const datas = {}
            purchaseSchedule.order.data.cal_data.forEach(item => {
                const key = Object.keys(item)[0]
                datas[key] = item[key]
            })
    
            const data = {
                order: purchaseSchedule.order.amount,
                paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
                paper_cost: datas.rawMatt.paper.cost,
                paper_amount: datas.rawMatt.paper.amount,
            }

            return {
                purchaseSchedule: schedule,
                data: data,
                _id: purchaseSchedule._id
            }
        })

        return res.send({
            purchaseSchedules: formatSchedules,
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