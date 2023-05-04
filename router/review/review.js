const express = require("express");
const review_router = express();

const reviewController = require("../../util/review");

review_router.post("/newReview", reviewController.addReview);
review_router.post("/getReviews", reviewController.getReviews);
review_router.post("/userBooked", reviewController.userBooked);
review_router.post("/getUserReview", reviewController.getUserReview);
review_router.post("/editReview", reviewController.editReview);
review_router.post("/blockReview", reviewController.blockReview);
review_router.post("/deleteReview", reviewController.deleteReview);
review_router.post("/getReviewOfUser", reviewController.getReviewOfUser);

module.exports = review_router;
