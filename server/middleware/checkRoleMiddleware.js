const jwt = require('jsonwebtoken')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if(!token) {
                return res.status(401).json({message: "Користувач не авторизований"})
            }
            const decode = jwt.verify(token, process.env.SECRET_JWT_KEY)
            if (decode.role !== role) {
                return res.status(403).json({message: "Немає доступу"})
            }
            req.user = decode
            next()
        } catch (e) {
            return res.status(401).json({message: "Користувач не авторизований"})
        }
    }
}

