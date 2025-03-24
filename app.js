if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
    }
    const express=require("express");
    const app=express();
    const mongoose=require("mongoose");
    const listing=require("./models/listing.js");
    const path=require("path");
    const methodOverride=require("method-override");
    const ejsMate=require("ejs-mate");
    const session=require("express-session");
    const Mongostore=require("connect-mongo");
    const flash=require("connect-flash");
    const ExpressError=require("./utils/ExpressError.js");
    const passport=require("passport");
    const LocalStratergy=require("passport-local");
    const User=require("./models/user.js");
    const listingRouter=require("./Routes/listing.js");
    const reviewRouter=require("./Routes/review.js");
    const userRouter=require("./Routes/user.js");
    const dbUrl=process.env.ATLASDB_URL;
    main().then(()=>{
        console.log("connected");
    }).catch((err)=>{
        console.log(err);
    });
    async function main() {
    await mongoose.connect(dbUrl);
    }
    
    app.set("view engine","ejs");
    app.set("views",path.join(__dirname,"views"));
    app.use(express.urlencoded({extended:true}));
    
    app.use(methodOverride("_method"));
    app.engine("ejs",ejsMate);
    app.use(express.static(path.join(__dirname,"/public")));
    const store=Mongostore.create({
        mongoUrl:dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    });
    store.on("error",()=>{
        console.log("Error in mongo session store",err);
    });
    const sessionOptions={
        store,
        secret:process.env.SECRET,
        resave:false,
        saveUninitialized:true,
        cookie:{
            expire:Date.now()+ 7*24*60*60*1000,
            maxAge:7*24*60*60*1000,
            httpOnly:true,
        },
    };
    // app.get("/",(req,res)=>{
    //     res.send("working");
    // });
    
    app.use(session(sessionOptions));
    app.use(flash());
    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStratergy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    app.use((req,res,next)=>{
        res.locals.success=req.flash("success");
        res.locals.error=req.flash("error");
        res.locals.currUser=req.user;
        next();
    });
    // app.get("/demouser",async(req,res)=>{
    //     let fakeUser= new User({
    //         email:"sdhsdbsh@getMaxListeners.com",
    //         username:"Don",
    //     })
    //     let newUser=await User.register(fakeUser,"helloWorld");
    //     res.send(newUser);
    // })
    
    app.use("/listings",listingRouter);
    app.use("/listings/:id/reviews",reviewRouter);
    app.use("/",userRouter);
    
    app.all("*",(req,res,next)=>{
        next(new ExpressError(404,"Page not found"));
    })
    app.use((err,req,res,next)=>{
        let{status=500,message="Some error occured"}=err;
        res.status(status).render("error.ejs",{message});
    })
    app.listen(3000,()=>{
        console.log("listening to port 3000");
    });