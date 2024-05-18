const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')
const Quotation = require('../models/orders/quotation_model.js')
const Order = require('../models/orders/order_model.js')

const genCode = (curLength) => {
    const result = 
        (curLength>999) ? `${curLength}`
        : (curLength>99 && curLength<1000) ? `0${curLength}`
        : (curLength>9 && curLength<100) ? `00${curLength}`
        : `000${curLength}`
    return result
}

const customRound = (value) => {
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;
  
    if (decimalPart >= 0.1 && decimalPart <= 0.5) {
      return integerPart + 0.5;
    } else if (decimalPart > 0.5) {
      return Math.ceil(value);
    } else {
      return integerPart;
    }
}

// Sale ----------------------------------------

exports.addPreOrder = async (req, res) => {
    const {
        customer,
        name,
        brand,
        demensions,
        paper,
        front_remark,
        back_remark,
        colors_uv,
        colors_front_type,
        colors_front,
        colors_front_text,
        colors_back_type,
        colors_back,
        colors_back_text,
        front_pantone,
        back_pantone,
        floor_front,
        floor_back,
        flip_plate,
        coating,
        coating_back,
        hotStamp,
        emboss,
        dieCut,
        dieCutWindow,
        dieCutBlow,
        glue,
        glue2,
        glue_dot,
        chain,
        bag,
        note
    } = req.body

    const userName = req.user.name
    const userId = req.user.id
    const userCode = req.user.code
    
    try {
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
                },
                enable: true
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

        const gluess = (glue && glue.length > 0) 
            ? glue.map(g => {
                const saved_glue = {
                    long: customRound(g.long)
                }
                return saved_glue
            }) : null
        
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
                colors_uv: (colors_uv) ? colors_uv : false,
                front_remark: front_remark || '',
                back_remark: back_remark || '',
                front_type:(colors_front_type) ? colors_front_type : null,
                front: (colors_front) ? colors_front : 0,
                front_pantone: (front_pantone) && front_pantone,
                front_text:(colors_front_text && colors_front_text.length > 0) ? colors_front_text : null,
                floor_front: (floor_front) && floor_front,
                back_type:(colors_back_type) ? colors_back_type : null,
                back: (colors_back) ? colors_back : 0,
                back_pantone: (back_pantone) && back_pantone,
                back_text:(colors_back_text && colors_back_text.length > 0) ? colors_back_text : null,
                floor_back: (floor_back) && floor_back,
            },

            coating: (coating && coating.length!==0) ? coating : null,
            coating_back: (coating_back && coating_back.length!==0) ? coating_back : null,

            hotStamp: (hotStamp && hotStamp.length!==0) ? hotStamp : null,
            emboss: (emboss && emboss.length!==0) ? emboss : null,

            dieCut: (dieCut) ? {
                percent: (dieCut.percent) ? dieCut.percent : null,
                notice: (dieCut.notice) ? dieCut.notice : null,
                detail: (dieCut.detail) ? dieCut.detail : '-'
            } : null,

            dieCutWindow: (dieCutWindow) ? {
                percent: (dieCutWindow.percent) ? dieCutWindow.percent : null,
                notice: (dieCutWindow.notice) ? dieCutWindow.notice : null,
                detail: (dieCutWindow.detail) ? dieCutWindow.detail : null
            } : null,

            dieCutBlow: (dieCutBlow) ? true : false,

            glue: (glue && glue.length!==0) ? gluess : null,
            glue2: (glue2 && glue2.length!==0) ? glue2 : null,
            glue_dot: (glue_dot && glue_dot.length!==0) ? glue_dot : null,

            bag: (bag) ? true : false,
            chain: (chain && chain.length > 0) ? chain : null,

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
        return res.status(500).send({
            message: 'ไม่สามารถเพิ่ม preorder',
            err: err.message
        })
        console.log(err)
    }
}

