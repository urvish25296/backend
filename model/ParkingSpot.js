const { model, Schema } = require("mongoose");
module.exports = model(
  "ParkingSpots",
  new Schema({
    name: String,
    available: Boolean,
    cost: String,
    status: Boolean,
  })
);
