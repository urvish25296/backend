const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const { validateParkingSpot } = require("../../utill/validation");
const jwt = require("jsonwebtoken");
const ParkingSpot = require("../../model/ParkingSpot");

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
    async getParkingSpots(
      _,
      { parkingSpotInput: { id, name, available, cost, status } },
      context
    ) {
      const detail = {
        _id: id,
        name,
        available,
        cost,
        status,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to list Parking Spots.",
          error: true,
        };

      const parkingspots = await ParkingSpot.find(detail);
      return {
        obj: parkingspots,
        message: "Fetched ParkingSpots.",
        error: false,
      };
    },
  },

  Mutation: {
    async createParkingSpot(
      _,
      { parkingSpotInput: { id, name, available, cost, status } },
      context
    ) {
      const detail = {
        _id: id,
        name,
        available,
        cost,
        status,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to create Parking Spots.",
          error: true,
        };

      try {
        const parkingSpot = await ParkingSpot.findOne({ name });
        if (parkingSpot)
          throw new UserInputError("Parking spot with same name");
        const { valid, errors } = validateParkingSpot(name);
        if (!valid) throw new UserInputError("Invalid name", { errors });
      } catch (ex) {
        return {
          obj: [],
          message: "An error occurred.",
          error: true,
        };
      }

      const parkingspot = await new ParkingSpot(detail).save();

      return {
        obj: [parkingspot],
        message: "Parking spot created successfully.",
        error: false,
      };
    },

    async updateParkingSpot(
      _,
      { parkingSpotInput: { id, name, available, cost, status } },
      context
    ) {
      const detail = {
        _id: id,
        name,
        available,
        cost,
        status,
      };
      Object.keys(detail).forEach((key) =>
        detail[key] === undefined ? delete detail[key] : {}
      );

      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to update Parking Spots.",
          error: true,
        };

      const parkingspot = await ParkingSpot.findOneAndUpdate(
        { _id: id },
        detail
      );

      if (!parkingspot) {
        return {
          obj: [],
          message: "ParkingSpot could not be updated.",
          error: true,
        };
      }

      return {
        obj: [parkingspot],
        message: "ParkingSpot updated.",
        error: false,
      };
    },

    async deleteParkingSpot(
      _,
      { parkingSpotInput: { id, name, available, cost, status } },
      context
    ) {
      if (!context.user || !context.user.is_admin)
        return {
          obj: [],
          message: "Unathorized to delete Parking Spots.",
          error: true,
        };

      const parkingspot = await ParkingSpot.deleteOne({ _id: id });

      if (parkingspot.deletedCount < 1) {
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
