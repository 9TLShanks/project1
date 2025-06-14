const listing=require("./models/listing");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to proceed");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}
module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review");
        return res.redirect(`/listings/${id}`);
    }
next();
};