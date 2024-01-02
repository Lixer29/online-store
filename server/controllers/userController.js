const {User, Basket} = require('../models/model')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_JWT_KEY,
        {expiresIn: '24h'}
    )
}
class UserController {
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
           return next(ApiError.badRequest({message: "Некоректний емейл або пароль"}))
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)) {
            return next(ApiError.badRequest({message: "Неправельний формат емейлу"}))
        }

        const validation = await User.findOne({where: {email}})
        if (validation) {
           return next(ApiError.badRequest({message: "Такий емейл уже зареєстрований"}))
        }
        if(password.length < 6) {
            return next(ApiError.badRequest({message: "Пароль має бути більше 6 символів"}))
        }
        const hashedPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashedPassword})
        const basket = await Basket.create({userId: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }
    async login(req, res, next) {
        const {email, password} = req.body
        if (!email || !password) {
            return  next(ApiError.badRequest({message: "Некоректний емейл або пароль"}))
        }
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.badRequest({message: "Такого користувача не існує"}))
        }
        const compare = await bcrypt.compareSync(password, user.password)
        if (!compare) {
            return next(ApiError.badRequest({message: "Неправельний пароль"}))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})

    }
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
}

module.exports = new UserController()