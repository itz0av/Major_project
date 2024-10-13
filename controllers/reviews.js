const Review =require("../models/review.js");
const Listing = require("../models/listing");

module.exports.postReview =async(req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        listing.reviews.push(newReview);

        await newReview.save(); 
        await listing.save();

        console.log("new review saved");
        req.flash("success", " New Review is Created!" );
        res.redirect(`/listings/${id}`); // Assuming you have a route that renders the listing with the given ID
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while saving the review.");
    }
}

module.exports.destroyReview =async (req, res)=>{
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    console.log("Review is Deleted");
    req.flash("success", " Review is deleted!" );
    res.redirect(`/listings/${id}`);
}