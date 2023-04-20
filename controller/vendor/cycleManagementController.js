const cycleModel = require('../../model/vendor/cycleModel')
const jwt = require("jsonwebtoken");
const insertCycle = async (req, res) => {
  try {
    if (req.file?.path) {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      const { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);

      const cycle = new cycleModel({
        vendor:_id,
        image:req.file?.path,
        speed: req.body.inputData.speed,
        type: req.body.inputData.type,
        name: req.body.inputData.names,
        breaks: req.body.inputData.breake,
        tyreSize: req.body.inputData.tyresize,
        quantity: req.body.inputData.quantity,
        priceinclude: req.body.inputData.priceinclude,
        securityDeposit: req.body.inputData.securitydeposit,
        terms: req.body.inputData.terms,
        price: req.body.inputData.price,
      })
      const add = await cycle.save()
      if (add) {
        res.status(201).json({ message: 'Product Added' })
      } else {
        res.status(401).json({ message: 'Product Not Added' })
      }
    } else {
      res.status(401).json({ message: 'Select A Proper Image' })
    }
  } catch (error) {
    console.log(error.message);
  }
}

const cycleStatus_Update = async (req, res) => {
  const vendor = await cycleModel.find({ _id: req.params.id })
  if (vendor[0].status) {
    await cycleModel.updateOne({ _id: req.params.id }, { $set: { status: false } })
  } else {
    await cycleModel.updateOne({ _id: req.params.id }, { $set: { status: true } })
  }
  res.json('reach')
}






module.exports = {
  insertCycle,
  cycleStatus_Update

}