const Diecut = require('../models/products/diecut_model.js')

// add new diecut
exports.addDiecut = async (req, res) => {
    const { start, end } = req.body
    try {
        const diecut = await Diecut.find()
        const code = `diecut-${diecut.length}`

        const new_diecut = new Diecut({
            code: code,
            round: {
                start: start,
                end: end,
                join: `${start.toLocaleString()}-${end.toLocaleString()}`,
            }
        })
        const saved_diecut = await new_diecut.save()
        if(!saved_diecut) {
            return res.send({
                message: 'ไม่สามารถบันทึกสินค้า',
                saved_type: saved_diecut
            })
        }

        return res.send({
            message: 'บันทึกสินค้าสำเร็จ',
            success: true,
            product: saved_diecut
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

// get all diecuts
exports.getDiecuts = async (req, res) => {
    try {
        const diecuts = await Diecut.find()
        if(!diecuts){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: diecuts
            })
        } else if (diecuts && diecuts.length===0) {
            return res.send({
                message: 'สินค้าในระบบมี 0 รายการ',
                products: diecuts || [],
                success: true
            })
        }

        return res.send({
            message: `มีสินค้าทั้งหมด ${diecuts.length} รายการ`,
            success: true,
            products: diecuts
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

// get a diecut
exports.getDiecut = async (req, res) => {
    const {id} =req.params
    try {
        const diecut = await Diecut.findById(id)
        if(!diecut){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: diecut
            })
        }

        return res.send({
            success: true,
            products: diecut
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

// edit a diecut
exports.editDiecut = async (req, res) => {
    const {id} =req.params
    const {start, end} = req.body
    try {
        const prev_diecut = await Diecut.findById(id)
        if(!prev_diecut){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: prev_diecut
            })
        }
        const diecut = await Diecut.findByIdAndUpdate(id,{
            $set: {
                round: {
                    start: (start && start!==null || start && start.trim()!=='') ? start : prev_diecut.round.start,
                    end: (end && end!==null || end && end.trim()!=='') ? end : prev_diecut.round.end,
                    join: (start && end) ? `${start.toLocaleString()}-${end.toLocaleString()}` : prev_diecut.round.join
                }
            }
        }, {new:true})

        return res.send({
            success: true,
            products: diecut
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

// delete a diecut
exports.deleteDiecut = async (req, res) => {
    const {id} =req.params
    try {
        const diecut = await Diecut.findByIdAndDelete(id)
        if(!diecut){
            return res.send({
                message: 'ไม่พบสินค้าในระบบ',
                products: diecut
            })
        }

        return res.send({
            success: true,
            message: 'ลบเรียบร้อย'
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

// add diecut option
exports.addDiecutOption = async (req, res) => {
    const { id } = req.params // diecut id
    const { pumpPrice, plateSize, blockPrice } = req.body

    try {
        const diecut = await Diecut.findByIdAndUpdate(id, {
            $push:{
                option: {
                    plateSize: plateSize,
                    pumpPrice: pumpPrice,
                    blockPrice: blockPrice
                }
            }
        },{new:true})
        if(!diecut) {
            return res.send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: diecut
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

// edit diecut option
exports.editDiecutOption = async (req, res) => {
    const { id, option } = req.params // option id
    const { pumpPrice, plateSize, blockPrice } = req.body

    try {
        let prev_diecut = await Diecut.findById(id)
        if(!prev_diecut) {
            return res.send({
                message: 'ไม่พบสินค้านี้ในระบบ',
            })
        }
        
        const index = prev_diecut.option.findIndex(item=>item._id.toString()===option.trim())
        prev_diecut.option[index].plateSize = plateSize
        prev_diecut.option[index].pumpPrice = pumpPrice
        prev_diecut.option[index].blockPrice = blockPrice
        
        const saved_diecut = await prev_diecut.save()
        if(!saved_diecut){
            return res.send({
                message: 'ไม่สามารถบันทึกได้',
                saved_diecut: saved_diecut
            })
        }

        return res.send({
            message: 'อัพเดทข้อมูลสินค้าสำเร็จ',
            success: true,
            product: saved_diecut
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

// delete diecut option
exports.deleteDiecutOption = async (req, res) => {
    const {id, option} = req.params
    try {
        const diecut = await Diecut.updateOne({
            _id: id
        },{
            $pull: {
                option: {
                    _id: option
                }
            }
        })
        if(!diecut){
            return res.send({
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