exports.getPreOrders = async (req, res) => {
    try {
        const preOrders = await PreOrder.find().populate('customer', '_id nameTh nameEng taxID address contact email').populate('sale', '_id name phone_number email code')
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
        return res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.getPreOrder = async (req, res) => {
    const { id } = req.params
    try {
        const preOrder = await PreOrder.findById(id).populate('customer', '_id nameTh nameEng taxID address contact email').populate('sale', '_id name phone_number email code')
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
        return res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.updatePreOrder = async (req, res) => {
    const { id } = req.params
    const {
        name,
        brand,
        demensions,
        paper,
        front_remark,
        back_remark,
        colors_uv,
        colors_front_type,
        colors_front,
        colors_front_text,
        colors_back_type,
        colors_back,
        colors_back_text,
        front_pantone,
        back_pantone,
        floor_front,
        floor_back,
        flip_plate,
        coating,
        coating_back,
        hotStamp,
        emboss,
        dieCut,
        dieCutWindow,
        dieCutBlow,
        glue,
        glue2,
        glue_dot,
        chain,
        bag,
        note
    } = req.body

    try {
        let preOrder = await PreOrder.findByIdAndUpdate(id,
            {
                $set: {
                    name: (name) && name,
                    brand: (brand) && brand,
                    
                    demensions: (demensions) && {
                        width: demensions.width,
                        long: demensions.long,
                        height: demensions.height
                    },
                    
                    paper: {
                        type: (paper && paper.type) && paper.type,
                        subType: (paper && paper.subType) && paper.subType,
                        gsm: (paper && paper.gsm) && paper.gsm
                    },

                    flip_plate: (flip_plate) ? true : false,

                    colors: {
                        front_type:(colors_front_type) ? colors_front_type : null,
                        front_text:(colors_front_text && colors_front_text.length > 0) ? colors_front_text : null,
                        front: (colors_front) ? colors_front : 0,
                        front_pantone: (front_pantone) && front_pantone,
                        front_remark: (front_remark) && front_remark,
                        floor_front: (floor_front) && floor_front,
                        back_type:(colors_back_type) ? colors_back_type : null,
                        back_text:(colors_back_text && colors_back_text.length > 0) ? colors_back_text : null,
                        back_remark: (back_remark) && back_remark,
                        back: (colors_back) ? colors_back : 0,
                        back_pantone: (back_pantone) && back_pantone,
                        floor_back: (floor_back) && floor_back,
                        colors_uv: colors_uv
                    },

                    coating: (coating && coating.length!==0) ? coating : null,
                    coating_back: (coating_back && coating_back.length!==0) ? coating_back : null,

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
                        detail: (dieCutWindow.detail) ? dieCutWindow.detail : null
                    } : null,

                    dieCutBlow: dieCutBlow,

                    glue: (glue && glue.length!==0) ? glue : null,
                    glue2: (glue2 && glue2.length!==0) ? glue2 : null,
                    glue_dot: (glue_dot && glue_dot.length!==0) ? glue_dot : null,

                    chain: (chain && chain.length!==0) ? chain : null,
                    bag: (bag) ? true : false, 
            
                    note: (note) ? note : ''
                }
            }, { new:true }
        )
        if(!preOrder || preOrder.length===0){
            return res.send({
                message: 'ไม่พบรายการ',
                preOrders: preOrder
            })
        }

        return res.send({
            success: true,
            message: 'อัพเดทสำเร็จ',
            preOrder: preOrder
        })

    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
            message: err.message
        })
    }
}

exports.editEmbossSize = async (req, res) => {
    const { id } = req.params
    const { inWidth, inLong, mark } = req.body
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        let preOrder = await PreOrder.updateOne(
            {
                'emboss._id' : id
            },
            {
                $set: {
                    'emboss.$.inWidth' : inWidth,
                    'emboss.$.inLong' : inLong,
                    'emboss.$.mark' : mark
                }, 
            },
            {
                new : true
            }
        )
        if(!preOrder){
            return res.send({
                message: 'ไม่พบ pre-order นี้',
                preOrder: preOrder
            })
        }

        return res.send({
            message: 'update success!',
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: 'ERROR',
            err: err.message
        })
    }
}

