const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')

// Sale ----------------------------------------

exports.addPreOrder = async (req, res) => {
    const {
        customer,
        name,
        brand,

        demensions,
        paper,

        colors_front,
        colors_back,
        front_pantone,
        back_pantone,
        floor,

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
        const allCustumers = await Customer.find()
        const existCustomer = await Customer.findOne({
            $or: [
                {name: customer.nameTh},
                {taxID: customer.taxID}
            ]
        })
        if(!existCustomer) {
            const new_customer = new Customer({
                nameTh: customer.nameTh,
                nameEng: customer.nameEng || '-',
                address: customer.address,
                taxID: customer.taxID,
                code: `000${allCustumers.length}`
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
            curCustomer = existCustomer
        }
        
        // add new pre-order
        const new_preOrder = new PreOrder({
            customer: curCustomer._id,
            name: (name) && name,
            brand: (brand) && brand,
            
            demensions: (demensions) && {
                width: demensions.width,
                long: demensions.long,
                height: demensions.height
            },
            
            paper: {
                type: (paper && paper.type) && paper.type,
                subType: (paper && paper.subType) && paper.subType
            },

            colors: {
                front: (colors_front) ? colors_front : 0,
                front_pantone: (front_pantone) && front_pantone,
                floor: (floor) && floor,
                back: (colors_back) ? colors_back : 0,
                back_pantone: (back_pantone) && back_pantone,
            },

            coating: {
                method: (coating && coating.method) ? {
                    type: coating.method.type || null,
                    subType: coating.method.subType || null
                } : null,
                spotUv: (coating && coating.spotUv) ? coating.spotUv : null,
                dipOff: (coating && coating.dipOff) ? coating.dipOff : null
            },

            hotStamp: (hotStamp) ? hotStamp : null,
            emboss: (emboss) ? emboss : null,

            dieCut: (dieCut) ? dieCut : null,

            glue: (glue) ? glue : null,

            note: (note) ? note : ''
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
        const preOrders = await PreOrder.find().populate('customer', '_id nameTh nameEng taxID address contact')
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
        const preOrder = await PreOrder.findById(id).populate('customer', '_id nameTh nameEng taxID address contact')
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
        demensions,
        paper,
        colors_front,
        colors_back,
        front_pantone,
        back_pantone,
        floor,
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
        
        preOrder.demensions.width = (demensions && demensions.width) ? demensions.width : preOrder.demensions.width
        preOrder.demensions.long = (demensions && demensions.long) ? demensions.long : preOrder.demensions.long
        preOrder.demensions.height = (demensions && demensions.height) ? demensions.height : preOrder.demensions.height
            
        preOrder.paper.type = (paper && paper.type) ? paper.type : preOrder.paper.type
        preOrder.paper.subType = (paper && paper.subType) ? paper.subType : preOrder.paper.subType
       
        preOrder.colors.front = (colors_front) ? colors_front : preOrder.colors.front
        preOrder.colors.back = (colors_back) ? colors_back : preOrder.colors.back
        preOrder.colors.front_pantone = (front_pantone) ? front_pantone : preOrder.colors.front_pantone
        preOrder.colors.back_pantone = (back_pantone) ? back_pantone : preOrder.colors.back_pantone
        preOrder.colors.floor = (floor) ? floor : preOrder.colors.floor
        
        preOrder.coating.type = (coating && coating.type) ? coating.type : preOrder.coating.type
        preOrder.coating.subType = (coating && coating.subType) ? coating.subType : preOrder.coating.subType
        preOrder.coating.spotUv = (coating && coating.spotUv) ? coating.spotUv : preOrder.coating.spotUv
        preOrder.coating.dipOff = (coating && coating.dipOff) ? coating.dipOff : preOrder.coating.dipOff
        
        preOrder.hotStamp = (hotStamp) ? hotStamp : preOrder.hotStamp
        preOrder.emboss = (emboss) ? emboss : preOrder.emboss

        preOrder.dieCut = (dieCut) ? dieCut : preOrder.dieCut

        preOrder.glue.mark = (glue && glue.mark) ? glue.mark : preOrder.glue.mark
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

exports.deletePreOrders = async (req, res) => {
    try {
        const preOrder = await PreOrder.deleteMany()
        if(!preOrder || preOrder.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preOrder
            })
        }

        const preProductions = await PreProduction.deleteMany()
        if(!preProductions || preProductions.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preProductions
            })
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
    //const { userId, userName, userRole } = req.user
    //const { files } = req.files
    const { gsm, width, long, cut, lay, plateSize } = req.body

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
                type : (preOrder.paper && preOrder.paper.type) && preOrder.paper.type, // from pre-order
                subType: (preOrder.paper && preOrder.paper.subType) &&  preOrder.paper.subType, // from pre-order
                gsm: (gsm) && gsm, 
                width: (width) && width,
                long: (long) && long,
                cut : (cut) && cut,
                lay : (lay) && lay
            },
            print_4_Data : {
                colors : (preOrder.colors && preOrder.colors.front) ? [preOrder.colors.front, preOrder.colors.back] : [0, 0], // from pre-order
                lay : (lay) && lay,
                floor: (preOrder.colors && preOrder.colors.floor) ? preOrder.colors.floor : false
            },
            print_2_Data : {
                colors : (preOrder.colors && preOrder.colors.front) ? [preOrder.colors.front, preOrder.colors.back] : [0, 0], // from pre-order
                lay : (lay) && lay,
                floor: (preOrder.colors && preOrder.colors.floor) ? preOrder.colors.floor : false
            },
            plateData : {
                colors : (preOrder.colors && preOrder.colors.front) ? [preOrder.colors.front, preOrder.colors.back] : [0, 0], // from pre-order
                size : (plateSize) && plateSize.toString()
            },
            coatingData : {
                method: (preOrder.coating && preOrder.coating.method) ? {
                    type: preOrder.coating.method.type, // from pre-order
                    subType: preOrder.coating.method.subType // from pre-order
                } : {type: null, subTypes: null},
                width: (width) && width, // from pre-order
                long: (long) && long, // from pre-order
                cut: (cut) && cut,  // from pre-order
                lay: (lay) && lay // from pre-order
            },
            embossData : {
                demensions: (preOrder.emboss) ? preOrder.emboss : null,
                plateSize: (plateSize) && plateSize.toString(),
                lay: (lay) && lay
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
    const { userId, userName, userRole } = req.user
    const { files } = req.files
    const { gsm, width, long, cut, lay, plateSize } = req.body

    try {
        let preProduction = await PreProduction.findById(id)
        if(!preProduction){
            return res.send({
                message: 'ไม่พบ pre-order นี้'
            })
        }
        
        preProduction.rawMattData.gsm = gsm || preProduction.rawMattData.gsm, 
        preProduction.rawMattData.width = width || preProduction.rawMattData.width,
        preProduction.rawMattData.long = long || preProduction.rawMattData.long,
        preProduction.rawMattData.cut = cut || preProduction.rawMattData.cut,
        preProduction.rawMattData.lay = lay || preProduction.rawMattData.lay
    
        preProduction.plateData.size = plateSize || preProduction.plateData.size
    
        preProduction.printData.lay = lay || preProduction.printData.lay
            
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
    const { id } = req.params
    const { userId, userRole, userName } = req.user
    const { datas, costDetails, sumCost } = req.body
    try {
        const preProduction = await PreProduction.findById(id)
        if(!preProduction || preProduction.length===0){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProduction: preProduction
            })
        }

        const preOrder = await PreOrder.findById(preProduction.preOrder).populate('customer', 'nameTh nameEng taxID contact')
        if(!preOrder || preOrder.length===0){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preOrder: preOrder
            })
        }

        const new_quotation = {

        }
    }
    catch (err) {
        res.status(500).send({
            message: 'ไม่สามารถสร้างใบเสนอราคาได้',
            
        })
        console.log(err)
    }
}