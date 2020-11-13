const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Shopping = require("./Shopping").schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  shopkeeper: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  coordinates: { type: [Number], default: [37.7577, -122.4376] },
  address: {
    locality: { type: String, default:"" },
    landmark: { type: String, default:"" },
    state: { type: String, default:"" },
    pin: { type: String, default:"" },
    country: { type: String , default:""},
    latitude: { type: Number, default: 37.7577 },
    longitude: { type: Number, default: -122.4376 }
  },
  userImage: { type: String , default: "uploads/defaultImage.png"},
  shopName: { type: String },
  contactNumber: { type: Number },
  available: { type: Number },
  sold: { type: Number , default: 0},
  price: { type: Number },
  shopping : { type: Shopping, default: { notifications: [""]} }
});

module.exports = User = mongoose.model("users", UserSchema);