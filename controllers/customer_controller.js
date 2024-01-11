const Customer = require('../models/customers/customer_model.js')
const PreOrder = require('../models/orders/preOrder_model.js')
const PreProduction = require('../models/orders/preProduction_model.js')
const Quotation = require('../models/orders/quotation_model.js')

const genCode = (curLength) => {
    const result = 
        (curLength>999) ? `${curLength}`
        : (curLength>99 && curLength<1000) ? `0${curLength}`
        : (curLength>9 && curLength<100) ? `00${curLength}`
        : `000${curLength}`
    return result
}

exports.customersSearch = async (req, res) => {
    try {
        const customers = await Customer.find()
        if(!customers || customers.length === 0) {
            return res.send({
                message: 'ไม่พบลูกค้าในระบบ',
                customers: customers || []
            })
        }

        const customers_nameAndId = customers.map(item=>{
            return {
                name: item.nameTh,
                _id: item._id,
                taxID: item.taxID
            }
        })

        const customersName = customers.map(customer=>customer.nameTh)
        const uniqueCustomersName = new Set(customersName)
        const customersTaxID = customers.map(customer=>customer.taxID)
        const uniqueCustomersTaxID = new Set(customersTaxID)
        const customersNameTax = customers.map(customer=>`${customer.taxID} ${customer.nameTh}`)
        const uniqueCustomersNameTax = new Set(customersNameTax)

        return res.send({
            message: `มีลูกค้าทั้งหมด ${customers.length}`,
            customersName: customers_nameAndId
            //customersName: [...uniqueCustomersName],
            //customersTaxID: [...uniqueCustomersTaxID],
            //customersNameTax: [...uniqueCustomersNameTax]
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
        if(!customers) {
            return res.send({
                message: 'ไม่พบข้อมลูลูกค้า',
                customers: customers
            })
        }
        if(customers && customers.length===0) {
            return res.send({
                message: 'ยังไม่มีลูกค้าในระบบ',
                customers: customers || []
            })
        }

        return res.send({
            message: `มีลูกค้าทั้งหมด ${customers.length} รายการ`,
            customers: customers
        })
    }
    catch( err ) {
        res.status(500).send({
            message: err.message
        })
        console.log(err.message)
    }
}

exports.getCustomer = async (req, res) => {
    const { id } = req.params
    try {
        const customer = await Customer.findById(id)
        if(!customer) {
            return res.send({
                message: 'ไม่พบข้อมลูลูกค้า',
                customer: customer
            })
        }

        const show_customer = {
            code: customer.code,
            nameTh: customer.nameTh,
            nameEng: customer.nameEng,
            email: customer.email,
            address: {
                houseNo: customer.address.houseNo,
                province: customer.address.province,
                district: customer.address.district,
                subdistrict: customer.address.subdistrict,
                street: customer.address.street,
                postcode: customer.address.postcode
            },
            taxID: customer.taxID,
            contact: customer.contact[customer.contact.length-1]
        }

        return res.send({
            customer: show_customer
        })
    }
    catch( err ) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.createCustomer = async (req, res) => {
    const { customer } = req.body
    try {
        const allCustumers = await Customer.find()
        const existCustomer = await Customer.findOne({
            $or: [
                {name: customer.nameTh},
                {taxID: customer.taxID}
            ]
        })

        console.log(existCustomer)

        if (!existCustomer){
            const new_customer = new Customer({
                nameTh: (customer.nameTh) ? customer.nameTh : '-',
                nameEng: (customer.nameEng) ? customer.nameEng : null,
                email: (customer.email) ? customer.email : null,
                address: {
                    houseNo: (customer.address && customer.address.houseNo) ? customer.address.houseNo : '-',
                    province: (customer.address && customer.address.province) ? customer.address.province : '-',
                    district: (customer.address && customer.address.district) ? customer.address.district : '-',
                    subdistrict: (customer.address && customer.address.subdistrict) ? customer.address.subdistrict : '-',
                    street: (customer.address && customer.address.street) ? customer.address.street : '-',
                    postcode: (customer.address && customer.address.postcode) ? customer.address.postcode : '-'
                },
                taxID: (customer.taxID) ? customer.taxID : '-',
                code: genCode(allCustumers.length),
                contact: {
                    name: (customer.contact && customer.contact.name) ? customer.contact.name : '-',
                    tel: (customer.contact && customer.contact.tel) ? customer.contact.tel : '-',
                    createAt: new Date()
                }
            })
            const saved_customer = await new_customer.save()
            if(!saved_customer){
                return res.send({
                    message: 'can not saved new customer!',
                    customer: saved_customer
                })
            }
            return res.send({
                message: 'success! create new customer',
                success: true,
                customer: saved_customer
            })
        } else {
            const updated_customer = await Customer.findByIdAndUpdate(existCustomer._id,
                {
                    $set: {
                        nameTh: customer.nameTh,
                        nameEng: customer.nameEng,
                        email: customer.email,
                        address: {
                            houseNo: customer.address.houseNo,
                            province: customer.address.province,
                            district: customer.address.district,
                            subdistrict: customer.address.subdistrict,
                            street: customer.address.street,
                            postcode: customer.address.postcode
                        },
                        taxID: customer.taxID
                    },
                    $push: {
                        contact: {
                            name: customer.contact.name,
                            tel: customer.contact.tel,
                            createAt: new Date()
                        }
                    }
                }, {new:true}
            )
            if(!updated_customer) {
                return res.send({
                    message: 'ERROR! update customer',
                    customer: updated_customer
                })
            }
            return res.send({
                message: 'success! update customer',
                success: true,
                customer: updated_customer
            })
        }
    }
    catch(err){
        console.log(err)
        return res.send({
            message: 'ERROR',
            err: err.message
        })
    }
}

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params
    try {
        const customer = await Customer.findByIdAndDelete(id)
        if(!customer) {
            return res.send({
                message: 'ไม่พบข้อมลูลูกค้า',
                customer: customer
            })
        }
        const preOrder = await PreOrder.deleteMany({customer: id})
        if(!preOrder){
            return res.send({
                message: 'can not delete pre-orders of this customer',
                preOrder: preOrder
            }) 
        }

        const preProduction = await PreProduction.deleteMany({customer: id})
        if(!preProduction){
            return res.send({
                message: 'can not delete pre-productions of this customer',
                preProduction: preProduction
            }) 
        }

        return res.send({
            message: 'delete success!'
        })
    }
    catch( err ) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}

exports.updateCustomer = async (req, res) => {
    const { id } = req.params
    const { customer } = req.body
    try {
        const updated_customer = await Customer.findByIdAndUpdate(id,
            {
                $set: {
                    nameTh: customer.nameTh,
                    nameEng: customer.nameEng,
                    email: customer.email,
                    address: {
                        houseNo: customer.address.houseNo,
                        province: customer.address.province,
                        district: customer.address.district,
                        subdistrict: customer.address.subdistrict,
                        street: customer.address.street,
                        postcode: customer.address.postcode
                    },
                    taxID: customer.taxID
                },
                $push: {
                    contact: {
                        name: customer.contact.name,
                        tel: customer.contact.tel,
                        createAt: new Date()
                    }
                }
            }, { new: true }
        )
        if(!updated_customer) {
            return res.send({
                message: 'ไม่พบข้อมลูลูกค้า',
                customer: updated_customer
            })
        }

        return res.send({
            message: 'update success!',
            customer: updated_customer
        })
    }
    catch( err ) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}