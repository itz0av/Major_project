if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require ("express");
const app = express();
const port = 3000;
const mongoose = require ("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const engine = require('ejs-mate');
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing_app.js");
const reviewsRouter = require("./routes/review_app.js");
const userRouter = require("./routes/user_app.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL ;

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
async function main(){
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect( dbUrl );
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")))

// async function run() {
//   await mongoose.connect('your-mongodb-atlas-connection-string', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// Your `listings.find()` operation here, after the connection is established
// }

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    toouchAfter: 24 * 3600 , 
});
store.on("error",()=>{
    console.log("error in Mongo Session Store", err);
})
const sessionOption ={
    store,
    secret:  process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        // expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.get("/", (req, res)=>{
    res.send("none");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Configure Passport LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next )=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*",(req, res, next)=>{
    next(new ExpressError(404,"page not Found"));
})
app.use((err, req, res, next)=>{
    let{ message="Someting went Wrong"} =err;
    res.status(500).render("./listings/error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(3000, ()=>{
    console.log("server is listening to port 3000");
});