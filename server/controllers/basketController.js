const {Basket, Device, BasketDevice} = require('../models/model')
const ApiError = require('../error/ApiError')


class BasketController {
    async add(req, res, next) {
        const {basketId} = req.body
        const {id} = req.params

        try {
            const basket = await Basket.findByPk(basketId)
            if(!basket) {
                return next(ApiError.badRequest({message: "Такої корзини неіснує"}))
            }

            const device = await Device.findByPk(id)

            if(!device) {
                return next(ApiError.badRequest({message: "Такого товару неіснує"}))
            }

            const candidate = await BasketDevice.findOne({
                where: {
                    basketId: basket.id,
                    deviceId: device.id
                }
            })

            if(candidate) {
                return next(ApiError.badRequest({message: "Такий товар уже є у вас в корзині"}))
            }

            await BasketDevice.create({basketId: basket.id, deviceId: device.id})
            return res.json({message: "Додано успішно"})
        } catch (e) {
            return res.status(500).json({message: "Помилка при додаванні до корзини"})
        }
    }
    async delete(req, res, next) {
        const {basketId} = req.body
        const {id} = req.params

        try {
            const basket = await Basket.findByPk(basketId)
            if(!basket) {
                return next(ApiError.badRequest({message: "Такої корзини неіснує"}))
            }

            const device = await Device.findByPk(id)

            if(!device) {
                return next(ApiError.badRequest({message: "Такого товару неіснує"}))
            }

            const basketDevice = await BasketDevice.findOne({
                where: {
                    basketId: basket.id,
                    deviceId: device.id
                }
            })

            if(!basketDevice) {
                return next(ApiError.badRequest({message: "Такого товару в корзині немає"}))
            }

            await basketDevice.destroy();
            return res.json({message: "Пост видалено успішно"})
        } catch (e) {
            return res.status(500).json({message: "Помилка при видаленні з корзини", error: e.message})
        }
    }
    async getAll(req, res, next) {
        const {basketId} = req.query

        try {
            const basket = await Basket.findByPk(basketId)
            if(!basket) {
                return next(ApiError.badRequest({message: "Такої корзини неіснує"}))
            }

            const basketDevices = await BasketDevice.findAll({
                where: {
                    basketId: basket.id
                }
            })
            if (basketDevices.length === 0) {
                return next(ApiError.badRequest({message: "Корзина пуста"}))
            }
            const deviceIds = basketDevices.map(device => device.deviceId);

            const devices = await Device.findAll({
                where: {
                    id: deviceIds
                }
            });
            return res.json(devices)
        } catch (e) {
            return res.status(500).json({message: "Помилка при отриманні всіх постів"})

        }
    }
    async getOne(req, res, next) {
        const {id} = req.params
        const {basketId} = req.query

        try {
            const basket = await Basket.findByPk(basketId)

            if(!basket) {
                return next(ApiError.badRequest({message: "Такої корзини неіснує"}))
            }

            const device = await Device.findByPk(id)

            if(!device) {
                return next(ApiError.badRequest({message: "Такого товару неіснує"}))
            }

            const basketDevice = await BasketDevice.findOne({
                where: {
                    basketId: basket.id,
                    deviceId: device.id
                }
            })

            if(!basketDevice) {
                return res.json(false)
            }

            return res.json(true)
        } catch (e) {
            return res.status(500).json({message: "Помилка при отриманні поста"})

        }
    }
}

module.exports = new BasketController()