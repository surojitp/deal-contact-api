
//var VehicleTypeSchema = require('../../schema/admin/vehicleType');
// var UserSchema = require('../../schema/user/users');
var config = require('../../config');
var async = require("async");
var bcrypt = require('bcrypt-nodejs');

var jwt = require('jsonwebtoken');
var jwtOtp = require('jwt-otp');
var fs = require('fs');
var csvtojson = require("csvtojson");

var mongoose = require('mongoose');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;


var commonModel = {
    authenticate: function (jwtData, callback) {
        if (jwtData["x-access-token"]) {
            jwt.verify(jwtData["x-access-token"], config.secretKey, function (err, decoded) {
                if (err) {
                    callback({
                        
                        success: false,
                        STATUSCODE: 4200,
                        message: "Session timeout! Please login again.",
                        response: err
                    });
                } else {
                    callback({
                        success: true,
                        STATUSCODE: 2000,
                        message: "Authenticate successfully.",
                        response: decoded
                    });
                }
            });
        }
    },
    // getUserDataModel: (data, callback) => {
    //     console.log(data)
    //     UserSchema.count().exec(function (err, resCount) {
    //         if(err){
    //             callback({
    //                 success: false,
    //                 STATUSCODE: 4200,
    //                 message: "something went wrong!",
    //                 response: err
    //             });
    //         }else{
    //             UserSchema.find()
    //             .select("email mobile firstName lastName gender blockStatus mobileVerify emailVerify")
    //             .skip(data.offset).limit(data.limit)
    //             .then(res =>{
    //                 callback({
    //                     success: true,
    //                     STATUSCODE: 2000,
    //                     message: "Success",
    //                     totalData: resCount,
    //                     response: res
    //                 });
    //             })
    //             .catch(err => {
    //                 callback({
    //                     success: false,
    //                     STATUSCODE: 4200,
    //                     message: "something went wrong!",
    //                     response: err
    //                 });
    //             })

    //         }
    //     });

        
    // },
    // createUserModel: (data, callback) => {

    //     UserSchema.count({
    //         mobile: data.email
    //     }).exec(function (err, resCount) {
    //         if (err) {
    //             callback({
    //                 "response_code": 5005,
    //                 "response_message": "INTERNAL DB ERROR",
    //                 "response_data": err
    //             });
    //         } else {
    //             if (resCount > 0) {
    //                 callback({
    //                     "response_code": 2008,
    //                     "response_message": "Email already exist",
    //                     "response_data": err
    //                 });
    //             } else {
    //                 let userSchema = {

    //                     _id: new ObjectID,
    //                     adminId: data.adminId,
    //                     userType: data.userType,
    //                     email: data.email,
    //                     name: data.name,
    //                     password: data.password

    //                 };
    //                 new UserSchema(userSchema).save(function (err, result) {

    //                     if (err) {
    //                         callback({
    //                             "response_code": 5005,
    //                             "response_message": "INTERNAL DB ERROR",
    //                             "response_data": err
    //                         });
    //                     } else {
    //                         callback({
    //                             "response_code": 2000,
    //                             "response_message": "User created successfully.",
    //                             "response_data": result
    //                         });
    //                     }
    //                 });
    //             }
    //         }
    //     });
    //     // callback({
    //     //     success: false,
    //     //     STATUSCODE: 4200,
    //     //     message: "something went wrong!",
    //     //     response: data
    //     // });
    // }

}

function csvTest(fileName){
    csvtojson()
            .fromFile('./public/'+fileName)
            .then(async (jsonObj)=>{
                console.log(jsonObj);
                
                // cartypeSchema.collection.ex
                
               
                await mongoose.connection.db.listCollections({name: 'cartypes'})
                    .next(async function(err, collinfo) {
                        if (collinfo) {
                            // The collection exists
                            console.log(4444);
                            await cartypeSchema.collection.drop();
                        }
                    });
                    cartypeSchema.insertMany(jsonObj)
            })
            .catch(err =>{
                console.log('err--',err);
            })
}

module.exports = commonModel;