const Customer = require('../models/customers/customer_model.js')

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
    const { nameTh, tax, code } = req.body
    try {
        const customer = await Customer.findOne({
            $or: [
                {taxID: tax},
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