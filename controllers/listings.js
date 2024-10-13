const Listing = require("../models/listing");
const Review =require("../models/review.js");

module.exports.index=
async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.showListing= async(req, res)=>{
    let {id}= req.params; 
    const listing = await Listing.findById(id)
    .populate({
        path:"reviews", 
        populate:{
        path:"author"
    },
    })
    .populate("owner");
    if (!listing){
        req.flash("error", "Listing you requesting for does not Exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async(req, res, next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);

    const newListing = new Listing(req.body.listing);
    console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image={url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!" );
    res.redirect("/listings");
    };

module.exports.editListing =async(req, res)=>{
    let {id}= req.params; 
    const listing = await Listing.findById(id);
    if (!listing){
        req.flash("error", "Listing you requesting for does not Exist!");
        res.redirect("/listings");

    }
    let previewImageUrl = listing.image.url;
    previewImageUrl = previewImageUrl.replace ("/upload", "/upload/ar_1.0,c_fill,h_250/bo_3px_solid_grey");
    res.render("./listings/edit.ejs", {listing, previewImageUrl });

}

module.exports.updateListing = async(req, res)=>{
    try{ let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename };
    await listing.save();
    }
    req.flash("success", "Listing is Updated" );
    res.redirect(`/listings/${id}`);
}catch(err){
    res.redirect("/listings");
 console.log(err);
};
};

module.exports.deleteListing = async(req, res) => {
    try {
        let { id } = req.params;
        // First, find and delete the listing by ID
        let deletedListing = await Listing.findByIdAndDelete(id);

        // If the listing had associated reviews, delete them as well
        if (deletedListing && deletedListing.reviews.length > 0) {
            await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
        }

        console.log("Listing and associated reviews are deleted");
        req.flash("success", "Listing was deleted!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "An error occurred while deleting the listing and reviews.");
        res.redirect("/listings");
    }
};
