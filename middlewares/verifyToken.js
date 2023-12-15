const jwt = require('jsonwebtoken')

const secretKey = process.env.SECRET_KEY

const verifyToken = (req, res, next) => {
    const token = req.header('token')
    if (!token) {
        return res.status(401).send({ 
            message: 'ไม่พบ token ที่แนบมากับ headers' 
        })
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send({ 
                message: 'token นี้ไม่ถูกต้อง' 
            })
        }
        req.user = user
        next()
    })
}

module.exports = verifyToken