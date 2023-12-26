const Glue = require('../models/products/glue_model.js')

exports.addGlue = async (req, res) => {
    const { avr } = req.body
    try {
        const glue = await Glue.find()
        const code = `glue-${glue.length}`

        const new_glue = new Glue({
            code: code,
            avr: avr
        })
        const saved_glue = await new_glue.save()
        if(!saved_glue){
            return res.send({
                message: 'ไม่สามารถเพิ่ม glue'
            })
        }

        return res.send({
            message: 'เพิ่ม glue สำเร็จ',
            glue: saved_glue,
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

exports.getGlues = async (req, res) => {
    try {
        const glue = await Glue.find()
        if(!glue){
            return res.send({
                message: 'ไม่สามารถเพิ่ม glue'
            })
        }

        return res.send({
            success: true,
            glue: glue
        })
    }
    catch (err) {
        res.send({
            message: err.message
        })
        console.log(err)
    }
}

exports.deleteGlue = async (req, res) => {
    const { id } = req.params
    try {
        const glue = await Glue.findByIdAndDelete(id)

        if(!glue){
            return res.send({
                message: 'ไม่สามารถเพิ่ม glue'
            })
        }

        return res.send({
            message: 'ลบ glue สำเร็จ',
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