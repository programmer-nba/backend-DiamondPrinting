const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')

// Sale ----------------------------------------

exports.addPreOrder = async (req, res) => {
    const {
        customer,
        order,
        paper,
        colors_front,
        colors_back,
        //pantone,
        coating,
        hotStamp,
        emboss,
        dieCut,
        glue,
        note
    } = req.body
    
    try {
        // check customer already exist? or create new one
        let curCustomer = null
        const ExistCustomer = await Customer.findOne({
            $or: [
                {name: customer.nameTh},
                {taxID: customer.taxID}
            ]
        })
        if(!ExistCustomer) {
            const new_customer = new Customer({
                nameTh: customer.nameTh,
                nameEng: customer.nameEng || null,
                address: customer.address,
                taxID: customer.taxID,
            })
            const saved_customer = await new_customer.save()
            if(!saved_customer){
                return res.send({
                    message: 'สร้างลูกค้าใหม่ไม่สำเร็จ'
                })
            }
            curCustomer = saved_customer
            console.log('สร้างลูกค้าใหม่สำเร็จ',saved_customer)
        } else {
            curCustomer = ExistCustomer
        }
        
        // add new pre-order
        const new_preOrder = new PreOrder({
            customer: curCustomer._id,
            order: {
                amount: order.amount,
                demensions: {
                    width: order.width,
                    long: order.long,
                    height: order.height
                }
            },
            paper: {
                type: paper.type,
                subType: paper.subType
            },
            colors: {
                front: colors_front || null,
                back: colors_back || null
            },
            //pantone: pantone || null,
            coating: {
                method: coating.method || null,
                spotUv: coating.spotUv || null,
                dipOff: coating.dipOff || null
            },
            hotStamp: hotStamp || null,
            emboss: emboss || null,
            dieCut: dieCut || null,
            glue: glue || null,
            note: note || ''
        })
        const saved_preOrder = await new_preOrder.save()
        if(!saved_preOrder){
            return res.send({
                message: 'ไม่สารถสร้าง preOrder ใหม่ได้',
            })
        }

        return res.send({
            message: 'สร้าง preOrder สำเร็จ',
            success: true,
            preOrder: saved_preOrder
        })
    }
    catch (err) {
        res.status(500).send({
            message: 'ไม่สามารถเพิ่ม preorder',
            err: err.message
        })
        console.log(err)
    }
}

