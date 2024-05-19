const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
  async create(req, res) {
    try{
      let {name, price, brandId, typeId, info} = req.body
      const {img} = req.files
      let fileName = uuid.v4() + '.jpg'
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      const lastDevice = await Device.findOne({ order: [['id', 'DESC']] });
      let id = 1;
      if (lastDevice) {
          id = lastDevice.id + 1;
      }
      const device = await Device.create({id, name, price, brandId, typeId, img: fileName});

      if (info){
        info = JSON.parse(info)
        info.forEach(i => 
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: device.id
          })
        )
      }

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let {brandId, typeId, limit, page} = req.query
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit
    let device;
    if(!brandId && !typeId){
      device = await Device.findAndCountAll({limit, offset})
    }
    if(brandId && !typeId){
      device = await Device.findAndCountAll({where:{brandId}, limit, offset})
    }
    if(!brandId && typeId){
      device = await Device.findAndCountAll({where:{typeId}, limit, offset})
    }
    if(brandId && typeId){
      device = await Device.findAndCountAll({where:{brandId, typeId}, limit, offset})
    }
    return res.json(device)
  }

  async getOne(req, res) {
    const {id} = req.params
    const device = await Device.findOne(
      {
        where: {id},
        include: [{model: DeviceInfo, as: 'info'}]
      }
    )
    return res.json(device)
  }
}

module.exports = new DeviceController()