const Profit = require('../models/profit/profitModel.js')

exports.createProfit = async (req, res) => {
    const { title, percent } = req.body
    try {
        const profit = new Profit({
            title,
            percent
        })
        await profit.save()
        return res.send({message: 'บันทึกข้อมูลสำเร็จ'})
    }
    catch(err) {
        console.log(err)
        return res.status(500).send({message: 'เกิดข้อผิดพลาด'})
    }
}

exports.getProfits = async (req, res) => {
    try {
        const profits = await Profit.find()
        return res.send({data: profits})
    }
    catch(err) {
        console.log(err)
        return res.status(500).send({message: 'เกิดข้อผิดพลาด'})
    }
}

exports.updateProfit = async (req, res) => {
    const { title, percent } = req.body
    try {
        const profit = await Profit.findOneAndUpdate({title: title}, {title, percent}, {new: true})
        return res.send({message: 'บันทึกข้อมูลสำเร็จ', data: profit})
    }
    catch(err) {
        console.log(err)
        return res.status(500).send({message: 'เกิดข้อผิดพลาด'})
    }
}