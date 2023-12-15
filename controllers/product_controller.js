const Product = require('../models/products/product_model.js')

// add new product type
exports.addProduct = async (req, res) => {
    const { type } = req.body
    try {
        const product = await Product.find()

        const code = `${product.length}`

        const new_product = new Product({
            code: code,
            type: type
        })
        const saved_product = await new_product.save()
        if(!saved_product) {
            return res.status(500).send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_product
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_product
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถเพิ่มสินค้าได้',
            err: err.message
        })
    }
}

// get all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()
        if(!products){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: products
            })
        } else if (products && products.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: products || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${products.length} รายการ`,
            success: true,
            products: products
        })
        
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({
            message: 'ไม่สามารถดูสินค้าทั้งหมดได้',
            err: err.message
        })
    }
}

// edit product option
exports.updateProduct = async (req, res) => {
    const { id } = req.params
    const { name, ppu, unit, title } = req.body

    try {
        const product = await Product.findByIdAndUpdate(id, {
            $push:{
                option: {
                    title: title,
                    name: name,
                    ppu: ppu,
                    unit: unit || 'หน่วย'
                },
            }
        },{new:true})
        if(!product) {
            return res.status(404).send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: product
        })

    }
    catch (err) {
        res.send({
            message: 'ไม่สามารถอัพเดทข้อมูลสินค้า',
            err: err.message
        })
        console.log(err.message)
    }
}

// delete option in product
exports.deleteOption = async (req, res) => {
    const {id, option} = req.params
    try {
        const product = await Product.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!product){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ'
            })
        }

        return res.send({
            message: 'ลบตัวเลือกสำเร็จ',
            success: true
        })
    }
    catch (err) {
        res.send({
            message: 'ไม่สามารถลบตัวเลือกของสินค้านี้',
            err: err.message
        })
        console.log(err.message)
    }
}