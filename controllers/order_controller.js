const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')
const Quotation = require('../models/orders/quotation_model.js')

const genCode = (curLength) => {
    const result = 
        (curLength>999) ? `${curLength}`
        : (curLength>99 && curLength<1000) ? `0${curLength}`
        : (curLength>9 && curLength<100) ? `00${curLength}`
        : `000${curLength}`
    return result
}

// Sale ----------------------------------------

exports.addPreOrder = async (req, res) => {
    const {
        customer,
        name,
        brand,

        demensions,
        paper,

        colors_front_type,
        colors_front,
        colors_back_type,
        colors_back,
        front_pantone,
        back_pantone,
        floor_front,
        floor_back,
        flip_plate,

        coating,
        hotStamp,
        emboss,
        dieCut,
        dieCutWindow=null,
        glue,
        glue2,
        glue_dot,

        note
    } = req.body

    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    //const userRole = req.user.role.main
    //const userPhone = req.user.phone_number
    
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
                nameTh: (customer.nameTh) ? customer.nameTh : '-',
                nameEng: (customer.nameEng) ? customer.nameEng : null,
                email: (customer.email) ? customer.email : null,
                address: {
                    houseNo: (customer.address && customer.address.houseNo) ? customer.address.houseNo : '-',
                    province: (customer.address && customer.address.province) ? customer.address.province : '-',
                    district: (customer.address && customer.address.district) ? customer.address.district : '-',
                    subdistrict: (customer.address && customer.address.subdistrict) ? customer.address.subdistrict : '-',
                    street: (customer.address && customer.address.street) ? customer.address.street : '-',
                    postcode: (customer.address && customer.address.postcode) ? customer.address.postcode : '-'
                },
                taxID: (customer.taxID) ? customer.taxID : '-',
                code: genCode(allCustumers.length),
                contact: {
                    name: (customer.contact && customer.contact.name) ? customer.contact.name : '-',
                    tel: (customer.contact && customer.contact.tel) ? customer.contact.tel : '-',
                    createAt: new Date()
                }
            })
            const saved_customer = await new_customer.save()
            if(!saved_customer){
                return res.send({
                    message: 'สร้างลูกค้าใหม่ไม่สำเร็จ'
                })
            }
            curCustomer = saved_customer
        } else {
            
            const updated_customer = await Customer.findByIdAndUpdate(existCustomer._id,
                {
                    $set: {
                        nameTh: customer.nameTh,
                        nameEng: customer.nameEng,
                        email: customer.email,
                        address: {
                            houseNo: customer.address.houseNo,
                            province: customer.address.province,
                            district: customer.address.district,
                            subdistrict: customer.address.subdistrict,
                            street: customer.address.street,
                            postcode: customer.address.postcode
                        },
                        taxID: customer.taxID
                    },
                    $push: {
                        contact: {
                            name: customer.contact.name,
                            tel: customer.contact.tel,
                            createAt: new Date()
                        }
                    }
                }, {new:true}
            )
            if(!updated_customer){
                return res.send({
                    message: 'อัพเดทข้อมูลผู้ติดต่อไม่สำเร็จ'
                })
            }
            curCustomer = updated_customer
            
        }

        const prev_preOrder = await PreOrder.find()
        const code = genCode(prev_preOrder.length)
        
        // add new pre-order
        const new_preOrder = new PreOrder({
            code: code,
            customer: curCustomer._id,
            name: (name) && name,
            brand: (brand) && brand,
            
            demensions: (demensions) && {
                width: demensions.width,
                long: demensions.long,
                height: demensions.height
            },

            sale: userId,
            
            paper: {
                type: (paper && paper.type) && paper.type,
                subType: (paper && paper.subType) && paper.subType,
                gsm: (paper && paper.gsm) && paper.gsm
            },

            flip_plate: (flip_plate) ? true : false,

            colors: {
                front_type:(colors_front_type) ? colors_front_type : null,
                front: (colors_front) ? colors_front : 0,
                front_pantone: (front_pantone) && front_pantone,
                floor_front: (floor_front) && floor_front,
                back_type:(colors_back_type) ? colors_back_type : null,
                back: (colors_back) ? colors_back : 0,
                back_pantone: (back_pantone) && back_pantone,
                floor_back: (floor_back) && floor_back,
            },

            coating: (coating && coating.length!==0) ? coating : null,

            hotStamp: (hotStamp && hotStamp.length!==0) ? hotStamp : null,
            emboss: (emboss && emboss.length!==0) ? emboss : null,

            dieCut: (dieCut) ? {
                percent: (dieCut.percent) ? dieCut.percent : null,
                notice: (dieCut.notice) ? dieCut.notice : null,
                detail: (dieCut.detail) ? dieCut.detail : null
            } : null,

            dieCutWindow: (dieCutWindow) ? {
                percent: (dieCutWindow.percent) ? dieCutWindow.percent : null,
                notice: (dieCutWindow.notice) ? dieCutWindow.notice : null,
                detail: (dieCutWindow) ? 'หน้าต่าง' : null
            } : null,

            glue: (glue && glue.length!==0) ? glue : null,
            glue2: (glue2 && glue2.length!==0) ? glue2 : null,
            glue_dot: (glue_dot && glue_dot.length!==0) ? glue_dot : null,

            status: {
                name: 'new',
                text: 'พรีออร์เดอร์ใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    code: userCode,
                    _id: userId,
                },
                createAt: new Date()
            },
            
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
        const preOrders = await PreOrder.find().populate('customer', '_id nameTh nameEng taxID address contact email').populate('sale', '_id name phone_number email')
        if(!preOrders || preOrders.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preOrders || []
            })
        }
        return res.send({
            success: true,
            message: `มีรายการทั้งหมด ${preOrders.length} รายการ`,
            preOrders: preOrders.reverse()
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
        const preOrder = await PreOrder.findById(id).populate('customer', '_id nameTh nameEng taxID address contact email').populate('sale', '_id name phone_number email')
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
        floor_front,
        floor_back,
        coating,
        hotStamp,
        emboss,
        dieCut,
        glue,
        glue2,
        glue_dot,
        note
    } = req.body

    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code

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
        preOrder.paper.gsm = (paper && paper.gsm) ? paper.gsm : preOrder.paper.gsm
       
        preOrder.colors.front = (colors_front) ? colors_front : preOrder.colors.front
        preOrder.colors.back = (colors_back) ? colors_back : preOrder.colors.back
        preOrder.colors.front_pantone = (front_pantone) ? front_pantone : preOrder.colors.front_pantone
        preOrder.colors.back_pantone = (back_pantone) ? back_pantone : preOrder.colors.back_pantone
        preOrder.colors.floor_front = (floor_front) ? floor_front : preOrder.colors.floor_front
        preOrder.colors.floor_back = (floor_back) ? floor_back : preOrder.colors.floor_back
        
        preOrder.coating.type = (coating && coating.type) ? coating.type : preOrder.coating.type
        preOrder.coating.subType = (coating && coating.subType) ? coating.subType : preOrder.coating.subType
        preOrder.coating.spotUv = (coating && coating.spotUv) ? coating.spotUv : preOrder.coating.spotUv
        preOrder.coating.dipOff = (coating && coating.dipOff) ? coating.dipOff : preOrder.coating.dipOff
        
        preOrder.hotStamp = (hotStamp && hotStamp.length!==0) ? hotStamp : preOrder.hotStamp
        preOrder.emboss = (emboss && emboss.length!==0) ? emboss : preOrder.emboss

        preOrder.dieCut.percent = (dieCut && dieCut.percent) ? dieCut.percent : preOrder.dieCut.percent
        preOrder.dieCut.notice = (dieCut && dieCut.notice) ? dieCut.notice : preOrder.dieCut.notice
        preOrder.dieCut.detail = (dieCut && dieCut.detail) ? dieCut.detail : preOrder.dieCut.detail

        preOrder.glue = (glue && glue.length!==0) ? glue : preOrder.glue

        preOrder.glue2 = (glue2 && glue2.length!==0) ? glue2 : preOrder.glue2

        preOrder.glue_dot = (glue_dot && glue_dot.length!==0) ? glue_dot : preOrder.glue_dot

        preOrder.status.push(
            {
                name: 'edit',
                text: 'แก้ไขข้อมูลพรีออร์เดอร์',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    code: userCode,
                    _id: userId
                },
                createAt: new Date()
            }
        )
        
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
        }).populate('customer', 'nameTh nameEng taxID contact address _id email').populate('production', 'name code _id email')
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
    const userId = req.user.id
    const userCode = req.user.code
    const userName = req.user.name
    //const { files } = req.files
    const { width, long, cut, lay, plateSize, k, inWidth, inLong } = req.body

    try {
        let preOrder = await PreOrder.findById(id)
        if(!preOrder){
            return res.send({
                message: 'ไม่พบ pre-order นี้'
            })
        }
        
        const prev_preProduction = await PreProduction.find()
        const code = `${preOrder.code}-${genCode(prev_preProduction.length)}`
        const new_preProduction = new PreProduction({
            code: code,
            customer: preOrder.customer,
            sale: preOrder.sale,
            production: userId,
            preOrder: id,
            data_input: {
                width: width,
                long: long,
                cut: cut,
                lay: lay,
                plateSize: plateSize,
                inWidth: inWidth,
                inLong: inLong
            },
            rawMattData : {
                type : (preOrder.paper && preOrder.paper.type) && preOrder.paper.type, // from pre-order
                subType: (preOrder.paper && preOrder.paper.subType) &&  preOrder.paper.subType, // from pre-order
                gsm: (preOrder.paper && preOrder.paper.gsm) && preOrder.paper.gsm, 
                width: (width) && width,
                long: (long) && long,
                cut : (cut) && cut,
                lay : (lay) && lay
            },
            print_4_Data : (plateSize && plateSize==="4") ? {
                colors : (preOrder.colors && preOrder.colors.front) ? [preOrder.colors.front, preOrder.colors.back] : [0, 0],
                lay : (lay) && lay,
                floor_front: (preOrder.colors && preOrder.colors.floor_front) ? preOrder.colors.floor_front : false,
                floor_back: (preOrder.colors && preOrder.colors.floor_back) ? preOrder.colors.floor_back : false
            } : null,
            print_2_Data : (plateSize && plateSize==="2") ? {
                colors : (preOrder.colors && preOrder.colors.front) ? [preOrder.colors.front, preOrder.colors.back] : [0, 0],
                lay : (lay) && lay,
                floor_front: (preOrder.colors && preOrder.colors.floor_front) ? preOrder.colors.floor_front : false,
                floor_back: (preOrder.colors && preOrder.colors.floor_back) ? preOrder.colors.floor_back : false
            } : null,
            plateData : {
                colors : (preOrder.colors && preOrder.colors.front) ? preOrder.colors.front + preOrder.colors.back : 0, // from pre-order
                size : (plateSize) && plateSize.toString(),
                flip_plate: preOrder.flip_plate
            },
            coatingData : {
                methods: (preOrder.coating && preOrder.coating.length!==0) ? preOrder.coating : null,
                //spotUv: (preOrder.coating && preOrder.coating.spotUv.trim() !=='' || preOrder.coating.spotUv !==null) ? true : false,
                //dipOff: (preOrder.coating && preOrder.coating.dipOff) ? true : false,
                width: (width) && width, // from pre-order
                inWidth: (inWidth) && inWidth, // from pre-order
                inLong: (inLong) && inLong, // from pre-order
                long: (long) && long, // from pre-order
                cut: (cut) && cut,  // from pre-order
                lay: (lay) && lay // from pre-order
            },
            embossData : {
                demensions: (preOrder.emboss) ? preOrder.emboss : null,
                plateSize: (plateSize) && plateSize.toString(),
                lay: (lay) && lay
            },
            hotStampData : {
                block : (preOrder.hotStamp) ? preOrder.hotStamp : null,
                lay: (lay) && lay,
                k: (k) ? k : 1
            },
            diecutData : (preOrder.dieCut.detail) ? {
                plateSize: (preOrder.dieCut.detail) ? plateSize : null,
                lay: (preOrder.dieCut.detail) ? lay : null
            } : null,
            diecutWindowData : (preOrder.dieCutWindow.detail) ? {
                plateSize: (preOrder.dieCutWindow.detail) ? plateSize : null,
                lay: (preOrder.dieCutWindow.detail) ? lay : null
            } : null,
            glueData : {
                glue: (preOrder.glue && preOrder.glue.length!==0) ? preOrder.glue : null,
                glue2: (preOrder.glue2 && preOrder.glue2.length!==0) ? preOrder.glue2 : null,
                glue_dot: (preOrder.glue_dot && preOrder.glue_dot.length!==0) ? preOrder.glue_dot : null
            },
            status: {
                name: 'new',
                text: 'พรีโพรดักชันใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            },
            down: (cut && lay) ? cut*lay : null
        })
        //console.log(preOrder.dieCutWindow)
        const saved_production = await new_preProduction.save()
        if(!saved_production){
            return res.send({
                message: 'can not create',
                saved_production: saved_production
            })
        }

        preOrder.status.push({
            name: 'filled',
            text: 'กราฟฟิคเพิ่มข้อมูลแล้ว',
            ref: code,
            sender: {
                name: `${userName.first} ${userName.last}`,
                _id: userId,
                code: userCode
            },
            createAt: new Date()
        })

        await preOrder.save()

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
        const preProductions = await PreProduction.find().populate('customer', 'nameTh nameEng taxID contact address email').populate('preOrder').populate('sale', '_id code name phone_number email')
        if(!preProductions || preProductions.length===0){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProductions: preProductions || []
            })
        }

        console.log(preProductions[0].preOrder)
        

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
        const preProduction = await PreProduction.findById(id).populate('customer', 'nameTh nameEng taxID contact address email').populate('sale', '_id code name phone_number email')
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
    const userId = req.user.id
    const userCode = req.user.code
    const userName = req.user.name
    //const { files } = req.files
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
    
        preProduction.print_2_Data.lay = lay || preProduction.print_2_Data.lay
        preProduction.print_4_Data.lay = lay || preProduction.print_4_Data.lay

        preProduction.status.push({
            name: 'edit-new',
            text: 'แก้ไขรายละเอียดพรีโปดักชั่น',
            sender: {
                name: `${userName.first} ${userName.last}`,
                code: userCode,
                _id: userId
            },
            createAt: new Date()
        })
            
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
    const { id } = req.params
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        const preProduction = await PreProduction.findByIdAndDelete(id)
        if(!preProduction){
            return res.send({
                message: 'ไม่พบรายการนี้ในระบบ',
                preProductions: preProduction || []
            })
        }

        const preOrder = await PreOrder.findByIdAndUpdate(preProduction.preOrder,
            {
                status: {
                    $push: {
                        name: 'del-production',
                        text: 'ฟรีโปรดักชั่นถูกลบ',
                        ref: preProduction.code,
                        sender: {
                            name: `${userName.first} ${userName.last}`,
                            code: userCode,
                            _id: userId
                        },
                        createAt: new Date()
                    }
                }
            }
        )
        if(!preOrder){
            return res.send({
                success: true,
                message: 'delete success but can not update status of preOrder'
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

// create new quotation
exports.creatQuotation = async (req, res) => {
    const { preOrderId, calOrder  } = req.body
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        let preOrder = await PreOrder.findById(preOrderId)
        .populate('customer', 'code nameTh nameEng contact address _id email')
        .populate('sale', 'code name phone_number email _id')
        if(!preOrder){
            return res.send({
                message: 'ไม่พบ preOrderId นี้',
                preOrder: preOrder
            })
        }
        const length_Quotation = await Quotation.find()
        const code = `DM-${preOrder.customer.code}-${preOrder.code}-${genCode(length_Quotation.length)}`
        const curDate = new Date();
        const expirationDate = new Date(curDate)
        expirationDate.setDate(curDate.getDate() + 20)

        const new_quotation = new Quotation({
            code: code,
            customer: preOrder.customer._id,
            sale: preOrder.sale._id,
            preOrder: preOrder._id,
            price: calOrder,
            start: curDate.toISOString(),
            expire: expirationDate.toISOString()
        })
        const saved_quotation = await new_quotation.save()
        if(!saved_quotation){
            return res.send({
                message: 'ไม่่สามารถบันทึกใบเสนอราคา',
                saved_quotation: saved_quotation
            })
        }

        preOrder.status.push({
            name: 'got-quotation',
            text: 'เพิ่มในใบเสนอราคาแล้ว',
            ref: code,
            sender: {
                name: `${userName.first} ${userName.last}`,
                code: userCode,
                _id: userId
            },
            createAt: new Date()
        })

        const saved_preOrder = await preOrder.save()

        let preProduction = await PreProduction.find({
            preOrder: preOrderId
        })

        const updateStatus = preProduction.forEach( async item => {
            item.status.push({
                name: 'got-quotation',
                text: 'เพิ่มในใบเสนอราคาแล้ว',
                ref: code,
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    code: userCode,
                    _id: userId
                },
                createAt: new Date()
            })
            const saved_preProduction = await item.save()
            if(!saved_preProduction){
                console.log('Saved pre production fail')
            }
        })

        const updatedStatus = await Promise.all(updateStatus)
        /* if(!updatedStatus){
            return res.status(500).send({
                message: 'update pre-production status fail'
            })
        } */
        
        return res.send({
            message: 'สร้างใบเสนอราคาสำเร็จ',
            success: true,
            quotation: saved_quotation
        })
    }
    catch (err) {
        res.send({
            message: 'ไม่สามารถสร้างใบเสนอราคาได้',
            err: err.message
        })
        console.log(err)
    }
}

// get all quotations
exports.getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().populate('customer', 'nameTh nameEng taxID contact _id code address email').populate('sale', 'name phone_number code').populate('preOrder')
        if(!quotations){
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotations: quotations || []
            })
        } else if (quotations.length === 0) {
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotations: quotations || []
            })
        }

        return res.send({
            success: true,
            message: `มีใบเสนอราคาทั้งหมด ${quotations.length}`,
            quotations: quotations.reverse()
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}

// get all quotations of specific pre-order
exports.getQuotationOfpreOrder = async (req, res) => {
    const { id } = req.params
    try {
        const quotations = await Quotation.find({
            preOrder: id
        }).populate('customer', 'nameTh nameEng taxID contact _id code address email').populate('sale', 'name phone_number code email').populate('preOrder')
        if(!quotations){
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotations: quotations || []
            })
        } else if (quotations.length === 0) {
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotations: quotations || []
            })
        }

        return res.send({
            success: true,
            message: `มีใบเสนอราคาทั้งหมด ${quotations.length}`,
            quotations: quotations
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}

// get a quotation
exports.getQuotation = async (req, res) => {
    const { id } = req.params
    try {
        const quotation = await Quotation.findById(id).populate('customer', 'nameTh nameEng taxID contact _id code address email').populate('sale', 'name phone_number code email').populate('preOrder')
        if(!quotation){
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotations: quotation || []
            })
        }

        return res.send({
            success: true,
            quotation: quotation,
            contact: quotation.customer.contact[quotation.customer.contact.length-1]
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}

// delete a quotation
exports.deleteQuotation = async (req, res) => {
    const { id } = req.params
    try {
        const quotation = await Quotation.findByIdAndDelete(id)
        if(!quotation){
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotations: quotation || []
            })
        }

        return res.send({
            success: true,
            message: 'ลบใบเสนอราคาสำเร็จ'
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}