const jwt = require("jsonwebtoken");
const accessoriesModel = require("../../model/vendor/accessoriesModel");

const insertAccessories = async (req, res) => {
  try {
    if (req.file?.path) {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      const { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);

      const accessories = new accessoriesModel({
        vendor: _id,
        image: req.file?.path,
        name: req.body.inputData.names,
        size: req.body.inputData.size,
        quantity: req.body.inputData.quantity,
        price: req.body.inputData.price,
      });
      const add = await accessories.save();
      if (add) {
        res.status(201).json({ message: "Product Added" });
      } else {
        res.status(401).json({ message: "Product Not Added" });
      }
    } else {
      res.status(401).json({ message: "Select A Proper Image" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const accessoriesStatus_Update = async (req, res) => {
  const vendor = await accessoriesModel.find({ _id: req.params.id });
  if (vendor[0].status) {
    await accessoriesModel.updateOne(
      { _id: req.params.id },
      { $set: { status: false } }
    );
  } else {
    await accessoriesModel.updateOne(
      { _id: req.params.id },
      { $set: { status: true } }
    );
  }
  res.json("reach");
};

const editAccessories = async (req, res) => {
  try {
    const urlPattern = /^https?:\/\/\S+$/;
    if (req.file?.path) {
      try {
        const data = await accessoriesModel.findByIdAndUpdate(
          req.body.inputData.id,
          {
            $set: {
              image: req.file?.path,
              name: req.body.inputData.names,
              size: req.body.inputData.size,
              quantity: req.body.inputData.quantity,
              price: req.body.inputData.price,
            },
          }
        );
        if (data) {
          res.status(201).json({ message: "Accessories Edited" });
        } else {
          res.status(401).json({ message: "Accessories Not Edited" });
        }
      } catch (error) {
        console.log(error);
      }
    } else if (urlPattern.test(req.body.inputData.image)) {
      try {
        const data = await accessoriesModel.findByIdAndUpdate(
          req.body.inputData.id,
          {
            $set: {
              image: req.body.inputData.image,
              name: req.body.inputData.names,
              size: req.body.inputData.size,
              quantity: req.body.inputData.quantity,
              price: req.body.inputData.price,
            },
          }
        );
        if (data) {
          res.status(201).json({ message: "Accessories Edited" });
        } else {
          res.status(401).json({ message: "Accessories Not Edited" });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      res.status(401).json({ message: "Select A Proper Image" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  insertAccessories,
  accessoriesStatus_Update,
  editAccessories,
};