exports.editStampSize = async (req, res) => {
    const { id } = req.params
    const { inWidth, inLong, mark } = req.body
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        const preOrder = await PreOrder.updateOne(
            {
                'hotStamp._id' : id
            },
            {
                $set: {
                    'hotStamp.$.inWidth' : inWidth,
                    'hotStamp.$.inLong' : inLong,
                    'hotStamp.$.mark' : mark
                }
            },
            {
                new : true
            }
        )
        if(!preOrder){
            return res.send({
                message: 'ไม่พบ pre-order นี้',
                preOrder: preOrder
            })
        }

        return res.send({
            message: 'update success!',
            success: true
        })

    }
    catch (err) {
        console.log(err)
        return res.send({
            message: 'ERROR',
            err: err.message
        })
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
        return res.status(500).send({
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
        return res.status(500).send({
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
        return res.status(500).send({
            message: err.message
        })
    }
}

// Production -----------------------------------

exports.addPreProduction = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    const userCode = req.user.code
    const userName = req.user.name
    const { width, long, cut, lay, plateSize, k, inWidth, inLong  } = req.body

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
                floor_back: (preOrder.colors && preOrder.colors.floor_back) ? preOrder.colors.floor_back : false,
                colors_uv: (preOrder.colors && preOrder.colors.colors_uv) ? preOrder.colors.colors_uv : false,
            } : null,
            print_2_Data : (plateSize && plateSize==="2") ? {
                colors : (preOrder.colors && preOrder.colors.front) ? [preOrder.colors.front, preOrder.colors.back] : [0, 0],
                lay : (lay) && lay,
                floor_front: (preOrder.colors && preOrder.colors.floor_front) ? preOrder.colors.floor_front : false,
                floor_back: (preOrder.colors && preOrder.colors.floor_back) ? preOrder.colors.floor_back : false,
                colors_uv: (preOrder.colors && preOrder.colors.colors_uv) ? preOrder.colors.colors_uv : false,
            } : null,
            plateData : {
                colors : (preOrder.colors && preOrder.colors.front_text?.length > 0) ? (preOrder.colors.front_text?.length || 0) + (preOrder.colors.back_text?.length || 0) : 0, // from pre-order
                size : (plateSize) && plateSize.toString(),
                flip_plate: preOrder.flip_plate,
            },
            coatingData : {
                methods: (preOrder.coating && preOrder.coating.length!==0) ? preOrder.coating : null,
                width: (width) && width, // from pre-order
                inWidth: (inWidth) && inWidth, // from pre-order
                inLong: (inLong) && inLong, // from pre-order
                long: (long) && long, // from pre-order
                cut: (cut) && cut,  // from pre-order
                lay: (lay) && lay // from pre-order
            },
            coatingBackData : {
                methods: (preOrder.coating_back && preOrder.coating_back.length!==0) ? preOrder.coating_back : null,
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
            diecutData : (preOrder.dieCut.percent) ? {
                plateSize: (preOrder.dieCut.percent) ? plateSize : null,
                lay: (preOrder.dieCut.percent) ? lay : null
            } : null,
            diecutWindowData : (preOrder.dieCutWindow.percent) ? {
                plateSize: (preOrder.dieCutWindow.percent) ? plateSize : null,
                lay: (preOrder.dieCutWindow.percent) ? lay : null
            } : null,
            diecutBlowData: (preOrder.dieCutBlow) ? true : false,
            glueData : {
                glue: (preOrder.glue && preOrder.glue.length!==0) ? preOrder.glue : null,
                glue2: (preOrder.glue2 && preOrder.glue2.length!==0) ? preOrder.glue2 : null,
                glue_dot: (preOrder.glue_dot && preOrder.glue_dot.length!==0) ? preOrder.glue_dot : null,
                bag: (preOrder.bag) ? true : false,
                chain: (preOrder.chain && preOrder.chain.length!==0) ? preOrder.chain : null
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
        return res.status(500).send({
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

        //console.log(preProductions[0].preOrder)
        

        return res.send({
            message: `มีรายการทั้งหมด ${preProductions.length} รายการ`,
            success: true,
            preProductions: preProductions
        })
    }
    catch (err) {
        return res.status(500).send({
            message: err.message
        })
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
        return res.status(500).send({
            message: err.message
        })
    }
}

exports.updatePreProduction = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    const userCode = req.user.code
    const userName = req.user.name
    
    const { width, long, cut, lay, plateSize, k, inWidth, inLong } = req.body

    try {
        let preOrder = await PreOrder.findById(id)
        if(!preOrder){
            return res.send({
                message: 'ไม่พบ pre-order นี้'
            })
        }
        let preProduction = await PreProduction.findOneAndUpdate({ preOrder: id }, {
            $set: {
                customer: preOrder.customer,
                sale: preOrder.sale,
                production: userId,
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
                    width: (width) && width, // from pre-order
                    inWidth: (inWidth) && inWidth, // from pre-order
                    inLong: (inLong) && inLong, // from pre-order
                    long: (long) && long, // from pre-order
                    cut: (cut) && cut,  // from pre-order
                    lay: (lay) && lay // from pre-order
                },
                coatingBackData : {
                    methods: (preOrder.coating_back && preOrder.coating_back.length!==0) ? preOrder.coating_back : null,
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
                diecutData : (preOrder.dieCut.percent) ? {
                    plateSize: (preOrder.dieCut.percent) ? plateSize : null,
                    lay: (preOrder.dieCut.percent) ? lay : null
                } : null,
                diecutWindowData : (preOrder.dieCutWindow.percent) ? {
                    plateSize: (preOrder.dieCutWindow.percent) ? plateSize : null,
                    lay: (preOrder.dieCutWindow.percent) ? lay : null
                } : null,
                glueData : {
                    glue: (preOrder.glue && preOrder.glue.length!==0) ? preOrder.glue : null,
                    glue2: (preOrder.glue2 && preOrder.glue2.length!==0) ? preOrder.glue2 : null,
                    glue_dot: (preOrder.glue_dot && preOrder.glue_dot.length!==0) ? preOrder.glue_dot : null,
                    bag: (preOrder.bag) ? true : false,
                    chain: (preOrder.chain && preOrder.chain.length!==0) ? preOrder.chain : null
                },
                down: (cut && lay) ? cut*lay : null
            },
            $push: {
                status: {
                    name: 'new',
                    text: 'อัพเดทข้อมูล',
                    sender: {
                        name: `${userName.first} ${userName.last}`,
                        _id: userId,
                        code: userCode
                    },
                    createAt: new Date()
                },
            }
        })
        if(!preProduction){
            return res.send({
                message: 'ไม่พบ pre-order นี้'
            })
        }
        
        return res.send({
            message: 'success!',
            preProduction: preProduction,
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({
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
        return res.status(500).send({
            message: err.message
        })
    }
}

// Order------------------------------------------

// create new quotation
exports.creatQuotation = async (req, res) => {
    const { preOrderId, calOrder, calDetails, choosedPrice } = req.body
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
            sale: preOrder.sale?._id || userId,
            preOrder: preOrder._id,
            price: calOrder,
            start: curDate.toISOString(),
            expire: expirationDate.toISOString(),
            status: {
                name: 'new',
                text: 'ใบเสนอราคาใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            },
            calDetails: (calDetails && calDetails.length > 0) ? calDetails : [],
            choosedPrice: choosedPrice,
            reject: {
                status: false,
                remark: null
            },
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

        await preOrder.save()

        let preProduction = await PreProduction.find({
            preOrder: preOrderId
        })

        preProduction.forEach( async item => {
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
        
        return res.send({
            message: 'สร้างใบเสนอราคาสำเร็จ',
            success: true,
            quotation: saved_quotation
        })
    }
    catch (err) {
        return res.send({
            message: 'ไม่สามารถสร้างใบเสนอราคาได้',
            err: err.message
        })
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

        quotations.forEach(item=>{
            item.status.reverse()
            item.status = item.status[0]
        })

        return res.send({
            success: true,
            message: `มีใบเสนอราคาทั้งหมด ${quotations.length}`,
            quotations: quotations
        })
    }
    catch (err) {
        return res.send({
            message: err.message
        })
    }
}

// get new quotations
exports.getNewQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find({ 
            approve: { $ne: true },
            'reject.status' : { $ne: true },
        })
        .populate('customer', 'nameTh nameEng taxID contact _id code address email')
        .populate('sale', 'name phone_number code')
        .populate('preOrder')
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

        quotations.forEach(item=>{
            item.status.reverse()
            item.status = item.status[0]
        })

        return res.send({
            success: true,
            message: `มีใบเสนอราคาทั้งหมด ${quotations.length}`,
            quotations: quotations
        })
    }
    catch (err) {
        return res.send({
            message: err.message
        })
    }
}

// get rejected quotations
exports.getRejectedQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find(
            {
                'reject.status' : true
            }
        )
        .populate('customer', 'nameTh nameEng taxID contact _id code address email')
        .populate('sale', 'name phone_number code')
        .populate('preOrder')
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

        quotations.forEach(item=>{
            item.status.reverse()
            item.status = item.status[0]
        })

        return res.send({
            success: true,
            message: `มีใบเสนอราคาที่ถูกยกเลิกทั้งหมด ${quotations.length}`,
            quotations: quotations
        })
    }
    catch (err) {
        return res.send({
            message: err.message
        })
    }
}

// get approved quotations
exports.getApprovedQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find(
            {
                approve : true
            }
        )
        .populate('customer', 'nameTh nameEng taxID contact _id code address email')
        .populate('sale', 'name phone_number code')
        .populate('preOrder')
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

        quotations.forEach(item=>{
            item.status.reverse()
            item.status = item.status[0]
        })

        return res.send({
            success: true,
            message: `มีใบเสนอราคาที่ยืนยันแล้วทั้งหมด ${quotations.length}`,
            quotations: quotations
        })
    }
    catch (err) {
        return res.send({
            message: err.message
        })
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
        return res.send({
            message: err.message
        })
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
        return res.send({
            message: err.message
        })
    }
}

// approve a quotation
exports.approveQuotation = async (req, res) => {
    const { id } = req.params
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        const quotation = await Quotation.findByIdAndUpdate(id, {
            $set: {
                approve: true,
                reject: {
                    status: false,
                    remark: ''
                }
            },
            $push: {
                status: {
                    name: 'approved',
                    text: 'สำเร็จ',
                    sender: {
                        name: `${userName.first} ${userName.last}`,
                        _id: userId,
                        code: userCode
                    },
                    createAt: new Date()
                },
            }
        }, { new : true })
        if(!quotation){
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotation: quotation
            })
        }

        return res.send({
            message: 'ใบเสนอราคาผ่านการยืนยันแล้ว',
            success: true,
            quotation: quotation,
            approve: quotation.approve
        })
    }
    catch (err) {
        return res.send({
            message: err.message
        })
    }
}

