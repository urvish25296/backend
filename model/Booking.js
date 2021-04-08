const { model, Schema } = require("mongoose");

module.exports = model(
  "Bookings",
  new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parkingspot: {
      type: Schema.Types.ObjectId,
      ref: "ParkingSpots",
      required: true,
    },
    date: String,
    num_of_hours: Number,
    total: Number,
    is_paid: Boolean,
  })
);
