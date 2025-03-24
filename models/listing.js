const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const listSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true

}}
});
listSchema.post("findOneAndDelete",async(Listing)=>{
    if(Listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}});
}});
const listing=mongoose.model("listing",listSchema);
module.exports=listing;