// reject a quotation
exports.rejectQuotation = async (req, res) => {
    const { id } = req.params
    const { remark } = req.body
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        const quotation = await Quotation.findByIdAndUpdate(id, {
            $set: {
                approve: false,
                reject: {
                    status: true,
                    remark: remark || ''
                }
            },
            $push: {
                status: {
                    name: 'rejected',
                    text: remark,
                    sender: {
                        name: `${userName.first} ${userName.last}`,
                        _id: userId,
                        code: userCode
                    },
                    createAt: new Date()
                },
            }
        }, { new : true })
        if(!quotation){
            return res.send({
                message: 'ไม่พบใบเสนอราคา',
                quotation: quotation
            })
        }

        return res.send({
            message: 'ใบเสนอราคานี้ถูกปฏิเสธ',
            success: true,
            quotation: quotation,
            approve: quotation.approve,
            reject: quotation.reject
        })
    }
    catch (err) {
        return res.send({
            message: err.message
        })
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
        return res.send({
            message: err.message
        })
    }
}

/* 
---------------------------------------
-----------------Order-----------------
---------------------------------------
*/ 

exports.createOrder = async (req, res) => {
    const { 
        quotation_id,
        price_type, 
        amount, 
        cal_data, 
        cost_detail, 
        cost_total, 
        cost_ppu, 
        price 
    } = req.body
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        const quotation = await Quotation.findById( quotation_id )
        const prev_order = await Order.find()
        const code = `${quotation.code}-${genCode( prev_order.length )}`
        const new_order = new Order({
            code: code,
            quotation: quotation,
            customer: quotation.customer,
            details: quotation.preOrder,
            data: {
                price_type: price_type,
                amount: amount,
                cal_data: cal_data,
                cost_detail: cost_detail,
                cost_total: cost_total,
                cost_ppu: cost_ppu,
                price: price,
            },
            status: {
                name: 'new',
                text: 'ออร์เดอร์ใหม่',
                sender: {
                    name: `${userName.first} ${userName.last}`,
                    _id: userId,
                    code: userCode
                },
                createAt: new Date()
            },
        })
        const saved_order = await new_order.save()
        if(!saved_order) {
            return res.send({
                message: 'บันทึกออร์เดอร์ใหม่ไม่สำเร็จ',
                order: saved_order
            })
        }

        return res.send({
            message: 'สร้างออร์เดอร์ใหม่สำเร็จ !!!',
            order: saved_order,
            success: true
        })
    }
    catch (error) {
        console.log(error)
        return res.send({
            message: error.message
        })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('quotation').populate('customer').populate('details')
        if(!orders || orders.length < 1) {
            return res.send({
                message: 'ไม่พบออร์เดอร์ในระบบ',
                orders: orders || []
            })
        }

        return res.send({
            message: `มีออร์เดอร์ทั้งหมด ${orders.length || 0} ออร์เดอร์`,
            orders: orders,
            success: true
        })
    }
    catch(error) {
        console.log(error)
        return res.send({
            message: error.message
        })
    }
}

