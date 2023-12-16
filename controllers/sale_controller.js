// models
const Sale = require('../models/members/sale_model.js')
const Product = require('../models/products/product_model.js')

// order
exports.createOrder = async (req,res) => {
    const { id } = req.params
    const { order, cut, lay } = req.body
    try {
        const product = await Product.findById(id)
        if(!product){
            return res.status(404).send({
                message: 'ไม่พบปะเภทสินค้านี้ในระบบ',
                product: product
            })
        }

        

    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

