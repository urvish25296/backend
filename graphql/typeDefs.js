const { gql } = require("apollo-server");

module.exports = gql`
  # Types

  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    phone_number: String!
    is_admin: Boolean!
    status: Boolean!
  }

  type ParkingSpot {
    id: ID!
    name: String!
    available: Boolean!
    cost: Int!
    status: Boolean!
  }

  type Booking {
    id: ID!
    user: User!
    parkingspot: ParkingSpot!
    date: String!
    num_of_hours: Int!
    total: Int!
    is_paid: Boolean!
  }

  type Cost {
    id: ID!
    amount: Int!
  }

  # Response types

  type UserResponse {
    obj: [User]
    message: String
    error: Boolean
  }

  type ParkingSpotResponse {
    obj: [ParkingSpot]
    message: String
    error: Boolean
  }

  type BookingResponse {
    obj: [Booking]
    message: String
    error: Boolean
  }

  type TokenResponse {
    user: User
    token: String!
    message: String!
    error: Boolean!
  }

  # Inputs

  ## User

  input UserInput {
    id: ID!
    # first_name: String!
    # last_name: String!
    # email: String!
    # password: String!
    # phone_number: String!
    # is_admin: Boolean!
    # status: Boolean!
  }

  input GetUserInput {
    id: ID
    first_name: String
    last_name: String
    email: String
    password: String
    phone_number: String
    is_admin: Boolean
    status: Boolean
  }

  input CreateUserInput {
    first_name: String!
    last_name: String!
    email: String!
    password: String!
    phone_number: String!
    is_admin: Boolean = false
    status: Boolean = false
  }

  input UpdateDeleteUserInput {
    id: ID!
    first_name: String
    last_name: String
    email: String
    password: String
    phone_number: String
    is_admin: Boolean
    status: Boolean
  }

  ## ParkingSpot

  input ParkingSpotInput {
    id: ID!
    # name: String!
    # available: Boolean!
    # cost: Int!
    # status: Boolean!
  }

  input GetParkingSpotInput {
    id: ID
    name: String
    available: Boolean
    cost: Int
    status: Boolean
  }

  input CreateParkingSpotInput {
    name: String!
    available: Boolean = true
    cost: Int = 0
    status: Boolean = false
  }

  input UpdateDeleteParkingSpotInput {
    id: ID!
    name: String
    available: Boolean
    cost: Int
    status: Boolean
  }

  ## Booking

  input BookingInput {
    id: ID!
    user: ID!
    parkingspot: ID!
    date: String!
    num_of_hours: Int!
    total: Int!
    is_paid: Boolean!
  }

  input GetBookingInput {
    id: ID
    user: ID
    parkingspot: ID
    date: String
    num_of_hours: Int
    total: Int
    is_paid: Boolean
  }

  input CreateBookingInput {
    user: ID!
    parkingspot: ID!
    date: String!
    num_of_hours: Int = 0
    total: Int = 0
    is_paid: Boolean = false
  }

  input UpdateDeleteBookingInput {
    id: ID!
    user: ID
    parkingspot: ID
    date: String
    num_of_hours: Int
    total: Int
    is_paid: Boolean
  }

  ## Cost

  input CostInput {
    amount: Int!
  }

  # Query/Mutation

  type Query {
    ## User Queries
    getUsers(userInput: GetUserInput): UserResponse

    ## ParkingSpot Queries
    getParkingSpots(parkingSpotInput: GetParkingSpotInput): ParkingSpotResponse

    ## Cost Queries
    getCosts: [Cost]

    ## Bookings Queries
    getBookings(bookingInput: GetBookingInput): BookingResponse
  }

  type Mutation {
    ## User Mutations
    createUser(userInput: CreateUserInput): UserResponse
    updateUser(userInput: UpdateDeleteUserInput): UserResponse
    deleteUser(userInput: UpdateDeleteUserInput): UserResponse
    getToken(email: String!, password: String!): TokenResponse

    ## ParkingSpot Mutations
    createParkingSpot(
      parkingSpotInput: CreateParkingSpotInput
    ): ParkingSpotResponse
    updateParkingSpot(
      parkingSpotInput: UpdateDeleteParkingSpotInput
    ): ParkingSpotResponse
    deleteParkingSpot(
      parkingSpotInput: UpdateDeleteParkingSpotInput
    ): ParkingSpotResponse

    ## Cost Mutations
    createCost(costInput: CostInput): Cost!

    ## Bookings Mutations
    createBooking(bookingInput: CreateBookingInput): BookingResponse
    updateBooking(bookingInput: UpdateDeleteBookingInput): BookingResponse
    deleteBooking(bookingInput: UpdateDeleteBookingInput): BookingResponse
  }
`;