exports.getOrder = async (req, res) => {
    const { id } = req.params
    try {
        const order = await Order.findById( id ).populate('quotation').populate('customer').populate('details')
        if(!order) {
            return res.send({
                message: 'ไม่พบออร์เดอร์ในระบบ',
                order: order || null
            })
        }

        return res.send({
            order: order,
            success: true
        })
    }
    catch(error) {
        console.log(error)
        return res.send({
            message: error.message
        })
    }
}

exports.editOrder = async (req, res) => {
    const { 
        price_type, 
        amount, 
        cal_data, 
        cost_detail, 
        cost_total, 
        cost_ppu, 
        price,
        status_name,
        status_text
    } = req.body
    const { id } = req.params
    const userId = req.user.id
    const userName = req.user.name
    const userCode = req.user.code
    try {
        const order = await Order.findByIdAndUpdate( id ,
            {
                $set: {
                    'data.price_type': price_type,
                    'data.amount': amount,
                    'data.cal_data': cal_data,
                    'data.cost_detail': cost_detail,
                    'data.cost_total': cost_total,
                    'data.cost_ppu': cost_ppu,
                    'data.price': price
                },
                $push: {
                    status: {
                        name: status_name,
                        text: status_text,
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
        if(!order) {
            return res.send({
                message: 'แก้ไขออร์เดอร์ไม่สำเร็จ',
                order: order
            })
        }

        return res.send({
            message: 'แก้ไขออร์เดอร์สำเร็จ !!!',
            order: order,
            success: true
        })
    }
    catch (error) {
        console.log(error)
        return res.send({
            message: error.message
        })
    }
}

exports.deleteOrder = async (req, res) => {
    const { id } = req.params
    try {
        const order = await Order.findByIdAndDelete( id )
        if(!order) {
            return res.send({
                message: 'ไม่พบออร์เดอร์ในระบบ',
                order: order || null
            })
        }

        return res.send({
            message: 'ลบออร์เดอร์สำเร็จ',
            success: true
        })
    }
    catch(error) {
        console.log(error)
        return res.send({
            message: error.message
        })
    }
}

exports.deleteOrders = async (req, res) => {
    try {
        const order = await Order.deleteMany( )
        if(!order) {
            return res.send({
                message: 'ไม่พบออร์เดอร์ในระบบ',
                order: order || null
            })
        }

        return res.send({
            message: 'ลบออร์เดอร์ทั้งหมดสำเร็จ',
            success: true
        })
    }
    catch(error) {
        console.log(error)
        return res.send({
            message: error.message
        })
    }
}