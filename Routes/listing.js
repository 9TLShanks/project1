const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/WrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));
//new route
router.get("/new",isLoggedIn,listingController.newForm);
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));
module.exports=router;