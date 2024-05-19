const { Brand } = require('../models/models')
const ApiError = require('../error/ApiError')

class BrandController {
  async create(req, res) {
    const {name} = req.body

    const lastBrand = await Brand.findOne({order: [['id', 'DESC']]});
    let id = 1;
    if (lastBrand) {
      id = lastBrand.id + 1;
    }

    const brand = await Brand.create({id, name})
    return res.json(brand)
  }

  async getAll(req, res) {
    const brands = await Brand.findAll()
    return res.json(brands)
  }
}

module.exports = new BrandController()