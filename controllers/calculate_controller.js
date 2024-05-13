// models
const RawMatt = require('../models/products/rawMatt_model.js')
const Plate = require('../models/products/plate_model.js')
const Print_2 = require('../models/products/print_2_model.js')
const Print_4 = require('../models/products/print_4_model.js')
const Coating = require('../models/products/coating_model.js')
const Emboss = require('../models/products/emboss_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')
const HotStamp = require('../models/products/hotStamp_model.js')
const Diecut = require('../models/products/diecut_model.js')
const Glue = require('../models/products/glue_model.js')

exports.calAll = async (req, res) => {
    const { id } = req.params
    const {orders} = req.body
    let costs_list = []
    try {
        for (let order of orders) {
            let datas = []
            let costs = {}
            const preProduction = await PreProduction.findById(id).populate('preOrder')
            if(!preProduction || preProduction.length===0){
                return res.send({
                    massage: 'ไม่พบรายการนี้ในระบบ',
                    preProduction: preProduction || []
                })
            }
            const { 
                rawMattData, 
                plateData, 
                print_2_Data, 
                print_4_Data, 
                coatingData, 
                coatingBackData,
                embossData, 
                hotStampData, 
                diecutData, 
                glueData, 
                diecutWindowData, 
                diecutBlowData,
            } = preProduction

            if(rawMattData){
                const rawMatt_cost = await calRawMattCost(order,rawMattData)
                datas.push({rawMatt:rawMatt_cost.data})
                costs.rawMatt = rawMatt_cost.cost
            }
            
            if(plateData){
                const plate_cost = await calPlateCost(plateData)
                datas.push({plate:plate_cost.data})
                costs.plate = plate_cost.cost
            }
            
            if(print_2_Data && print_2_Data.colors.length!==0){
                let prints = []
                for (i in print_2_Data.colors) {
                    const sendPrint = {
                        lay: print_2_Data.lay,
                        colors: print_2_Data.colors[i],
                        floor: 
                            (i==='0' && print_2_Data.floor_front) ? 2
                            : (i==='0' && !print_2_Data.floor_front) ? 1
                            : (i==='1' && print_2_Data.floor_back) ? 2
                            : (i==='1' && !print_2_Data.floor_back) ? 1
                            : 1,
                        flip: (print_2_Data.flip),
                        uv: (print_2_Data.colors_uv) ? 1.5 : 1
                    }
                    const print_2_cost = await calPrint_2_Cost(order,sendPrint)
                    prints.push(print_2_cost.cost)
                    datas.push({[`print_2_${i}`]:print_2_cost.data})
                }
                datas.push({print_2_Ffloor:print_2_Data.floor_front})
                datas.push({print_2_Bfloor:print_2_Data.floor_back})
                const print = (prints.length > 0) ? prints.reduce((a,b)=>a+b) : 0
                costs.print = Math.ceil(print)
            }

            if(print_4_Data && print_4_Data.colors.length!==0){
                let prints = []
                for (i in print_4_Data.colors) {
                    const sendPrint = {
                        lay: print_4_Data.lay,
                        colors: print_4_Data.colors[i],
                        floor: 
                            (i==='0' && print_4_Data.floor_front) ? 2
                            : (i==='0' && !print_4_Data.floor_front) ? 1
                            : (i==='1' && print_4_Data.floor_back) ? 2
                            : (i==='1' && !print_4_Data.floor_back) ? 1
                            : 1,
                        flip: (print_4_Data.flip),
                        uv: (print_4_Data.colors_uv) ? 1.5 : 1
                    }
                    const print_4_cost = await calPrint_4_Cost(order,sendPrint)
                    prints.push(print_4_cost.cost)
                    datas.push({[`print_4_${i}`]:print_4_cost.data})
                }
                datas.push({print_4_Ffloor:print_4_Data.floor_front})
                datas.push({print_4_Bfloor:print_4_Data.floor_back})
                const print = (prints.length > 0) ? prints.reduce((a,b)=>a+b) : 0
                costs.print = Math.ceil(print)
            }

            if(diecutData.plateSize){
                const diecut_cost = await calDiecutCost(order, diecutData)
                datas.push({diecut:diecut_cost.data})
                costs.diecut_block = diecut_cost.data.blockPrice
                costs.diecut_pump = diecut_cost.data.pumpPrice
            }

            if(diecutWindowData.plateSize){
                const window_cost = await calDiecutWindowCost(order, diecutWindowData)
                datas.push({diecut_window:window_cost.data})
                costs.diecut_window_block = window_cost.data.blockPrice
                costs.diecut_window_pump = window_cost.data.pumpPrice
            }

            if(diecutBlowData){
                const blow_cost = (order*0.05 < 500) ? 500 : order*0.05
                datas.push({diecut_blow: {
                    avr: 0.05,
                    cal: `${order}x0.05`,
                    total: blow_cost
                }})
                costs.diecut_blow = blow_cost
            }
            
            if(coatingData && coatingData.methods && coatingData.methods.length!==0){
                for (m in coatingData.methods){
                    const sendCoating = {
                        method: coatingData.methods[m].method,
                        width: coatingData.width,
                        inWidth: coatingData.inWidth,
                        long: coatingData.long,
                        inLong: coatingData.inLong,
                        cut: coatingData.cut,
                        lay: coatingData.lay
                    }
                    const coating_cost = await calCoatingCost(order, sendCoating)
                    datas.push({[`coating_${m}`]:coating_cost.data})
                    costs[`coating_${coatingData.methods[m].method.type} ${coatingData.methods[m].method.subType}`] = coating_cost.cost
                }
            }

            if(coatingBackData && coatingBackData.methods && coatingBackData.methods.length!==0){
                for (m in coatingBackData.methods){
                    const sendCoating = {
                        method: coatingBackData.methods[m].method,
                        width: coatingBackData.width,
                        inWidth: coatingBackData.inWidth,
                        long: coatingBackData.long,
                        inLong: coatingBackData.inLong,
                        cut: coatingBackData.cut,
                        lay: coatingBackData.lay
                    }
                    const coating_cost = await calCoatingCost(order, sendCoating)
                    datas.push({[`coatingBack_${m}`]:coating_cost.data})
                    costs[`coatingBack_${coatingBackData.methods[m].method.type} ${coatingBackData.methods[m].method.subType}`] = coating_cost.cost
                }
            }

            if(embossData && embossData.demensions && embossData.demensions.length!==0){
                let emboss_blocks = []
                let emboss_pumps = []
                for (em in embossData.demensions){
                    const sendEmboss = {
                        inWidth: embossData.demensions[em].inWidth,
                        inLong: embossData.demensions[em].inLong,
                        plateSize: embossData.plateSize,
                        mark: embossData.demensions[em].mark,
                        lay: embossData.lay
                    }
                    const emboss_cost = await calEmbossCost(order, sendEmboss)
                    datas.push({[`emboss_${em}`]:emboss_cost.data})
                    emboss_pumps.push(emboss_cost.data.pumpPrice)
                    emboss_blocks.push(emboss_cost.data.emboss_price)
                }
                const sum_emboss_blocks = (emboss_blocks.length > 0) ? emboss_blocks.reduce((a,b)=>a+b) : 0
                const emboss_pump = emboss_pumps[0] || 0
                costs.emboss_pump = emboss_pump
                costs.emboss_block = sum_emboss_blocks
            }

            if(hotStampData && hotStampData.block && hotStampData.block.length!==0){
                let blocks_k = []
                let costs_k = []
                for (i in hotStampData.block){
                    const sendStamp = {
                        block: {
                            inWidth: hotStampData.block[i].inWidth,
                            inLong: hotStampData.block[i].inLong,
                            lay: hotStampData.lay, 
                        },
                        stamp: {
                            stamp_color: hotStampData.block[i].color,
                            k: hotStampData.k
                        }
                    }
                    const stamp_cost = await calHotStampCost(order, sendStamp)
                    datas.push({[`stamp_${i}`]:stamp_cost.data})
                    blocks_k.push(stamp_cost.data.total_block_cost)
                    costs_k.push(stamp_cost.data.total_stamp_color_cost)
                } 
                const block_k = (blocks_k.length > 0) ? blocks_k.reduce((a,b)=>a+b) : 0
                const cost_k = (costs_k.length > 0) ? costs_k.reduce((a,b)=>a+b) : 0
                costs.block_k = block_k
                costs.cost_k = cost_k
            }

            if(glueData){
                if(glueData.glue && glueData.glue.length!==0){
                    let glues = []
                    for (g in glueData.glue) {
                        const glue_cost = await calGlueCost(order, glueData.glue[g].long)
                        datas.push({[`glue_${g}`]:glue_cost.data})
                        glues.push(glue_cost.cost)
                    }
                    const glue = (glues.length > 0) ? glues.reduce((a,b) => a + b) : 0
                    costs.glue1d = glue
                }
                
                if(glueData.glue2 && glueData.glue2.length!==0){
                    for (g in glueData.glue2) {
                        const glu2Data = {
                            width: glueData.glue2[g].width,
                            long: glueData.glue2[g].long,
                            price: glueData.glue2[g].price
                        }
                        const glue2_cost = await calGlue2Cost(order, glu2Data)
                        datas.push({[`glue2_${g}`]:glue2_cost.data})
                        costs[`glue2_${g}`] = glue2_cost.cost
                    }
                }
                
                if(glueData.glue_dot && glueData.glue_dot.length!==0){
                    const glueDot_cost = await calGlueDotCost(order, glueData.glue_dot.length)
                    datas.push({[`glueDot`]:glueDot_cost.data})
                    costs[`glueDot`] = glueDot_cost.cost
                }

                if(glueData.chain && glueData.chain.length!==0){
                    for (g in glueData.chain) {
                        const chainData = {
                            width: glueData.chain[g].width,
                            long: glueData.chain[g].long,
                            price: glueData.chain[g].price
                        }
                        const chain_cost = await calChainCost(order, chainData)
                        datas.push({[`chain_${g}`]:chain_cost.data})
                        costs[`chain_${g}`] = chain_cost.cost
                    }
                }

                if(glueData.bag){
                    const bag_cost = {
                        data: {
                            order: order,
                            ppu: 2.5
                        },
                        cost: 2.5 * order
                    }
                    datas.push({bag:bag_cost.data})
                    costs.bag = bag_cost.cost
                }
                
            }

            const costIncosts = Object.values(costs)
            const sumCost = costIncosts.reduce( (a, b)=> a + b )
            costs_list.push({
                order: order,
                datas: datas,
                costDetails: costs,
                sumCost: sumCost,
                costperOrder: parseFloat((sumCost/order).toFixed(2)),
                normal: {
                    percent: `24.00%`,
                    total_price: parseFloat((((24.00*sumCost)/100)+sumCost).toFixed(2)),
                    unit_price:  parseFloat(((((24.00*sumCost)/100)+sumCost)/order).toFixed(2))
                },
                special: {
                    percent: `21.50%`,
                    total_price:  parseFloat((((21.50*sumCost)/100)+sumCost).toFixed(2)),
                    unit_price:  parseFloat(((((21.50*sumCost)/100)+sumCost)/order).toFixed(2))
                },
                insite: {
                    percent: `17.00%`,
                    total_price:  parseFloat((((17.00*sumCost)/100)+sumCost).toFixed(2)),
                    unit_price:  parseFloat(((((17.00*sumCost)/100)+sumCost)/order).toFixed(2))
                }
            })
        }

        return res.send({
            costs_list: costs_list
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
const calRawMattCost = async (order, rawMattData) => {
    const {
        type, subType,
        gsm, width, long,
        cut, lay 
    } = rawMattData

    try {
        const rawMatt = await RawMatt.findOne({
            type: type,
            subType: subType,
        })
        if(!rawMatt){
            return {data: 'ไม่พบ rawMatt', cost: 0}
        }
        if(rawMatt && !rawMatt.option || rawMatt && rawMatt.option.length === 0){
            return {data: 'ไม่พบ rawMatt option', cost: 0}
        }

        const match_option = rawMatt.option.filter(item=>
            item.gsm === gsm &&
            item.width === width &&
            item.long === long
        )
        if(match_option.length===0){
            return {data: 'ไม่พบ macth_option', cost: 0}
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
            },
            cal: {
                papers_amount_formula: `roundup((((${order}/(${cut}*${lay}))+(${avm_paper}/${cut}))*0.01))*100`,
                papers_amount_result: papers,
                papers_cost_formula: `roundup(((${papers}*${option.psheet})*0.01))*100`,
                papers_cost_result: papers_cost
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
    const { size, colors, flip_plate } = plateData

    try {
        const plate = await Plate.findOne({
            size: size,
        })
        if(!plate){
            return {cost: 0, data: null}
        }

        const reqColors = parseInt(colors)
        const fliped = (flip_plate) ? 2 : 1
        const plate_price = (plate.price*reqColors)/fliped
        const calPlate = {
            size: plate.size || size,
            ppu: plate.price,
            flip_plate: flip_plate,
            colors: reqColors || colors,
            result: plate_price,
            details: {
                เพลทตัด: plate.size || size,
                ราคาต่อสี: plate.price/fliped,
                จำนวนสี: `${reqColors || colors} สี`,
                ราคารวม: plate_price
            },
            cal: {
                flip_plate: flip_plate,
                plate_price_formula : `${plate.price}*${reqColors}/${fliped}`,
                plate_price_result : plate_price
            }
        }

        return {
            cost: calPlate.result,
            data: calPlate
        }
        
    }
    catch (err) {
        console.log(err.message)
        return {
            cost: 0,
            data: null
        }
    }
}

// calculate Print2
const calPrint_2_Cost = async (order, print_2_Data) => {

    if(!print_2_Data){
        return {cost: 0, data: null}
    }

    const { 
        colors,
        lay,
        floor,
        uv
    } = print_2_Data
    console.log(print_2_Data)
    try {
        const print = await Print_2.findOne({
            colors: parseInt(colors)
        })
        if(!print){
            return {cost: 0, data: null}
        }

        const order_lay = Math.ceil(parseInt(order)/parseInt(lay))
        
        const option = print.option.filter(item=>item.round.end >= order_lay && item.round.start < order_lay)
        if(option.length!==1){
            return {cost: 0, data: null}
        }

        const cal_print = {
            order_lay: order_lay,
            round: option[0].round.join,
            price: (option[0].round.start >= 10001)
            ? option[0].price*order_lay*floor*uv
            : option[0].price*floor*uv,
            colors: colors,
            details: {
                'ออร์เดอร์ต่อเล' : order_lay,
                'รอบการพิมพ์' : option[0].round.join,
                'เทพื้น' : (floor>1) ? 'เทพื้น' : null,
                'สีUV': (uv > 1) ? 'สีUV' : null,
                'ค่าพิมพ์' : (option[0].round.start >= 10001)
                ? option[0].price*order_lay*floor*uv : option[0].price*floor*uv
            },
            cal: {
                print_price_formula: (option[0].round.start >= 10001) ? `${option[0].price}*${order_lay}*${floor}*${uv}` : `${option[0].price}*${floor}*${uv}`,
                print_price_result: (option[0].round.start >= 10001) ? option[0].price*order_lay*floor*uv : option[0].price*floor*uv
            }
        }
        return {cost: cal_print.price, data: cal_print}
        
    }
    catch (err) {
        return {cost: 0, data: null}
    }
}

// calculate Print4
const calPrint_4_Cost = async (order, print_4_Data) => {

    if(!print_4_Data){
        return {cost: 0, data: null}
    }

    const { 
        colors,
        lay,
        floor,
        uv
    } = print_4_Data

    try {
        const print = await Print_4.findOne({
            colors: parseInt(colors)
        })
        if(!print){
            return {cost: 0, data: null}
        }

        const order_lay = Math.ceil(parseInt(order)/parseInt(lay))
        
        const option = print.option.filter(item=>item.round.end >= order_lay && item.round.start < order_lay)
        if(option.length!==1){
            return {cost: 0, data: null}
        }

        const cal_print = {
            order_lay: order_lay,
            round: option[0].round.join,
            price: (option[0].round.start >= 10001)
            ? option[0].price*order_lay*floor*uv : option[0].price*floor*uv,
            colors: colors,
            details: {
                'ออร์เดอร์ต่อเล' : order_lay,
                'รอบการพิมพ์' : option[0].round.join,
                'เทพื้น' : (floor>1) ? 'เทพื้น' : null,
                'สีUV': (uv > 1) ? 'สีUV' : null,
                'ค่าพิมพ์' : (option[0].round.start >= 10001)
                ? option[0].price*order_lay*floor*uv: option[0].price*floor*uv
            },
            cal: {
                print_price_formula: (option[0].round.start >= 10001) ? `${option[0].price}*${order_lay}*${floor}*${uv}` : `${option[0].price}*${floor}*${uv}`,
                print_price_result: (option[0].round.start >= 10001) ? option[0].price*order_lay*floor*uv : option[0].price*floor*uv
            }
        }
        return {cost: cal_print.price, data: cal_print}
        
    }
    catch (err) {
        return {cost: 0, data: null}
    }
}

// calculate Coating
const calCoatingCost = async (order, coatingData) => {
    if(!coatingData){
        return {cost: 0, data: null}
    }
    const { 
        method,
        lay,
        inWidth, inLong
    } = coatingData
    
    try {

        const coating = await Coating.findOne({
            type: method.type
        })
        if(!coating){
            return {cost: 0, data: 'ไม่พบ'}
        }
        
        const order_lay = Math.ceil(parseInt(order)/parseInt(lay))
        //const inWidth = inWidth
        //const inLong = inLong

        const option = 
            (method.type!=='spot-uv' || method.type!=='dip-off') ? coating.option.filter(item=>item.subType === method.subType)
            : coating.option.filter(item=>item.subType.trim() === "")

        if(option.length!==1){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const coating_option = option[0]

        const coating_price = 
        (method.type==='spot-uv' && coating_option.avr*parseFloat(inWidth)*parseFloat(inLong) < 1.2) ? 1.2
        : (method.type==='dip-off') ? 5
        : coating_option.avr*parseFloat(inWidth)*parseFloat(inLong)
        const total_price = Math.ceil(parseFloat(coating_price.toFixed(2))*order_lay)

        const cal_coating = {
            type: `${method.type} ${method.subType}`,
            inWidth: inWidth,
            inLong: inLong,
            order_lay: order_lay,
            avr: coating_option.avr,
            coating_price: parseFloat(coating_price.toFixed(2)),
            cost: (total_price < coating_option.minPrice)
            ? coating_option.minPrice : parseFloat(total_price.toFixed(2)),
            details: {
                'ขนาดใบพิมพ์กว้าง' : `${inWidth} นิ้ว`,
                'ขนาดใบพิมพ์ยาว' : `${inLong} นิ้ว`,
                'ออร์เดอร์ต่อเล' : order_lay,
                'ประเภทเคลือบ' : `${method.type} ${method.subType} (${parseFloat(coating_price.toFixed(2))})`,
                'ค่าเคลือบ' : (total_price < coating_option.minPrice) ? coating_option.minPrice : parseFloat(total_price.toFixed(2))
            },
            cal: {
                coating_price_unit_formula: (method.type==='spot-uv' && coating_option.avr*parseFloat(inWidth)*parseFloat(inLong) < 1.2) ? `1.2` : (method.type==='dip-off') ? 5 : `${coating_option.avr}*(${inWidth}*${inLong})`,
                coating_price_formula: (total_price < coating_option.minPrice) ? `${coating_option.minPrice}` : `${parseFloat(coating_price.toFixed(2))}*${order_lay}`,
                coating_price_result: (total_price < coating_option.minPrice) ? coating_option.minPrice : parseFloat(total_price.toFixed(2))
            }
        }

        return {cost: cal_coating.cost, data: cal_coating}
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

// calculate Emboss
const calEmbossCost = async (order, embossData) => {
    const { 
        inWidth, inLong, plateSize, mark,
        lay 
    } = embossData

    try {
        const emboss = await Emboss.find()
        if(!emboss){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const order_lay = Math.ceil(parseInt(order)/parseInt(lay))
        
        const round_option = emboss.filter(item=>item.round.start < order_lay && item.round.end+1 > order_lay)
        if(round_option.length===0){
            return {cost: 0, data: 'ไม่พบ'}
        }

        const option = round_option[0].option.filter(item=>item.plateSize===plateSize)

        const emboss_option = option[0]
    
        const emboss_cost = Math.ceil((inWidth*inLong*26)*0.01)*100

        const emboss_price = lay*emboss_cost
        
        const pumpPrice = (round_option[0].round.start > 5000 && round_option[0].round.end < 100000000) ? emboss_option.pumpPrice*order_lay : emboss_option.pumpPrice
        
        const total_price = emboss_price+pumpPrice

        const cal_emboss = {
            type: 'emboss',
            mark: mark,
            inWidth: inWidth,
            inLong: inLong,
            order_lay: order_lay,
            pumpPrice: Math.ceil(pumpPrice),
            emboss_price: parseFloat(emboss_price.toFixed(2)),
            emboss_cost: emboss_cost,
            price: parseFloat(total_price.toFixed(2)),
            details: {
                'ตำแหน่งปั้มนูน' : mark,
                'ขนาด' : `กว้าง ${inWidth} x ยาว ${inLong} นิ้ว`,
                'ออร์เดอร์ต่อเล' : order_lay,
                'ค่าปั้ม' : Math.ceil(pumpPrice),
                'ทุนเคลือบต่อเล' : emboss_cost,
                'ทุนเคลือบตามเล' : emboss_price
            },
            cal: {
                pumpPrice_formula: (round_option[0].round.start > 5000 && round_option[0].round.end < 100000000) ? `${emboss_option.pumpPrice}*${order_lay}` : `${emboss_option.pumpPrice}`,
                pumpPrice_result: (round_option[0].round.start > 5000 && round_option[0].round.end < 100000000) ? emboss_option.pumpPrice*order_lay : emboss_option.pumpPrice,
                block_cost_formula: `(roundup((${inWidth}*${inLong}*26)*0.01)*100)*${lay}`,
                block_cost_result: lay*emboss_cost
            }
        }

        return {cost: cal_emboss.price, data: cal_emboss}
        
    }
    catch (err) {
        console.log(err.message)
        return {cost: 0, data: null}
    }
}

// calculate Hot stamp
const calHotStampCost = async (order, hotStampData) => {
    const { 
        block, stamp
    } = hotStampData

    try {
        const hotStamp = await HotStamp.findOne({
            stamp_color: stamp.stamp_color
        })
        if(!hotStamp){
            return {data: null, cost: 0}
        }

        const block_cost = Math.ceil((block.inWidth*block.inLong*13)*0.01)*100
        const total_block_cost = block_cost*block.lay
        const stamp_color_cost = (((block.inWidth*block.inLong*hotStamp.avr)+0.1)*stamp.k < 0.15) ? 0.15 : ((block.inWidth*block.inLong*hotStamp.avr)+0.1)*stamp.k
        const total_stamp_color_cost = parseFloat(stamp_color_cost.toFixed(2))*order

        const cal_hotStamp = {
            lay: block.lay,
            order: order,
            inWidth: block.inWidth,
            inLong: block.inLong,
            block_avr: 13,
            block_cost: block_cost,
            total_block_cost: total_block_cost,
            
            kPoint: stamp.k,
            stamp_color: hotStamp.stamp_color,
            stamp_avr: hotStamp.avr,
            other_avr: 0.1,
            stamp_color_cost: (parseFloat(stamp_color_cost.toFixed(2)) < 0.15) ? 0.15 : parseFloat(stamp_color_cost.toFixed(2)),
            total_stamp_color_cost: total_stamp_color_cost,
            totol_cost: (total_stamp_color_cost + total_block_cost !== NaN) ? parseFloat((total_stamp_color_cost + total_block_cost).toFixed(2)) : 0,

            details: {
                'ขนาด' : `กว้าง ${block.inWidth} x ยาว ${block.inLong} นิ้ว`,
                'บล๊อคเค' : total_block_cost,
                'สีปั้ม' : hotStamp.stamp_color,
                'ค่าเฉลี่ย' : hotStamp.avr,
                'ค่าปั้มเคต่อชิ้น' : (parseFloat(stamp_color_cost.toFixed(2)) < 0.15) ? 0.15 : parseFloat(stamp_color_cost.toFixed(2)),
            },
            cal: {
                block_cost_formula: `(roundup((${block.inWidth}*${block.inLong}*13)*0.01)*100)*${block.lay}`,
                block_cost_result: total_block_cost,
                k_cost_formula: `((${block.inWidth}*${block.inLong}*${hotStamp.avr})+0.1)*${stamp.k}`,
                k_cost_result: (parseFloat(stamp_color_cost.toFixed(2)) < 0.15) ? 0.15 : parseFloat(stamp_color_cost.toFixed(2)),
            }
        }

        return {data: cal_hotStamp, cost: cal_hotStamp.totol_cost}
        
    }
    catch (err) {
        console.log(err.message)
        return {data: 'ไม่พบ', cost: 0}
    }
}

// calculate Diecut Window
const calDiecutWindowCost = async (order, diecutWindowData) => {
    const { 
        plateSize,
        lay
    } = diecutWindowData

    try {
        const diecuts = await Diecut.find()
        if(!diecuts){
            return {data: 'ไม่พบไดคัต', cost: 0}
        }
        
        const order_lay = Math.ceil(parseInt(order)/parseInt(lay))
        
        const diecut = diecuts.filter(item=>item.round.start < order_lay && item.round.end+1 > order_lay)
        
        const option = diecut[0].option.filter(option=>option.plateSize===plateSize)
        if(!option || option.length===0){
            return {data: 'ไม่พบตัวเลือกไดคัต', cost: 0}
        }
        const diecut_option = option[0]
        const diecut_pumpPrice = diecut_option.pumpPrice

        const cal_diecut = {
            order: order,
            lay: lay,
            order_lay: order_lay,
            blockSize: diecut_option.plateSize || plateSize,
            blockPrice: diecut_option.blockPrice,
            diecutRound : diecut[0].round.join,
            pumpPrice: (diecut[0].round.start>5000) ? Math.ceil(diecut_pumpPrice*order_lay) : Math.ceil(diecut_pumpPrice),
            totalPrice: (diecut[0].round.start>5000) ? Math.ceil(diecut_pumpPrice*order_lay + diecut_option.blockPrice) : Math.ceil(diecut_pumpPrice + diecut_option.blockPrice),
            details: {
                'ขนาดบล๊อค' : diecut_option.plateSize || plateSize,
                'รอบไดคัท' : diecut[0].round.join,
                'ค่าบล๊อค' : diecut_option.blockPrice,
                'ค่าปั้มไดคัท' : (diecut[0].round.start>5000) ? Math.ceil(diecut_pumpPrice*order_lay) : Math.ceil(diecut_pumpPrice)
            },
            cal: {
                pumpPrice_formula: (diecut[0].round.start>5000) ? `roundup(${diecut_pumpPrice}*${order_lay})` : `roundup(${diecut_pumpPrice})`,
            }
        }

        return {data: cal_diecut, cost: cal_diecut.totalPrice}
        
    }
    catch (err) {
        console.log(err)
        return {data: 'ไม่พบ', cost: 0}
    }
}

// calculate Diecut
const calDiecutCost = async (order, diecutData) => {
    const { 
        plateSize,
        lay
    } = diecutData

    try {
        const diecuts = await Diecut.find()
        if(!diecuts){
            return {data: 'ไม่พบไดคัต', cost: 0}
        }

        const order_lay = Math.ceil(parseInt(order)/parseInt(lay))
        
        const diecut = diecuts.filter(item=>item.round.start < order_lay && item.round.end+1 > order_lay)
        
        const option = diecut[0].option.filter(option=>option.plateSize===plateSize)
        if(!option || option.length===0){
            return {data: 'ไม่พบตัวเลือกไดคัต', cost: 0}
        }
        const diecut_option = option[0]
        const diecut_pumpPrice = diecut_option.pumpPrice

        const cal_diecut = {
            order: order,
            lay: lay,
            order_lay: order_lay,
            blockSize: diecut_option.plateSize || plateSize,
            blockPrice: diecut_option.blockPrice,
            diecutRound : diecut[0].round.join,
            pumpPrice: (diecut[0].round.start>5000) ? Math.ceil(diecut_pumpPrice*order_lay) : Math.ceil(diecut_pumpPrice),
            totalPrice: (diecut[0].round.start>5000) ? Math.ceil(diecut_pumpPrice*order_lay + diecut_option.blockPrice) : Math.ceil(diecut_pumpPrice + diecut_option.blockPrice),
            details: {
                'ขนาดบล๊อค' : diecut_option.plateSize || plateSize,
                'รอบไดคัท' : diecut[0].round.join,
                'ค่าบล๊อค' : diecut_option.blockPrice,
                'ค่าปั้มไดคัท' : (diecut[0].round.start>5000) ? Math.ceil(diecut_pumpPrice*order_lay) : Math.ceil(diecut_pumpPrice)
            },
            cal: {
                pumpPrice_formula: (diecut[0].round.start>5000) ? `roundup(${diecut_pumpPrice}*${order_lay})` : `roundup(${diecut_pumpPrice})`,
            }
        }

        return {data: cal_diecut, cost: cal_diecut.totalPrice}
        
    }
    catch (err) {
        console.log(err)
        return {data: 'ไม่พบ', cost: 0}
    }
}

const calGlueCost = async (order, long) => {
    try {
        const gluebase = await Glue.find()
        if(!gluebase){
            return {data: 'ไม่พบ', cost: 0}
        }

        const avr = gluebase[0].glueAvr
        const glue_cost = avr*long
        const gluedata = {
            avr: avr,
            cost: glue_cost,
            total: glue_cost*order,
            details: {
                'ค่าเฉลี่ยต่อชิ้น' : avr,
                'จำนวนออร์เดอร์' : order,
                'ปะกาวหน้าเดียวรวม' : glue_cost*order
            },
            cal: {
                glue_cost_formula: `${glue_cost}*${order}`,
                glue_cost_result: glue_cost*order
            }
        }

        return {data: gluedata, cost: gluedata.total}
    }
    catch (err) {
        return {data: 'ไม่พบ', cost: 0}
    }
}

const calGlue2Cost = async (order, glue2Data) => {
    const { width, long, price } = glue2Data
    try {

        const glue2data = {
            order: order,
            width: width,
            long: long,
            ppu: price,
            cal: {
                unit_result_formula: `${width} * ${long} * ${price}`,
                unit_result: parseFloat((width*long*price).toFixed(2)),
                order_result_formula: `${width} * ${long} * ${price} * ${order}`,
                order_result: parseFloat((width*long*price*order).toFixed(2))
            }
        }

        return {data: glue2data, cost: glue2data.cal.order_result}
    }
    catch (err) {
        return {data: 'ไม่พบ', cost: 0}
    }
}

const calGlueDotCost = async (order, amount) => {
    try {
        const gluebase = await Glue.find()
        if(!gluebase){
            return {data: 'ไม่พบ', cost: 0}
        }

        const dot = gluebase[0].glueDot
        const glue_cost = dot*amount
        const gluedata = {
            dotPrice: dot,
            cost: glue_cost,
            total: glue_cost*order,
            details: {
                'จุดละ' : dot,
                'จำนวนออร์เดอร์' : order,
                'รวม' : glue_cost*order
            },
            cal: {
                gluDot_formula: `${glue_cost}*${order}`,
                gluDot_result: glue_cost*order
            }
        }

        return {data: gluedata, cost: gluedata.total}
    }
    catch (err) {
        return {data: 'ไม่พบ', cost: 0}
    }
}

const calChainCost = async (order, chainData) => {
    const { width, long, price } = chainData
    try {

        const chainData = {
            order: order,
            width: width,
            long: long,
            ppu: price,
            cal: {
                unit_result_formula: `${width} * ${long} * ${price}`,
                unit_result: parseFloat((width*long*price).toFixed(2)),
                order_result_formula: `${width} * ${long} * ${price} * ${order}`,
                order_result: parseFloat((width*long*price*order).toFixed(2))
            }
        }

        return {data: chainData, cost: chainData.cal.order_result}
    }
    catch (err) {
        return {data: 'ไม่พบ', cost: 0}
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
exports.calPrint2 = async (req,res) => {
    const { 
        colors,
        order, lay 
    } = req.body

    try {
        const print2 = await Print_2.findOne({
            colors: parseInt(colors)
        })
        if(!print2){
            return res.send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: print2
            })
        }
        console.log(print2)
        const order_lay = parseInt(order)/parseInt(lay)
        
        const option = print2.option.filter(item=>item.round.end >= order_lay && item.round.start < order_lay)
        console.log(option)
        if(option.length!==1){
            return res.send({
                message: 'ไม่พบเรทราคาในช่วงเลเอาท์นี้',
                option: option
            })
        }

        const cal_print2 = {
            order_lay: order_lay,
            round: option[0].round.join,
            price: (option[0].round.start >= 10001)
            ? option[0].price*order_lay : option[0].price
        }

        return res.send({
            message: 'คำนวณ ราคาปรินท์ สำเร็จ',
            success: true,
            result: cal_print2
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        conbsole.log(err.message)
    }
}

// calculate Print
exports.calPrint4 = async (req,res) => {
    const { 
        colors,
        order, lay 
    } = req.body

    try {
        const print4 = await Print_4.findOne({
            colors: parseInt(colors)
        })
        if(!print4){
            return res.send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: print4
            })
        }

        const order_lay = parseInt(order)/parseInt(lay)
        
        const option = print4.option.filter(item=>item.round.end >= order_lay && item.round.start < order_lay)
        if(option.length!==1){
            return res.status(404).send({
                message: 'ไม่พบเรทราคาในช่วงเลเอาท์นี้',
                option: option
            })
        }

        const cal_print4 = {
            order_lay: order_lay,
            round: option[0].round.join,
            price: (option[0].round.start >= 10001)
            ? option[0].price*order_lay : option[0].price
        }

        return res.send({
            message: 'คำนวณ ราคาปรินท์ สำเร็จ',
            success: true,
            result: cal_print4
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

// calculate Hot stamp
exports.calHotStamp = async (req,res) => {
    const { 
        block, stamp, order
    } = req.body

    try {
        const hotStamp = await HotStamp.findOne({
            stamp_color: stamp.stamp_color
        })
        if(!hotStamp){
            return res.send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: hotStamp
            })
        }

        const block_cost = Math.round((block.inWidth*block.inLong*13)*0.01)*100
        const total_block_cost = block_cost*block.lay
        const stamp_color_cost = ((block.inWidth*block.inLong*hotStamp.avr)+0.1)*stamp.k
        const total_stamp_color_cost = stamp_color_cost*order

        const cal_hotStamp = {
            lay: block.lay,
            order: order,
            inWidth: block.inWidth,
            inLong: block.inLong,
            block_avr: 13,
            block_cost: block_cost,
            total_block_cost: total_block_cost,
            
            kPoint: stamp.k,
            stamp_color: hotStamp.stamp_color,
            stamp_avr: hotStamp.avr,
            other_avr: 0.1,
            stamp_color_cost: stamp_color_cost,
            total_stamp_color_cost: total_stamp_color_cost,
            totol_cost: total_stamp_color_cost + total_block_cost
        }

        return res.send({
            message: 'คำนวณ hot stamp สำเร็จ',
            success: true,
            result: cal_hotStamp
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        console.log(err.message)
    }
}

// calculate Diecut
exports.calDiecut = async (req,res) => {
    const { 
        plateSize,
        order, lay 
    } = req.body

    try {
        const diecuts = await Diecut.find()
        if(!diecuts){
            return res.send({
                message: 'ไม่พบประเภทสินค้านี้ในระบบ',
                product: diecuts
            })
        }

        const order_lay = Math.floor(parseInt(order)/parseInt(lay))
        
        const diecut = diecuts.filter(item=>item.round.start < order_lay && item.round.end+1 > order_lay)
        const option = diecut[0].option.filter(option=>option.plateSize===plateSize)
        if(!option || option.length===0){
            return res.send({
                message: 'ไม่พบตัวเลือกขนาดเพลตนี้'
            })
        }
        const diecut_option = option[0]
        const diecut_pumpPrice = diecut_option.pumpPrice

        const cal_diecut = {
            order: order,
            lay: lay,
            order_lay: order_lay,
            blockSize: diecut_option.plateSize || plateSize,
            blockPrice: diecut_option.blockPrice,
            diecutRound : diecut[0].round.join,
            //pumpPrice: (diecut[0].round.start > 5000) ?  :diecut_pumpPrice,
            totalPrice: diecut_pumpPrice + diecut_option.blockPrice
        }

        return res.send({
            message: 'คำนวณ ราคา diecut สำเร็จ',
            success: true,
            result: cal_diecut
        })
        
    }
    catch (err) {
        res.send(`ERR : ${err.message}`)
        console.log(err)
    }
}
