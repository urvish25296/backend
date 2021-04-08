const { model, Schema } = require("mongoose");
module.exports = model(
  "User",
  new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone_number: String,
    is_admin: Boolean,
    status: Boolean,
  })
);
