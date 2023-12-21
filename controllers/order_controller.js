const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')

exports.addPreOrder = async (req, res) => {
    const {
        customer,
        order,
        paper,
        colors_front,
        colors_back,
        pantone,
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
                type: coating.type || null,
                subType: coating.subType || null,
                spotUv: coating.spotUv || null,
                dipOff: coating.dipOff || null
            },
            hotStamp: hotStamp || null,
            emboss: emboss || null,
            dieCut: dieCut || null,
            glue: {
                amount: glue.amount || null,
                width: glue.width || null,
                long: glue.long || null
            },
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