const {Type} = require('../models/model')

class TypeController {
    async create(req, res) {
        const {name} = req.body
        const brand = await Type.create({name})
        return res.json(brand)
    }
    async getAll(req, res) {
        const brand = await Type.findAll()
        return res.json(brand)

    }
}

module.exports = new TypeController()