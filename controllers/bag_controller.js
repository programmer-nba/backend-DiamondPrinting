const Bag = require('../models/products/bag_model.js')

exports.addBag = async (req, res) => {
    const { price } = req.body
    try {
        const bag = await Bag.find()
        const code = `bag-${bag.length+1}`

        const new_bag = new Bag({
            code: code,
            price: price || 0
        })
        await Bag.deleteMany()
        const saved_bag = await new_bag.save()
        if(!saved_bag){
            return res.send({
                message: 'ไม่สามารถเพิ่ม bag'
            })
        }

        return res.send({
            message: 'เพิ่ม bag สำเร็จ',
            data: saved_bag,
            success: true
        })

    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}

exports.getBags = async (req, res) => {
    try {
        const bag = await Bag.find()
        if(!bag){
            return res.send({
                message: 'ไม่สามารถเพิ่ม bag'
            })
        }

        return res.send({
            success: true,
            data: bag
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}

exports.deleteBag = async (req, res) => {
    const { id } = req.params
    try {
        const bag = await Bag.findByIdAndDelete(id)

        if(!bag){
            return res.send({
                message: 'ไม่สามารถลบ bag'
            })
        }

        return res.send({
            message: 'ลบ bag สำเร็จ',
            success: true
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}