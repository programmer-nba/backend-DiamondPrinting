// models
const RawMatt = require('../models/products/rawMatt_model.js')
const Plate = require('../models/products/plate_model.js')
const Print = require('../models/products/print_model.js')
const Coating = require('../models/products/coating_model.js')
const Emboss = require('../models/products/emboss_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')

exports.calAll = async (req, res) => {
    const { id } = req.params // _id of preProduction
    let datas = []
    let costs = {}
    try {

        const preProduction = await PreProduction.findById(id)
        console.log(preProduction)
        if(!preProduction || preProduction.length===0){
            return res.send({
                massage: 'ไม่พบรายการนี้ในระบบ'
            })
        }

        const {rawMattData, plateData, printData, coatingData} = preProduction

        if(rawMattData){
            const rawMatt_cost = await calRawMattCost(rawMattData)
            datas.push({rawMatt:rawMatt_cost.data})
            costs.rawMatt = rawMatt_cost.cost
        }
        
        if(plateData){
            const plate_cost = await calPlateCost(plateData)
            datas.push({plate:plate_cost.data})
            costs.plate = plate_cost.cost
        }
        
        if(printData){
            for (i in printData.colors) {
                const sendPrint = {
                    order: printData.order,
                    lay: printData.lay,
                    colors: printData.colors[i]
                }
                const print_cost = await calPrintCost(sendPrint)
                datas.push({[`print_${i}`]:print_cost.data})
                costs[`print${i}`] = print_cost.cost
            }
        }
        
        if(coatingData){
            const coating_cost = await calCoatingCost(coatingData)
            datas.push({coating:coating_cost.data})
            costs.coating = coating_cost.cost
        }

        console.log(costs)
        const costIncosts = Object.values(costs)
        const sumCost = costIncosts.reduce( (a, b)=> a + b )
        return res.send({
            datas: datas,
            costDetails: costs,
            sumCost: sumCost
        })
    }
    catch(err) {
        res.status(500).send({
            message: 'ไม่สามารถส่งการคำนวณได้',
            err: err.message
        })
        console.log(err)
    }
}

