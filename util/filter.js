const jwt = require("jsonwebtoken");
const userModel = require("../model/user/userModel");
const cycleModel = require("../model/vendor/cycleModel");
const vendorModel = require("../model/vendor/vendorModule");
const accessoriesModel = require("../model/vendor/accessoriesModel");
const CycleBookingModel = require("../model/user/CycleBookingModal");
const reviewModel = require("../model/review/reviewModel");
const { ObjectId } = require("mongodb");

const filter = async (req, res) => {
  let db;
  try {
    const dataSelect = req.body?.data;

    const fromDate = new Date(req.query.fromDate);
    const toDate = new Date(req.query.toDate);

    switch (dataSelect) {
      case "user":
        db = userModel;
        break;
      case "cycle":
        db = cycleModel;
        break;
      case "vendor":
        db = vendorModel;
        break;
      case "accessories":
        db = accessoriesModel;
        break;
      case "booking":
        db = CycleBookingModel;
        break;
      case "review":
        db = reviewModel;
        break;
      default:
        break;
    }
    let page = parseInt(req.query.page) - 1 || 0;
    let limit = parseInt(req.query.limit) || 5;
    let search = req.query.search || "";
    let sort = req.query.sort || "rating";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = {};
    if (req.query.order) {
      sortBy[sort[0]] = req.query.order === "desc" ? -1 : 1;
    } else {
      sortBy[sort[0]] = 1;
    }
    let user;
    if (dataSelect === "accessories") {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      if (req.query.tokenOf === "vendor") {
        let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
        user = await db
          .find({ vendor: _id, name: { $regex: search, $options: "i" } })
          .sort(sortBy)
          .skip(page * limit)
          .limit(limit);
      } else {
        res.status(401).json("server error");
      }
    } else {
      if (req.query.state) {
        user = await db
          .find({
            status: req.query.state,
            name: { $regex: search, $options: "i" },
            $and: [
              { bookedFromDate: { $ne: fromDate } },
              { bookedToDate: { $ne: toDate } },
            ],
          })
          .sort(sortBy)
          .skip(page * limit)
          .limit(limit);
      } else {
        if (dataSelect !== "booking" && dataSelect === "review") {
          user = await db
            .find({ name: { $regex: search, $options: "i" } })
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);
        } else {
          if (req.query.tokenOf === "vendor" && dataSelect !== "review") {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
            user = await CycleBookingModel.aggregate([
              {
                $match: {
                  vendor: new ObjectId(_id), // replace `id` with the actual vendor ID
                },
              },
              {
                $lookup: {
                  from: "cycles",
                  localField: "cycle",
                  foreignField: "_id",
                  as: "product",
                },
              },
              {
                $unwind: "$product",
              },
              {
                $match: {
                  "product.name": { $regex: search, $options: "i" },
                },
              },
              {
                $lookup: {
                  from: "accessories",
                  localField: "accessories",
                  foreignField: "_id",
                  as: "accessories",
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "userDetails",
                },
              },
              {
                $unwind: "$userDetails",
              },
              {
                $sort: sortBy,
              },
              {
                $skip: page * limit,
              },
              {
                $limit: limit,
              },
            ]);
          } else if (
            req.query.tokenOf === "user_order" &&
            dataSelect !== "review"
          ) {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            let { _id } = jwt.verify(token, process.env.USER_JWT_SECRET);
            user = await CycleBookingModel.find({ user: _id })
              .populate("user")
              .populate("vendor")
              .populate("cycle")
              .populate("accessories")
              .sort(sortBy)
              .skip(page * limit)
              .limit(limit);
          } else {
            if (dataSelect !== "review" && dataSelect === "booking") {
              user = await CycleBookingModel.aggregate([
                {
                  $lookup: {
                    from: "cycles",
                    localField: "cycle",
                    foreignField: "_id",
                    as: "product",
                  },
                },
                {
                  $unwind: "$product",
                },
                {
                  $match: {
                    "product.name": { $regex: search, $options: "i" },
                  },
                },
                {
                  $lookup: {
                    from: "accessories",
                    localField: "accessories",
                    foreignField: "_id",
                    as: "accessories",
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails",
                  },
                },
                {
                  $unwind: "$userDetails",
                },
                {
                  $sort: sortBy,
                },
                {
                  $skip: page * limit,
                },
                {
                  $limit: limit,
                },
              ]);
            }
          }
        }
      }
    }
    if (dataSelect === "review" && req.query.tokenOf === "vendor") {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);

      user = await reviewModel.aggregate([
        {
          $lookup: {
            from: "cycles",
            localField: "product",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $match: { "product.vendor": { $eq: new ObjectId(_id) } },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userDetails",
          },
        },
      ]);
    } else if (dataSelect === "review" && req.query.tokenOf === "admin") {
      user = await db
        .find({ name: { $regex: search, $options: "i" } })
        .populate("product")
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);
    }
    if (dataSelect === "cycle" && req.query.tokenOf === "vendor") {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
      user = await db
        .find({
          vendor: new ObjectId(_id),
          name: { $regex: search, $options: "i" },
        })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);
    }
    if (dataSelect === "user" && req.query.tokenOf === "admin") {
      user = await db
        .find({ name: { $regex: search, $options: "i" } })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);
    }

    if (dataSelect === "vendor" && req.query.tokenOf === "admin") {
      user = await db
        .find({ name: { $regex: search, $options: "i" } })
        .sort(sortBy)
        .skip(page * limit)
        .limit(limit);
    }

    let total;
    if (dataSelect === "accessories") {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      if (req.query.tokenOf === "vendor") {
        let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
        total = await db.countDocuments({
          vendor: _id,
          name: { $regex: search, $options: "i" },
        });
      } else {
        res.status(401).json(" Server error");
      }
    } else {
      if (req.query.state) {
        total = await db.countDocuments({
          status: req.query.state,
          name: { $regex: search, $options: "i" },
          $and: [
            { bookedFromDate: { $not: { $elemMatch: { $lte: toDate } } } },
            { bookedToDate: { $not: { $elemMatch: { $gte: fromDate } } } },
          ],
          createdAt: {
            $gte: fromDate,
            $lte: toDate,
          },
        });
      } else {
        if (dataSelect !== "booking") {
          total = await db.countDocuments({
            name: { $regex: search, $options: "i" },
          });
        } else {
          if (req.query.tokenOf === "vendor" && dataSelect === "booking") {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
            total = await CycleBookingModel.countDocuments({ vendor: _id });
          } else if (req.query.tokenOf === "user_order") {
            const { authorization } = req.headers;
            const token = authorization.split(" ")[1];
            let { _id } = jwt.verify(token, process.env.USER_JWT_SECRET);
            total = await CycleBookingModel.countDocuments({ user: _id });
          } else {
            total = await CycleBookingModel.countDocuments();
          }
        }
      }
    }
    if (req.query.tokenOf === "vendor" && dataSelect === "review") {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
      total = await reviewModel.countDocuments({ vendor: _id });
    }
    if (req.query.tokenOf === "vendor" && dataSelect === "cycle") {
      const { authorization } = req.headers;
      const token = authorization.split(" ")[1];
      let { _id } = jwt.verify(token, process.env.VENDOR_JWT_SECRET);
      total = await cycleModel.countDocuments({ vendor: _id });
    }
    if (req.query.tokenOf === "cycle" && dataSelect === "cycle") {
      total = await cycleModel.countDocuments();
    }
    const response = {
      error: false,
      total,
      page: page + 1,
      limit,
      user,
    };
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(401).json("server error");
  }
};

module.exports = {
  filter,
};
