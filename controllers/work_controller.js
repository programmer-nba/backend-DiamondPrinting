const Order = require('../models/orders/order_model.js')
const PlaningSchedule = require('../models/orders/Schedules/planingSchedule_model.js')
const PurchaseSchedule = require('../models/orders/Schedules/purchaseSchedule_model.js')
const ProductionSchedule = require('../models/orders/Schedules/productionSchedule_model.js')
const QCSchedule = require('../models/orders/Schedules/QCSchedule_model.js')
const TransferSchedule = require('../models/orders/Schedules/transferSchedule_model.js')
const File = require('../models/files/file_model.js')
const PreOrder = require('../models/orders/order_model.js')

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
        const order = await Order.findById(orderId)
        const new_schedule = {
            order: orderId,
            details: order.details,
            start_time: start_time,
            end_time: end_time,
            customer: order.customer,
            status: {
                name: 'new',
                text: 'ตารางงานใหม่',
                detail: '',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            },
            purchase: null,
            production: null,
            qc: null,
            transfer: null,
        }
        const schedule = new PlaningSchedule(new_schedule)
        const saved_schedule = await schedule.save()
        if(!saved_schedule){
            return res.send({
                message: 'สร้างตารางงานไม่สำเร็จ',
                planingSchedule: saved_schedule
            })
        }

        const updatedOrderStatus = await Order.findByIdAndUpdate(orderId, {
            $set: {
                status: [
                    {
                        name: 'working',
                        text: 'ลงตารางงานแล้ว',
                        sender: {
                            name: `${userName.first} ${userName.last}`,
                            _id: userId,
                            code: userCode
                        },
                        createAt: new Date()
                    }
                ]
            }
        }, { new : true })
        if(!updatedOrderStatus){
            return res.send({
                message: 'อัพเดทสถานะออร์เดอร์ไม่สำเร็จ',
                order: updatedOrderStatus
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
        .populate('order')
        .populate('purchase')
        .populate('qc')
        .populate('production')
        .populate('transfer')
        .populate('customer')
        .populate('details')
        .exec()
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
        .populate('purchase')
        .populate('qc')
        .populate('production')
        .populate('transfer')
        .populate('customer')
        .populate('details')
        .exec()
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
                    detail: '',
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
        const order = await Order.findById(orderId)
        const new_schedule = {
            order: orderId,
            customer: order.customer,
            details: order.details,
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
                detail: '',
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
                schedule: saved_schedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(scheduleId,{
            $set: {
                purchase: saved_schedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            schedule: saved_schedule,
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
                    remark: {
                        name: remark || '-',
                        createAt: new Date()
                    },
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
                        detail: '',
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

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(purchaseSchedule.planingSchedule,{
            $set: {
                purchase: purchaseSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
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
    const { text, status, detail } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const purchaseSchedule = await PurchaseSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: status,
                        text: text,
                        detail: detail,
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
        ).exec()
        if(!purchaseSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                schedule: purchaseSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(purchaseSchedule.planingSchedule,{
            $set: {
                purchase: purchaseSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            schedule: purchaseSchedule,
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

exports.editUpdatePurchaseSchedule = async (req, res) => {
    const { id, statusId } = req.params
    const { text, status, detail } = req.body
    try {
        const purchaseSchedule = await PurchaseSchedule.findOneAndUpdate( 
            {
                _id: id,
                'status._id' : statusId
            },
            {
                $set: {
                    'status.$.name' : status,
                    'status.$.text' : text,
                    'sstatus.$.detail' : detail,
                    '.status.$.createAt' : new Date()
                }
            },
            {
                new : true
            }   
        ).exec()
        if(!purchaseSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                schedule: purchaseSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(purchaseSchedule.planingSchedule,{
            $set: {
                purchase: purchaseSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            schedule: purchaseSchedule,
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

exports.getFilesPurchase = async (req, res) => {
    const { id } = req.params
    try {
        const files = await File.find({preOrderId: id, fileName: 'purchase'})
        return res.send({
            data: files || [],
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
            success: false
        })
    }
}

exports.getPurchaseSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const purchaseSchedule = 
            await PurchaseSchedule.findById( id )
            .populate('order').populate('planingSchedule').populate('customer').populate('details')
        if(!purchaseSchedule){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                purchaseSchedule: purchaseSchedule
            })
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
            schedule: purchaseSchedule,
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
        const purchaseSchedules = await PurchaseSchedule.find()
        .populate('order')
        .populate('planingSchedule')
        .populate('customer')
        .populate('details')
        .exec()
        if(!purchaseSchedules){
            return res.send({
                message : 'ไม่พบงานนี้ในระบบ',
                schedule : purchaseSchedules
            })
        } else if (purchaseSchedules.length < 1){
            return res.send({
                message: 'มีงาน 0 งาน',
                schedule: [],
                success: true
            })
        }
        const formatSchedules = purchaseSchedules.map((pc)=>{
            const datas = {}
            pc.order.data.cal_data.forEach(item => {
                const key = Object.keys(item)[0]
                datas[key] = item[key]
            })
    
            const data = {
                order: pc.order.amount,
                paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
                paper_cost: datas.rawMatt.paper.cost,
                paper_amount: datas.rawMatt.paper.amount,
            }

            return {
                schedule: pc,
                data: data,
                _id: pc._id
            }
        })

        return res.send({
            schedule: formatSchedules,
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
        const order = await Order.findById(orderId)
        const new_schedule = {
            order: orderId,
            details: order.details,
            customer: order.customer,
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
                detail: '',
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
                schedule: saved_schedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(scheduleId,{
            $set: {
                production: saved_schedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            schedule: saved_schedule,
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

exports.editDateProductionSchedule = async (req, res) => {
    const { id } = req.params
    const { 
        start_time, // required
        end_time, // required
        remark
    } = req.body
    try {
        const schedule = await ProductionSchedule.findByIdAndUpdate( id, 
            {
                $set: {
                    start_time: start_time,
                    end_time: end_time,
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
        if(!schedule){
            return res.send({
                message: 'ไม่สามารถแก้ไขตารางงาน',
                schedule: schedule
            })
        }

        return res.send({
            message: 'แก้ไขตารางงานสำเร็จ',
            schedule: schedule,
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

exports.sendQc = async (req, res) => {
    const { amount, detail } = req.body
    const { id } = req.params
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        let production = await ProductionSchedule.findById(id)
        if(!production){
            return res.send({
                message: 'ไม่พบไอดี production นี้',
                data: null,
                success: false
            })
        }

        production.process.sent += amount
        production.process.status = 'ส่ง QC',
        production.status.push({
            name: 'sendQC',
            text: 'ส่ง qc',
            detail: detail || '',
            sender: {
                name: `${userName.first} ${userName.last}`,
                _id: userId,
                code: userCode
            },
            createAt: new Date()
        })
        const saved_production = await production.save()
        if(!saved_production){
            return res.send({
                message: 'ไม่สามารถบันทึก production',
                success: false,
                data: null
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(saved_production.planingSchedule, {
            $set: {
                production: saved_schedule
            }
        }, { new:true } )
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: `ส่ง QC สำเร็จ จำนวน ${amount} ชิ้น`,
            success: true,
            data: saved_production
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
            success: false,
            data: null
        })
    }
}

exports.rejectQc = async (req, res) => {
    const { amount, detail } = req.body
    const { id } = req.params
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        let production = await ProductionSchedule.findById(id)
        if(!production){
            return res.send({
                message: 'ไม่พบไอดี production นี้',
                data: null,
                success: false
            })
        }

        production.process.sent -= amount
        production.process.status = 'ไม่ผ่าน qc',
        production.status.push({
            name: 'rejectQC',
            text: 'ไม่ผ่าน qc',
            detail: detail || '',
            sender: {
                name: `${userName.first} ${userName.last}`,
                _id: userId,
                code: userCode
            },
            createAt: new Date()
        })
        const saved_production = await production.save()
        if(!saved_production){
            return res.send({
                message: 'ไม่สามารถบันทึก production',
                success: false,
                data: null
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(saved_production.planingSchedule, {
            $set: {
                production: saved_schedule
            }
        }, { new:true } )
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: `ส่งกลับสินค้าไม่ผ่าน QC จำนวน ${amount} ชิ้น`,
            success: true,
            data: saved_production
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
            success: false,
            data: null
        })
    }
}

exports.acceptProductionSchedule = async (req, res) => {
    const { id } = req.params
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const productionSchedule = await ProductionSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: 'accept',
                        text: 'รับงานแล้ว',
                        detail: '',
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
        if(!productionSchedule){
            return res.send({
                message: 'รับงานล้มเหลว',
                schedule: productionSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(productionSchedule.planingSchedule,{
            $set: {
                production: productionSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'รับงานสำเร็จ',
            schedule: productionSchedule,
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

exports.updateProductionSchedule = async (req, res) => {
    const { id } = req.params
    const { text, status, detail } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const productionSchedule = await ProductionSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: status,
                        text: text,
                        detail: detail,
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
        if(!productionSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                schedule: productionSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(productionSchedule.planingSchedule,{
            $set: {
                production: productionSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            schedule: productionSchedule,
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

exports.getProductionSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const productionSchedule = 
            await ProductionSchedule.findById( id )
            .populate('order').populate('planingSchedule').populate('customer').populate('details')
        if(!productionSchedule){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                schedule: productionSchedule
            })
        }
        
        const datas = {}
        productionSchedule.order.data.cal_data.forEach(item => {
            const key = Object.keys(item)[0]
            datas[key] = item[key]
        })

        const data = {
            order: productionSchedule.order.amount,
            paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
            paper_cost: datas.rawMatt.paper.cost,
            paper_amount: datas.rawMatt.paper.amount,
        }

        return res.send({
            schedule: productionSchedule,
            data: data,
            _id: productionSchedule._id,
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

exports.getProductionSchedules = async (req, res) => {
    try {
        const productionSchedules = await ProductionSchedule.find()
        .populate('order')
        .populate('planingSchedule')
        .populate('customer')
        .populate('details')
        if(!productionSchedules){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                productionSchedules: productionSchedules
            })
        } else if (productionSchedules.length < 1){
            return res.send({
                message: 'มีงาน 0 งาน',
                schedule: [],
                success: true
            })
        }

        const formatSchedules = productionSchedules.map((schedule)=>{
            const datas = {}
            schedule.order.data.cal_data.forEach(item => {
                const key = Object.keys(item)[0]
                datas[key] = item[key]
            })
    
            const data = {
                order: schedule.order.amount,
                paper: {
                    paper_type: `${datas.rawMatt.paperType} ${datas.rawMatt.option.gsm}`,
                    paper_size: `${datas.rawMatt.option.width} ${datas.rawMatt.option.long}`,
                    paper_cut: datas.rawMatt.order.cut,
                    paper_lay: datas.rawMatt.order.lay,
                },
                plate: {
                    plate_size: datas.plate.size,
                    plate_flip: datas.plate.flip_plate,
                    plate_colors: datas.plate.colors,
                },
                print: {
                    front_colors: datas[`print_${datas.plate.size}_0`]?.colors,
                    front_floor: datas[`print_${datas.plate.size}_Ffloor`],
                    back_colors: datas[`print_${datas.plate.size}_1`]?.colors,
                    back_floor: datas[`print_${datas.plate.size}_Bfloor`]
                },
                diecut: {
                    block_size: datas.diecut?.blockSize,
                    percent: datas.diecut?.percent,
                    pru:  datas.diecut?.pru ? true : false,
                    window: datas.diecut_window?.pumpPrice ? true : false,
                    blow: datas.diecut_blow?.total ? true : false,
                },
                coating: {
                    front: {
                        type: datas.coating_0?.type,
                        size: datas.coating_0 ? `${datas.coating_0?.inWidth} x ${datas.coating_0?.inLong}` : null,
                        spot_uv: datas.coating_1 ? {
                            type: datas.coating_1?.type,
                            size: datas.coating_1 ? `${datas.coating_1?.inWidth} x ${datas.coating_1?.inLong}` : null,
                        } : {
                            type: null,
                            size: null,
                        }
                    },
                    back: {
                        type: datas.coating_back_0?.type,
                        size: datas.coating_back_0 ? `${datas.coating_back_0?.inWidth} x ${datas.coating_back_0?.inLong}` : null,
                        spot_uv: datas.coating_back_1 ? {
                            type: datas.coating_back_1?.type,
                            size: datas.coating_back_1 ? `${datas.coating_back_1?.inWidth} x ${datas.coating_back_1?.inLong}` : null,
                        } : {
                            type: null,
                            size: null,
                        }
                    },
                }
            }

            return {
                schedule: schedule,
                data: data,
                _id: schedule._id
            }
        })

        return res.send({
            schedule: formatSchedules,
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

exports.getFilesProduction = async (req, res) => {
    const { id } = req.params
    try {
        const files = await File.find({preOrderId: id, fileName: 'production'})
        return res.send({
            data: files || [],
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
            success: false
        })
    }
}

exports.editUpdateProductionSchedule = async (req, res) => {
    const { id, statusId } = req.params
    const { text, status, detail } = req.body
    try {
        const productionSchedule = await ProductionSchedule.findOneAndUpdate( 
            {
                _id: id,
                'status._id' : statusId
            },
            {
                $set: {
                    'status.$.name' : status,
                    'status.$.text' : text,
                    'sstatus.$.detail' : detail,
                    '.status.$.createAt' : new Date()
                }
            },
            {
                new : true
            }   
        ).exec()
        if(!productionSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                schedule: productionSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(productionSchedule.planingSchedule,{
            $set: {
                production: productionSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            schedule: productionSchedule,
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
        const order = await Order.findById(orderId)
        const new_schedule = {
            order: orderId,
            details: order.details,
            customer: order.customer,
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
                detail: '',
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
                schedule: saved_schedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(scheduleId,{
            $set: {
                qc: saved_schedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            schedule: saved_schedule,
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

exports.editDateQCSchedule = async (req, res) => {
    const { id } = req.params
    const { 
        start_time, // required
        end_time, // required
        remark
    } = req.body
    try {
        const schedule = await QCSchedule.findByIdAndUpdate( id, 
            {
                $set: {
                    start_time: start_time,
                    end_time: end_time,
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
        if(!schedule){
            return res.send({
                message: 'ไม่สามารถแก้ไขตารางงาน',
                schedule: schedule
            })
        }

        return res.send({
            message: 'แก้ไขตารางงานสำเร็จ',
            schedule: schedule,
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

exports.acceptQCSchedule = async (req, res) => {
    const { id } = req.params
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const qcSchedule = await QCSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: 'accept',
                        text: 'รับงานแล้ว',
                        detail: '',
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
        if(!qcSchedule){
            return res.send({
                message: 'รับงานล้มเหลว',
                schedule: qcSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(qcSchedule.planingSchedule,{
            $set: {
                qc: qcSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'รับงานสำเร็จ',
            schedule: qcSchedule,
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

exports.updateQCSchedule = async (req, res) => {
    const { id } = req.params
    const { text, status, detail } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const qcSchedule = await QCSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: status,
                        text: text,
                        detail: detail,
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
        if(!qcSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                schedule: qcSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(qcSchedule.planingSchedule,{
            $set: {
                qc: qcSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            schedule: qcSchedule,
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

exports.getQCSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const qcSchedule = 
            await QCSchedule.findById( id )
            .populate('order').populate('planingSchedule').populate('customer').populate('details')
        if(!qcSchedule){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                schedule: qcSchedule
            })
        }
        
        const datas = {}
        qcSchedule.order.data.cal_data.forEach(item => {
            const key = Object.keys(item)[0]
            datas[key] = item[key]
        })

        const data = {
            order: qcSchedule.order.amount,
            paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
            paper_cost: datas.rawMatt.paper.cost,
            paper_amount: datas.rawMatt.paper.amount,
        }

        return res.send({
            schedule: qcSchedule,
            data: data,
            _id: qcSchedule._id,
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

exports.getQCSchedules = async (req, res) => {
    try {
        const qcSchedules = await QCSchedule.find().populate('order').populate('planingSchedule').populate('customer').populate('details')
        if(!qcSchedules){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                schedule: qcSchedules
            })
        } else if (qcSchedules.length < 1){
            return res.send({
                message: 'มีงาน 0 งาน',
                schedule: [],
                success: true
            })
        }
        const formatSchedules = qcSchedules.map((schedule)=>{
            const datas = {}
            schedule.order.data.cal_data.forEach(item => {
                const key = Object.keys(item)[0]
                datas[key] = item[key]
            })
    
            const data = {
                order: schedule.order.amount,
                paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
                paper_cost: datas.rawMatt.paper.cost,
                paper_amount: datas.rawMatt.paper.amount,
            }

            return {
                schedule: schedule,
                data: data,
                _id: schedule._id
            }
        })

        return res.send({
            schedule: formatSchedules,
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

exports.getFilesQC = async (req, res) => {
    const { id } = req.params
    try {
        const files = await File.find({preOrderId: id, fileName: 'qc'})
        return res.send({
            data: files || [],
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
            success: false
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
        const order = await Order.findById(orderId)
        const new_schedule = {
            order: orderId,
            details: order.details,
            customer: order.customer,
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
                detail: '',
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
                schedule: saved_schedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(scheduleId,{
            $set: {
                transfer: saved_schedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'สร้างตารางงานใหม่สำเร็จ',
            schedule: saved_schedule,
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

exports.editDateTransferSchedule = async (req, res) => {
    const { id } = req.params
    const { 
        start_time, // required
        end_time, // required
        remark
    } = req.body
    try {
        const schedule = await TransferSchedule.findByIdAndUpdate( id, 
            {
                $set: {
                    start_time: start_time,
                    end_time: end_time,
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
        if(!schedule){
            return res.send({
                message: 'ไม่สามารถแก้ไขตารางงาน',
                schedule: schedule
            })
        }

        return res.send({
            message: 'แก้ไขตารางงานสำเร็จ',
            schedule: schedule,
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

exports.acceptTransferSchedule = async (req, res) => {
    const { id } = req.params
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const transferSchedule = await TransferSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: 'accept',
                        text: 'รับงานแล้ว',
                        detail: '',
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
        if(!transferSchedule){
            return res.send({
                message: 'รับงานล้มเหลว',
                schedule: transferSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(transferSchedule.planingSchedule,{
            $set: {
                transfer: transferSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }

        return res.send({
            message: 'รับงานสำเร็จ',
            schedule: transferSchedule,
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

exports.updateTransferSchedule = async (req, res) => {
    const { id } = req.params
    const { text, status, detail } = req.body
    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    try {
        const transferSchedule = await TransferSchedule.findByIdAndUpdate( id,
            {
                $push: {
                    status: {
                        name: status,
                        text: text,
                        detail: detail,
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
        if(!transferSchedule){
            return res.send({
                message: 'อัพเดทงานล้มเหลว',
                schedule: transferSchedule
            })
        }

        const planingUpdate = await PlaningSchedule.findByIdAndUpdate(transferSchedule.planingSchedule,{
            $set: {
                transfer: transferSchedule
            }
        }, { new:true })
        if(!planingUpdate) {
            return res.send({
                message: 'ไม่สามารถอัพเดทตารางงานของ planing',
                schedule: planingUpdate
            })
        }


        return res.send({
            message: 'อัพเดทงานสำเร็จ',
            schedule: transferSchedule,
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

exports.getTransferSchedule = async (req, res) => {
    const { id } = req.params
    try {
        const transferSchedule = 
            await TransferSchedule.findById( id )
            .populate('order').populate('planingSchedule').populate('customer').populate('details')
        if(!transferSchedule){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                schedule: transferSchedule
            })
        }
        
        const datas = {}
        transferSchedule.order.data.cal_data.forEach(item => {
            const key = Object.keys(item)[0]
            datas[key] = item[key]
        })

        const data = {
            order: transferSchedule.order.amount,
            paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
            paper_cost: datas.rawMatt.paper.cost,
            paper_amount: datas.rawMatt.paper.amount,
        }

        return res.send({
            schedule: transferSchedule,
            data: data,
            _id: transferSchedule._id,
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

exports.getTransferSchedules = async (req, res) => {
    try {
        const transferSchedules = await TransferSchedule.find().populate('order').populate('planingSchedule').populate('customer').populate('details')
        if(!transferSchedules){
            return res.send({
                message: 'ไม่พบงานนี้ในระบบ',
                schedule: transferSchedules
            })
        } else if (transferSchedules.length < 1){
            return res.send({
                message: 'มีงาน 0 งาน',
                schedule: [],
                success: true
            })
        }
        const formatSchedules = transferSchedules.map((schedule)=>{
            const datas = {}
            schedule.order.data.cal_data.forEach(item => {
                const key = Object.keys(item)[0]
                datas[key] = item[key]
            })
    
            const data = {
                order: schedule.order.amount,
                paper_type: `${datas.rawMatt?.paperType} ${datas.rawMatt?.option.gsm} แกรม` || null,
                paper_cost: datas.rawMatt.paper.cost,
                paper_amount: datas.rawMatt.paper.amount,
            }

            return {
                schedule: schedule,
                data: data,
                _id: schedule._id
            }
        })

        return res.send({
            schedule: formatSchedules,
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

exports.getFilesTransfer = async (req, res) => {
    const { id } = req.params
    try {
        const files = await File.find({preOrderId: id, fileName: 'transfer'})
        return res.send({
            data: files || [],
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            message: err.message,
            success: false
        })
    }
}

/* ACCOUNTING */