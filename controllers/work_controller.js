const Order = require('../models/orders/order_model.js')
const PlaningSchedule = require('../models/orders/Schedules/planingSchedule_model.js')
const PurchaseSchedule = require('../models/orders/Schedules/purchaseSchedule_model.js')
const ProductionSchedule = require('../models/orders/Schedules/productionSchedule_model.js')
const QCSchedule = require('../models/orders/Schedules/QCSchedule_model.js')
const TransferSchedule = require('../models/orders/Schedules/transferSchedule_model.js')
const File = require('../models/files/file_model.js')

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
    const { text, status } = req.body
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
            .populate('order').populate('planingSchedule')
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
    const { text, status } = req.body
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
            .populate('order').populate('planingSchedule')
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
    const { text, status } = req.body
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
            .populate('order').populate('planingSchedule')
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
        const qcSchedules = await QCSchedule.find().populate('order').populate('planingSchedule')
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
    const { text, status } = req.body
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
            .populate('order').populate('planingSchedule')
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
        const transferSchedules = await TransferSchedule.find().populate('order').populate('planingSchedule')
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