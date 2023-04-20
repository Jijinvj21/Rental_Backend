const adminModel = require('../../model/admin/adminModel')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}


const adminLogin = async (req, res) => {
    const admin = await adminModel.findOne({ email: req.body.admin.email })

    if (admin?.email === req.body.admin.email) {
        if (admin?.password === req.body.admin.password) {
             const token = createToken(admin._id)
      res.status(201).json({
         token
      });
            
        } else {
            res.status(401).json('Check your credentials')
        }
    } else {
        res.status(401).json('Check your credentials')
    }
}
module.exports = {
    adminLogin
}
