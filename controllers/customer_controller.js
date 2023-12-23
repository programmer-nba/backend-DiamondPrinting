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
            customersTaxID: [...uniqueCustomersTaxID],
            customersNameTax: [...uniqueCustomersNameTax]
        })
    }
    catch (err) {
        res.status(500).send({
            message: err.message
        })
        console.log(err)
    }
}