const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../schema.js");
const Listing =require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require ("../controllers/listings.js");
const multer  = require('multer');
const {storage, cloudinary}= require("../cloudconfig.js");
const upload = multer({ storage });


router
.route("/")
//Index Route
.get( 
    wrapAsync(listingController.index))
// Create Route
.post(isLoggedIn,
   
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.createListing));

//new Route
router.get("/new", isLoggedIn, (req, res)=>{
    res.render("./listings/new.ejs")
});

router
.route("/:id")
//show route
.get(
    wrapAsync(listingController.showListing))
//update route
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing))
//delete Route
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing))
    
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,
     wrapAsync(listingController.editListing)
);

module.exports = router;