var config = require('../../config');
var async = require("async");
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var ObjectID = mongo.ObjectID;

//======================MONGO MODELS============================
var DriverModels = require('../../models/driver/driver');
var BookingModel = require('../../models/driver/bookingModel');
var mailProperty = require('../../modules/sendMail');

var bookingService = {
    jwtAuthVerification: (jwtData, callback) => {
        if (jwtData.authtoken && jwtData.user_id) {
            DriverModels.authenticate(jwtData, function (auth) {
                callback(auth);
            })
        } else {
            callback({
                "response_code": 5002,
                "response_message": "Please provide required information"
            })
        }
    },
    createTripService: (data, callback) => {

        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        }
        if (!data.vehicleId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide Vehicle Id",
                "response_data": {}
            });
        } else {
            //console.log(1111111111111111);

            let tripSchema = {
                driver: data.userId,
                vehicleId: data.vehicleId,
                startLocationLatLongText: data.startLocationLatLongText,
                endLocationLatLongText: data.endLocationLatLongText,
                routeLatLongArray: data.routeLatLongArray,
                startTime: data.startTime,
                duration: data.duration,
                endTime: {
                    estimated: data.startTime + data.duration.estimated
                },
                noOfSeats: data.noOfSeats,
                seatAvailable: data.noOfSeats,
                genderPreference: data.genderPreference
            }

            //console.log(tripSchema);

            BookingModel.createTripModel(tripSchema, function (result) {
                callback(result);
            });
        }
    },
    getTripService: (data, callback) => {

        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        }
        if (!data.tripStatus) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip status",
                "response_data": {}
            });
        } else {
           
            BookingModel.getTripModel(data, function (result) {
                callback(result);
            });
        }
    },
    getBookingByTripService: (data, callback) => {

        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.tripId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip id",
                "response_data": {}
            });
        } else {
           
            BookingModel.getBookingByTripModel(data, function (result) {
                callback(result);
            });
        }
    },
    bookingRequestService: (data, callback) => {

        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.acceptStatus) {
            callback({
                "response_code": 5002,
                "response_message": "please provide status",
                "response_data": {}
            });
        } else {
           
            BookingModel.bookingRequestModel(data, function (result) {
                callback(result);
            });
        }
    },
    acceptBookingService: (data, callback) => {

        if (!data.tempBookingId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide temp booking id",
                "response_data": {}
            });
        }
        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide user id",
                "response_data": {}
            });
        }
        if (!data.tripId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip id",
                "response_data": {}
            });
        }
        if (!data.startTime) {
            callback({
                "response_code": 5002,
                "response_message": "please provide start time",
                "response_data": {}
            });
        } else {
           
            BookingModel.acceptBookingModel(data, function (result) {
                callback(result);
            });
        }
    },
    rejectBookingService: (data, callback) => {

        if (!data.tempBookingId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide temp booking id",
                "response_data": {}
            });
        }
        else {
           
            BookingModel.rejectBookingModel(data, function (result) {
                callback(result);
            });
        }
    },
    startTripService: (data, callback) => {
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.tripId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip id",
                "response_data": {}
            });
        }
        if (!data.startTime) {
            callback({
                "response_code": 5002,
                "response_message": "please provide start time",
                "response_data": {}
            });
        } else {
            BookingModel.startTripModel(data, function (result) {
                callback(result);
            });
        }
    },
    passengerBookingListTripService: (data, callback) => {
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.tripId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip id",
                "response_data": {}
            });
        } else {
            BookingModel.passengerBookingListTripModel(data, function (result) {
                callback(result);
            });
        }
    },
    checkActiveTripService: (data, callback) => {
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
         else {
            BookingModel.checkActiveTripModel(data, function (result) {
                callback(result);
            });
        }
    },
    passengerPickupOtpService: (data, callback) => {
        if (!data.bookingId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide booking id",
                "response_data": {}
            });
        }
        if (!data.deviceToken) {
            callback({
                "response_code": 5002,
                "response_message": "please provide device token",
                "response_data": {}
            });
        }
         else {
            BookingModel.passengerPickupOtpModel(data, function (result) {
                callback(result);
            });
        }
    },
    passengerPickupOtpVerificationService: (data, callback) => {
        if (!data.bookingId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide booking id",
                "response_data": {}
            });
        }
        if (!data.otp) {
            callback({
                "response_code": 5002,
                "response_message": "please provide OTP",
                "response_data": {}
            });
        }
         else {
            BookingModel.passengerPickupOtpVerificationModel(data, function (result) {
                callback(result);
            });
        }
    },
    passengerDropService: (data, callback) => {
        if (!data.bookingId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide booking id",
                "response_data": {}
            });
        }
         else {
            BookingModel.passengerDropModel(data, function (result) {
                callback(result);
            });
        }
    },
    endTripService: (data, callback) => {
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.tripId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip id",
                "response_data": {}
            });
        } else {
            BookingModel.endTripModel(data, function (result) {
                callback(result);
            });
        }
    },
    rateReviewUserSrvice: (data, callback) => {
        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide user id",
                "response_data": {}
            });
        }
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.tripId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide trip id",
                "response_data": {}
            });
        }
        if (!data.bookingId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide booking id",
                "response_data": {}
            });
        }
        if (!data.rate) {
            callback({
                "response_code": 5002,
                "response_message": "please provide rate",
                "response_data": {}
            });
        }
        else {
            BookingModel.rateReviewUserModel(data, function (result) {
                callback(result);
            });
        }
    },
    summarySrvice: (data, callback) => {
        
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        
        else {
            BookingModel.summaryModel(data, function (result) {
                callback(result);
            });
        }
    },
    contributionFilterSrvice: (data, callback) => {
        
        if (!data.driverId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        }
        if (!data.weekDayMonth) {
            callback({
                "response_code": 5002,
                "response_message": "please provide weekDayMonth",
                "response_data": {}
            });
        }
        if (!data.timestamp) {
            callback({
                "response_code": 5002,
                "response_message": "please provide timestamp",
                "response_data": {}
            });
        }
        
        else {
            BookingModel.contributionFilterModel(data, function (result) {
                callback(result);
            });
        }
    },

}
module.exports = bookingService;