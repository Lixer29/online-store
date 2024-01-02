const { Brand } = require('../models/model');
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const candidate = await Brand.findOne({ where: { name } });

            if (candidate) {
                return next(ApiError.badRequest('Такий бренд уже існує'));
            }

            const brand = await Brand.create({ name });
            return res.json(brand);
        } catch (error) {
            return next(ApiError.internal('Помилка при створенні бренду', error));
        }
    }

    async getAll(req, res, next) {
        try {
            const brands = await Brand.findAll();
            return res.json(brands);
        } catch (error) {
            return next(ApiError.internal('Помилка при отриманні всіх брендів', error));
        }
    }
}

module.exports = new BrandController();
