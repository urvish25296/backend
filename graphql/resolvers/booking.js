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
      },
      context
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

      if (!context.user)
        return {
          obj: [],
          message: "Unathorized to list Bookings.",
          error: true,
        };

      if (!context.user.is_admin) {
        const bookings = await Booking.find({
          ...detail,
          user: context.user.id,
        }).populate(["user", "parkingspot"]);

        return {
          obj: bookings,
          message: "Fetched Bookings",
          error: false,
        };
      }

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
      },
      context
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

      if (!context.user)
        return {
          obj: [],
          message: "Unathorized to create Bookings.",
          error: true,
        };

      // validation is needed to see if there is another with the same parking spot

      if (!context.user.is_admin) {
        var _booking = await new Booking({
          ...detail,
          user: context.user.id, // make sure its the current user
        }).save();
      } else {
        var _booking = await new Booking(detail).save();
      }

      // save() returns an object without populate option, therefore I need to search again
      const booking = await Booking.findById(_booking.id).populate([
        "user",
        "parkingspot",
      ]);

      await ParkingSpot.findOneAndUpdate(
        { _id: booking.parkingspot },
        { available: false }
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
      },
      context
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

      if (!context.user)
        return {
          obj: [],
          message: "Unathorized to update Bookings.",
          error: true,
        };

      if (!context.user.is_admin) {
        var booking = await Booking.findOneAndUpdate(
          { _id: id, user: context.user.id },
          {
            ...detail,
            user: context.user.id,
          }
        ).populate(["user", "parkingspot"]);
      } else {
        var booking = await Booking.findOneAndUpdate(
          { _id: id },
          detail
        ).populate(["user", "parkingspot"]);
      }

      // validation is needed to see if there is another with the same parking spot

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
      },
      context
    ) {
      if (!context.user)
        return {
          obj: [],
          message: "Unathorized to delete Bookings.",
          error: true,
        };

      if (!context.user.is_admin) {
        var booking = await Booking.findOne({ _id: id, user: context.user.id });
      } else {
        var booking = await Booking.findOne({ _id: id });
      }

      if (!booking) {
        return {
          obj: [],
          message: "Booking could not be deleted.",
          error: true,
        };
      }

      const { deletedCount } = await Booking.deleteOne({ _id: id });

      if (!deletedCount) {
        return {
          obj: [],
          message: "Booking could not be deleted.",
          error: true,
        };
      }

      await ParkingSpot.findOneAndUpdate(
        { _id: booking.parkingspot },
        { available: true }
      );

      return {
        obj: [],
        message: "Booking deleted.",
        error: false,
      };
    },
  },
};
