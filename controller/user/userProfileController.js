
const jwt = require("jsonwebtoken");

const user = require('../../model/user/userModel')

 const userProfile = async (req, res) => {
    try {
      const urlPattern = /^https?:\/\/\S+$/;
      if(urlPattern.test(req.body.image)){
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const { _id } = jwt.verify(token, process.env.USER_JWT_SECRET);

        const add =await user.findByIdAndUpdate (_id,{$set:{image:req.body.image,name:req.body.name }})

        if (add) {
         const userUpdatedData = await user.find({_id:_id})
         if(userUpdatedData){
           res.status(201).json({ message: 'User profile updated',userData:userUpdatedData })
         }
        } else {
          res.status(401).json({ message: ' User not Found' })
        }
      }else{
        if (req.file?.path) {
          const { authorization } = req.headers;
          const token = authorization.split(" ")[1];
          const { _id } = jwt.verify(token, process.env.USER_JWT_SECRET);

          const add =await user.findByIdAndUpdate (_id,{$set:{image:req.file?.path,name:req.body.name }})

          if (add) {
           const userUpdatedData = await user.find({_id:_id})
           if(userUpdatedData){
             res.status(201).json({ message: 'User profile updated',userData:userUpdatedData })
           }
          } else {
            res.status(401).json({ message: ' User not Found' })
          }
        } else {
          res.status(401).json({ message: 'Select A Proper Image' })
        }
      }







        
      } catch (error) {
        console.log(error.message);
      }
    
 }



 module.exports = {
    userProfile
}