// calculate Raw-Material
const calRawMattCost = async (rawMattData) => {
    const {
        type, subType,
        gsm, width, long,
        order, cut, lay 
    } = rawMattData

    try {
        const rawMatt = await RawMatt.findOne({
            type: type,
            subType: subType,
        })
        if(!rawMatt){
            return 0
        }
        if(rawMatt && !rawMatt.option || rawMatt && rawMatt.option.length === 0){
            return 0
        }

        const match_option = rawMatt.option.filter(item=>
            item.gsm === gsm &&
            item.width === width &&
            item.long === long
        )
        if(match_option.length===0){
            return 0
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

        return {cost:calRawMaterial.paper.cost ,data:calRawMaterial}
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

// calculate Plate
const calPlateCost = async (plateData) => {
    if(!plateData){
        return {cost: 0, data: null}
    }
    const { size, colors } = plateData

    try {
        const plate = await Plate.findOne({
            size: size,
        })
        if(!plate){
            return {cost: 0, data: null}
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

        return {
            cost: calPlate.result,
            data: calPlate
        }
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

// calculate Print
const calPrintCost = async (printData) => {

    if(!printData){
        return {cost: 0, data: null}
    }

    const { 
        colors,
        order, lay
    } = printData

    try {
        const print = await Print.findOne({
            colors: parseInt(colors)
        })
        if(!print){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const order_lay = parseInt(order)/parseInt(lay)
        
        const option = print.option.filter(item=>item.round.end >= order_lay && item.round.start < order_lay)
        if(option.length!==1){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const cal_print = {
            order_lay: order_lay,
            round: option[0].round.join,
            price: (option[0].round.start >= 10001)
            ? option[0].price*order_lay : option[0].price
        }

        return {cost: cal_print.price, data: cal_print}
        
    }
    catch (err) {
        return {cost: 0, data: 'ไม่พบ'}
    }
}

// calculate Coating
const calCoatingCost = async (coatingData) => {
    if(!coatingData){
        return {cost: 0, data: null}
    }
    const { 
        method,
        width, long, cut,
        order, lay 
    } = coatingData

    try {
        const coating = await Coating.findOne({
            type: method.type
        })
        if(!coating){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const order_lay = Math.floor(parseInt(order)/parseInt(lay))
        const inWidth = width/cut
        const inLong = long/cut
        
        const option = coating.option.filter(item=>item.subType === method.subType)
        if(option.length!==1){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const coating_option = option[0]

        const coating_price = 
            (method.type==='spot-uv' && coating_option.avr*inWidth*inLong < 1.2) ? 1.2
            : (method.type==='dip-off') ? 5
            : coating_option.avr*inWidth*inLong
        const total_price = coating_price*(order/lay)

        const cal_coating = {
            inWidth: inWidth,
            inLong: inLong,
            order_lay: order_lay,
            avr: coating_option.avr,
            coating_price: parseFloat(coating_price.toFixed(2)),
            price: (total_price < coating_option.minPrice)
            ? coating_option.minPrice : parseFloat(total_price.toFixed(2))
        }

        return {cost: cal_coating.price, data: cal_coating}
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

/*--------------------------------------------------------------
-------------------------alone calculate------------------------
--------------------------------------------------------------*/
 
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

// calculate Print
exports.calPrint = async (req,res) => {
    const { 
        colors,
        order, lay 
    } = req.body

    try {
        const print = await Print.findOne({
            colors: parseInt(colors)
        })
        if(!print){
            return res.status(404).send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: print
            })
        }

        const order_lay = parseInt(order)/parseInt(lay)
        
        const option = print.option.filter(item=>item.round.end >= order_lay && item.round.start < order_lay)
        if(option.length!==1){
            return res.status(404).send({
                message: 'ไม่พบเรทราคาในช่วงเลเอาท์นี้',
                option: option
            })
        }

        const cal_print = {
            order_lay: order_lay,
            round: option[0].round.join,
            price: (option[0].round.start >= 10001)
            ? option[0].price*order_lay : option[0].price
        }

        return res.send({
            message: 'คำนวณ ราคาปรินท์ สำเร็จ',
            success: true,
            result: cal_print
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

// calculate Coating
exports.calCoating = async (req,res) => {
    const { 
        method,
        width, long, cut,
        order, lay 
    } = req.body

    try {
        const coating = await Coating.findOne({
            'method.type': method.type
        })
        if(!coating){
            return res.send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: coating
            })
        }

        const order_lay = Math.floor(parseInt(order)/parseInt(lay))
        const inWidth = width/cut
        const inLong = long/cut
        
        const option = coating.option.filter(item=>item.subType === method.subType)
        if(option.length!==1){
            return res.status(404).send({
                message: 'ไม่พบเรทราคาในช่วงเลเอาท์นี้',
                option: option
            })
        }

        const coating_option = option[0]

        const coating_price = 
            (method.type==='spot-uv' && coating_option.avr*inWidth*inLong < 1.2) ? 1.2
            : (method.type==='dip-off') ? 5
            : coating_option.avr*inWidth*inLong
        const total_price = coating_price*(order/lay)

        const cal_coating = {
            inWidth: inWidth,
            inLong: inLong,
            order_lay: order_lay,
            avr: coating_option.avr,
            coating_price: parseFloat(coating_price.toFixed(2)),
            price: (total_price < coating_option.minPrice)
            ? coating_option.minPrice : parseFloat(total_price.toFixed(2))
        }

        return res.send({
            message: 'คำนวณ ราคาเคลือบสำเร็จ',
            success: true,
            result: cal_coating
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err)
    }
}

// calculate Emboss
exports.calEmboss = async (req,res) => {
    const { 
        inWidth, inLong, plateSize,
        order, lay 
    } = req.body

    try {
        const emboss = await Emboss.find()
        if(!emboss){
            return res.send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: emboss
            })
        }

        const order_lay = Math.floor(parseInt(order)/parseInt(lay))
        
        const round_option = emboss.filter(item=>item.round.start < order_lay && item.round.end+1 > order_lay)
        if(round_option.length===0){
            return res.status(404).send({
                message: 'ไม่พบเรทราคาในช่วงเลเอาท์นี้',
                option: round_option
            })
        }

        const option = round_option[0].option.filter(item=>item.plateSize===plateSize)

        const emboss_option = option[0]

        const emboss_cost = Math.ceil((inWidth*inLong*26)*0.01)*100

        const emboss_price = lay*emboss_cost

        const pumpPrice = emboss_option.pumpPrice

        const total_price = emboss_price+pumpPrice

        const cal_emboss = {
            inWidth: inWidth,
            inLong: inLong,
            order_lay: order_lay,
            pumpPrice: pumpPrice,
            emboss_price: parseFloat(emboss_price.toFixed(2)),
            emboss_cost: emboss_cost,
            price: parseFloat(total_price.toFixed(2))
        }

        return res.send({
            message: 'คำนวณ ราคาปั้มนูน สำเร็จ',
            success: true,
            result: cal_emboss
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        console.log(err.message)
    }
}
