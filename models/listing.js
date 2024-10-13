const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
  
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default: "https://www.digsdigs.com/photos/traditional-and-cozy-island-beach-cottage-1-750x500.jpg",
      set: (v) => (v === "" ? "https://www.digsdigs.com/photos/traditional-and-cozy-island-beach-cottage-1-750x500.jpg" : v)
  }
  
},
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
  },
});

// listingSchema.post("findOneAndDelete", async (listing)=>{
//   if(listing){
//     await Review.deleteMany({_id:{$in: listing.reviews }});
//   }
// })

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
