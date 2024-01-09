const Customer = require('../models/customers/customer_model.js')

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

        const customersName = customers.map(customer=>customer.nameTh)
        const uniqueCustomersName = new Set(customersName)
        const customersTaxID = customers.map(customer=>customer.taxID)
        const uniqueCustomersTaxID = new Set(customersTaxID)
        const customersNameTax = customers.map(customer=>`${customer.taxID} ${customer.nameTh}`)
        const uniqueCustomersNameTax = new Set(customersNameTax)

        return res.send({
            message: `มีลูกค้าทั้งหมด ${customers.length}`,
            customersName: [...uniqueCustomersName],
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
    const { nameTh } = req.params
    try {
        const customer = await Customer.findOne({
            $or: [
                //{taxID: tax},
                {nameTh: nameTh},
                //{nameEng: nameEng},
                //{code: code}
            ]
        })
        if(!customer) {
            return res.send({
                message: 'ไม่พบข้อมลูลูกค้า',
                customer: customer
            })
        }

        return res.send({
            customer: customer
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
        const new_customer = new Customer({
            nameTh: (customer.nameTh) ? customer.nameTh : '-',
            nameEng: (customer.nameEng) ? customer.nameEng : '-',
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
    }
    catch(err){
        console.log(err)
        return res.send({
            message: 'ERROR',
            err: err.message
        })
    }
}