exports.getPreOrders = async (req, res) => {
    try {
        const preOrders = await PreOrder.find()
        if(!preOrders || preOrders.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preOrders
            })
        }
        return res.send({
            success: true,
            message: `มีรายการทั้งหมด ${preOrders.length} รายการ`,
            preOrders: preOrders
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.getPreOrder = async (req, res) => {
    const { id } = req.params
    try {
        const preOrder = await PreOrder.findById(id)
        if(!preOrder || preOrder.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrder: preOrder
            })
        }
        return res.send({
            success: true,
            preOrder: preOrder
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.updatePreOrder = async (req, res) => {
    const { id } = req.params
    const {
        order,
        paper,
        colors_front,
        colors_back,
        //pantone,
        coating,
        hotStamp,
        emboss,
        dieCut,
        glue,
        note
    } = req.body
    try {
        let preOrder = await PreOrder.findById(id)
        if(!preOrder || preOrder.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preOrder
            })
        }
        
        preOrder.order.amount = (order && order.amount) ? order.amount : preOrder.order.amount
        preOrder.order.demensions.width = (order && order.width) ? order.width : preOrder.order.demensions.width
        preOrder.order.demensions.long = (order && order.long) ? order.long : preOrder.order.demensions.long
        preOrder.order.demensions.height = (order && order.height) ? order.height : preOrder.order.demensions.height
            
        preOrder.paper.type = (paper && paper.type) ? paper.type : preOrder.paper.type
        preOrder.paper.subType = (paper && paper.subType) ? paper.subType : preOrder.paper.subType
       
        preOrder.colors.front = (colors_front) ? colors_front : preOrder.colors.front
        preOrder.colors.back = (colors_back) ? colors_back : preOrder.colors.back
        
        preOrder.coating.type = (coating && coating.type) ? coating.type : preOrder.coating.type
        preOrder.coating.subType = (coating && coating.subType) ? coating.subType : preOrder.coating.subType
        preOrder.coating.spotUv = (coating && coating.spotUv) ? coating.spotUv : preOrder.coating.spotUv
        preOrder.coating.dipOff = (coating && coating.dipOff) ? coating.dipOff : preOrder.coating.dipOff
        
        preOrder.hotStamp = (hotStamp) ? hotStamp : preOrder.hotStamp
        preOrder.emboss = (emboss) ? emboss : preOrder.emboss
        preOrder.dieCut = (dieCut) ? dieCut : preOrder.dieCut
        preOrder.glue.amount = (glue && glue.amount) ? glue.amount : preOrder.glue.amount
        preOrder.glue.width = (glue && glue.width) ? glue.width : preOrder.glue.width
        preOrder.glue.long = (glue && glue.long) ? glue.long : preOrder.glue.long
        
        preOrder.note = (note) ? note : preOrder.note

        const updated_preOrder = preOrder.save()
        if(!updated_preOrder) {
            return res.send({
                message: 'ไม่สามารถเซฟ pre-order ที่แก้ไขแล้ว',
                updated_preOrder: updated_preOrder
            })
        }

        return res.send({
            success: true,
            message: 'อัพเดทสำเร็จ',
            preOrder: preOrder
        })

    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.deletePreOrder = async (req, res) => {
    const { id } = req.params
    try {
        const preOrder = await PreOrder.findByIdAndDelete(id)
        if(!preOrder || preOrder.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preOrder
            })
        }

        const preProductions = await PreProduction.find({
            preOrder: id
        })
        if(preProductions.length > 0){
            for(i of preProductions){
                const preProduction = await PreProduction.findByIdAndDelete(i._id)
                if(!preProduction){
                    return res.send({
                        message: 'ไม่สามารถลบรายการย่อยนี้',
                        preProduction: preProduction
                    })
                }
            } 
        }

        return res.send({
            success: true,
            message: 'success delete'
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.getPreProductionsOfOrder = async (req, res) => {
    const {id} = req.params
    try {
        const preProductions = await PreProduction.find({
            preOrder: id
        })
        if(!preProductions){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProductions: preProductions || []
            })
        }

        return res.send({
            message: `มีรายการทั้งหมด ${preProductions.length} รายการ`,
            success: true,
            preProductions: preProductions || []
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err.message)
    }
}

// Production -----------------------------------

exports.addPreProduction = async (req, res) => {
    const { id } = req.params
    const { rawMattData, plateData } = req.body

    try {
        const preOrder = await PreOrder.findById(id)
        if(!preOrder){
            return res.send({
                message: 'ไม่พบ pre-order นี้'
            })
        }
        
        const new_preProduction = new PreProduction({
            production: null,
            preOrder: id,
            rawMattData : {
                order : preOrder.order.amount, // from pre-order
                type : preOrder.paper.type, // from pre-order
                subType: preOrder.paper.subType, // from pre-order
                gsm: rawMattData.gsm, 
                width: rawMattData.width,
                long: rawMattData.long,
                cut : rawMattData.cut,
                lay : rawMattData.lay
            },
            plateData : {
                colors : [preOrder.colors.front, preOrder.colors.back], // from pre-order
                size : plateData.size
            },
            printData : {
                colors : [preOrder.colors.front, preOrder.colors.back], // from pre-order
                order : preOrder.order.amount, // from pre-order
                lay : rawMattData.lay
            }
        })
        const saved_production = await new_preProduction.save()
        if(!saved_production){
            return res.send({
                message: 'can not create',
                saved_production: saved_production
            })
        }

        return res.send({
            message: 'success!',
            preProduction: saved_production,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({
            message: err.message
        })
    }
}

exports.getPreProductions = async (req, res) => {
    try {
        const preProductions = await PreProduction.find()
        if(!preProductions || preProductions.length===0){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProductions: preProductions || []
            })
        }

        return res.send({
            message: `มีรายการทั้งหมด ${preProductions.length} รายการ`,
            success: true,
            preProductions: preProductions
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err.message)
    }
}

exports.getPreProduction = async (req, res) => {
    const {id} = req.params
    try {
        const preProduction = await PreProduction.findById(id)
        if(!preProduction){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProductions: preProduction || []
            })
        }

        return res.send({
            success: true,
            preProductions: preProduction
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err.message)
    }
}

exports.updatePreProduction = async (req, res) => {
    const { id } = req.params
    const { rawMattData, plateData } = req.body

    try {
        let preProduction = await PreProduction.findById(id)
        if(!preProduction){
            return res.send({
                message: 'ไม่พบ pre-order นี้'
            })
        }
        
        preProduction.rawMattData.gsm = rawMattData.gsm || preProduction.rawMattData.gsm, 
        preProduction.rawMattData.width = rawMattData.width || preProduction.rawMattData.width,
        preProduction.rawMattData.long = rawMattData.long || preProduction.rawMattData.long,
        preProduction.rawMattData.cut = rawMattData.cut || preProduction.rawMattData.cut,
        preProduction.rawMattData.lay = rawMattData.lay || preProduction.rawMattData.lay
    
        preProduction.plateData.size = plateData.size || preProduction.plateData.size
    
        preProduction.printData.lay = rawMattData.lay || preProduction.printData.lay
            
        const updated_production = await preProduction.save()
        if(!updated_production){
            return res.send({
                message: 'can not create',
                updated_production: updated_production
            })
        }

        return res.send({
            message: 'success!',
            preProduction: updated_production,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({
            message: err.message
        })
    }
}

exports.deletePreProduction = async (req, res) => {
    const {id} = req.params
    try {
        const preProduction = await PreProduction.findByIdAndDelete(id)
        if(!preProduction){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProductions: preProduction || []
            })
        }

        return res.send({
            success: true,
            message: 'delete success'
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err.message)
    }
}

// Order------------------------------------------

exports.creatQuotation = async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).send({
            message: 'ไม่สามารถสร้างใบเสนอราคาได้',
            
        })
        console.log(err)
    }
}