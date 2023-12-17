// models
const Product = require('../models/products/product_model.js')

// calculate Raw-Material
exports.calRawMaterial = async (req,res) => {
    const {
        type, subType,
        gsm, width, long,
        order, cut, lay 
    } = req.body

    try {
        const product = await Product.findOne({
            type: type,
            subType: subType,
        })
        if(!product){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: product
            })
        }
        if(product && !product.option || product && product.option.length === 0){
            return res.status(404).send({
                message: 'สินค้านี้ยังไม่ได้เพิ่มรายละเอียด',
                product: product
            })
        }

        const match_option = product.option.filter(item=>
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
            paperType: `${product.type} ${product.subType}`,
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
                ประเภทกระดาษ : `${product.type} ${product.subType}`,
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
            message: 'คำนวณราคาสำเร็จ',
            success: true,
            result: calRawMaterial
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

