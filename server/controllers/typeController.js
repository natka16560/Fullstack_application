const { Type } = require('../models/models')

class TypeController {
  async create(req, res) {
    const {name} = req.body

    const lastType = await Type.findOne({order: [['id', 'DESC']]});
    let id = 1;
    if (lastType) {
      id = lastType.id + 1;
    }

    const type = await Type.create({id, name})
    return res.json(type)
  }

  async getAll(req, res) {
    const types = await Type.findAll()
    return res.json(types)
  }
}

module.exports = new TypeController()