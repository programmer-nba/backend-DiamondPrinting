// models
const RawMatt = require('../models/products/rawMatt_model.js')
const Plate = require('../models/products/plate_model.js')

// calculate Raw-Material
exports.calRawMaterial = async (req,res) => {
    const {
        type, subType,
        gsm, width, long,
        order, cut, lay 
    } = req.body

    try {
        const rawMatt = await RawMatt.findOne({
            type: type,
            subType: subType,
        })
        if(!rawMatt){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: rawMatt
            })
        }
        if(rawMatt && !rawMatt.option || rawMatt && rawMatt.option.length === 0){
            return res.status(404).send({
                message: 'สินค้านี้ยังไม่ได้เพิ่มรายละเอียด',
                product: rawMatt
            })
        }

        const match_option = rawMatt.option.filter(item=>
            item.gsm === gsm &&
            item.width === width &&
            item.long === long
        )
        if(match_option.length===0){
            return res.status(404).send({
                message: 'ไม่พบตัวเลือกสินค้านี้ในระบบ',
                option: match_option
            })
        }

        const option = match_option[0]

        const psheet = option.psheet
        const avm_paper = 600 // ค่าเฉลี่ยกระดาษตั้งเครื่อง
        const m_paper = avm_paper/cut // กระดาษตั้งเครื่อง
        const sum_lay = cut*lay // เลรวม
        const papers = Math.ceil((((order/sum_lay)+m_paper)*0.01))*100 // จำนวนแผ่นกระดาษ
        const papers_cost = Math.ceil(((papers*psheet)*0.01))*100 // ทุนกระดาษ:งาน

        const calRawMaterial = {
            paperType: `${rawMatt.type} ${rawMatt.subType}`,
            option: option,
            order: {
                amount: order,
                cut: cut,
                lay: lay,
                sum_lay: sum_lay
            },
            setting: {
                avm_paper: avm_paper,
                m_paper: m_paper
            },
            paper: {
                cost: papers_cost,
                amount: papers
            },
            details: {
                ประเภทกระดาษ : `${rawMatt.type} ${rawMatt.subType}`,
                แกรม : option.gsm,
                กว้าง : option.width,
                ยาว : option.long,
                ออร์เดอร์ : order,
                ผ่ากระดาษ : cut,
                เล : lay,
                เลรวม : sum_lay,
                ทุนกระดาษ_งาน : papers_cost,
                จำนวนแผ่นกระดาษ : papers,
                pkg: option.pkg,
                psheet: option.psheet,
                กระดาษตั้งเครื่อง : m_paper,
                ค่าเฉลี่ยกระดาษตั้งเครื่อง : avm_paper,
                etc_1 : 3100,
                etc_2 : 500
            }

        }

        return res.send({
            message: 'คำนวณ RawMatt สำเร็จ',
            success: true,
            result: calRawMaterial
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

// calculate Plate
exports.calPlate = async (req,res) => {
    const { size, colors } = req.body

    try {
        const plate = await Plate.findOne({
            size: size,
        })
        if(!plate){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: plate
            })
        }

        const reqColors = parseInt(colors)
        const plate_price = plate.price*reqColors
        
        const calPlate = {
            size: plate.size || size,
            ppu: plate.price,
            colors: reqColors || colors,
            result: plate_price,
            details: {
                เพลทตัด: plate.size || size,
                ราคาต่อสี: plate.price,
                จำนวนสี: `${reqColors || colors} สี`,
                ราคารวม: plate_price
            }
        }

        return res.send({
            message: 'คำนวณ เพลท สำเร็จ',
            success: true,
            result: calPlate
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}
