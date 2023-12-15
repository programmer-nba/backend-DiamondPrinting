

exports.addProduct = async (req, res) => {
    const box = {
        name: 'กล่อง',
        material: [
            'ลูกฟูก',
            ''
        ]
    }
    try {

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send()
    }
}