const User=require("../models/user");
module.exports.rendersignup=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
   try{
     let {username,email,password}=req.body;
    const newUser=new User({email,username});
   let regUser=await User.register(newUser,password);
   console.log(regUser);
   req.login(regUser,(err)=>{
    if(err){
        next(err);
    }
    req.flash("success","Welcome to Wanderlust");
    res.redirect("/listings");
   });
   
}catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
}
}
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
}