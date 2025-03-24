const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/WrapAsync.js");
const listing=require("../models/listing.js");
const ExpressError=require("../utils/ExpressError.js");
const {validateReview,isLoggedIn,isAuthor}=require("../middleware.js");
const Review=require("../models/review.js");
const reviewController=require("../controllers/review.js");
//reviews
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));
//delete review route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));
module.exports=router;