const bcrypt = require("bcryptjs");
const ParkingSpots = require("../../model/ParkingSpot");
const Booking = require("../../model/Booking");
const User = require("../../model/User");
const ParkingSpot = require("../../model/ParkingSpot");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Query: {
    async getBookings(
      _,
      {
        bookingInput: {
          id,
          user,
          parkingspot,
          date,
          num_of_hours,
          total,
          is_paid,
        },
      }
    ) {
      const detail = {
        _id: id,
        user,
        parkingspot,
        date,
        num_of_hours,
        total,
        is_paid,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      const bookings = await Booking.find(detail).populate([
        "user",
        "parkingspot",
      ]);

      return {
        obj: bookings,
        message: "Fetched Bookings",
        error: false,
      };
    },
  },

  Mutation: {
    async createBooking(
      _,
      {
        bookingInput: {
          id,
          user,
          parkingspot,
          date,
          num_of_hours,
          total,
          is_paid,
        },
      }
    ) {
      const detail = {
        _id: id,
        user,
        parkingspot,
        date,
        num_of_hours,
        total,
        is_paid,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      // validation is needed to see if there is another with the same parking spot

      const _booking = await new Booking(detail).save();
      const booking = await Booking.findById(_booking.id).populate([
        "user",
        "parkingspot",
      ]);

      await ParkingSpot.findOneAndUpdate(
        { _id: _booking.parkingspot },
        { avalible: false }
      );

      return {
        obj: [booking],
        message: "Created Booking.",
        error: false,
      };
    },

    async updateBooking(
      _,
      {
        bookingInput: {
          id,
          user,
          parkingspot,
          date,
          num_of_hours,
          total,
          is_paid,
        },
      }
    ) {
      const detail = {
        _id: id,
        user,
        parkingspot,
        date,
        num_of_hours,
        total,
        is_paid,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      // validation is needed to see if there is another with the same parking spot

      const booking = await Booking.findOneAndUpdate(
        { _id: id },
        detail
      ).populate(["user", "parkingspot"]);

      if (!booking) {
        return {
          obj: [],
          message: "Booking could not be updated.",
          error: true,
        };
      }

      // change parkingspot

      await ParkingSpot.findOneAndUpdate(
        { _id: booking.parkingspot },
        { avalible: true }
      );

      await ParkingSpot.findOneAndUpdate(
        { _id: parkingspot },
        { avalible: false }
      );

      return {
        obj: [booking],
        message: "Booking updated.",
        error: false,
      };
    },

    async deleteBooking(
      _,
      {
        bookingInput: {
          id,
          user,
          parkingspot,
          date,
          num_of_hours,
          total,
          is_paid,
        },
      }
    ) {
      const booking = await Booking.findOne({ _id: id });
      await ParkingSpot.findOneAndUpdate(
        { _id: booking.parkingspot },
        { avalible: true }
      );

      await Booking.deleteOne({ _id: id });

      if (booking.deletedCount < 1) {
        return {
          obj: [],
          message: "ParkingSpot could not be deleted.",
          error: true,
        };
      }

      return {
        obj: [],
        message: "ParkingSpot deleted.",
        error: false,
      };
    },
  },
};
