const listing=require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken});
module.exports.index=async(req,res)=>{
    const  allListings=await listing.find({});
    res.render("./listings/index.ejs",{allListings});
}
module.exports.newForm=(req,res)=>{
    res.render("./listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!Listing){
        req.flash("error","Requested listing does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{Listing});
}
module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    let savedListing=await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing Created");
    res.redirect("/listings");
    
}
module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const Listing=await listing.findById(id);
    if(!Listing){
        req.flash("error","Requested listing does not exist");
        res.redirect("/listings");
    }
   let originalUrl=Listing.image.url;
   originalUrl=originalUrl.replace("/upload","/upload/h_300,w_250"); 
    res.render("./listings/edit.ejs",{Listing,originalUrl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let Listing=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    Listing.image={url,filename};
    await Listing.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}