var config = require('../../config');
var async = require("async");
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var ObjectID = mongo.ObjectID;

var Admin = require('../../schema/admin/admin');

//======================MONGO MODELS============================
var CommonModel = require('../../models/admin/adminCommonModel');
// var VehicleType = require('../../models/');
// var mailProperty = require('../../modules/sendMail');

var common = {
    jwtAuthVerification: (jwtData, callback) => {
        
        if (jwtData["x-access-token"]) {
            CommonModel.authenticate(jwtData, function (auth) {
                callback(auth);
            })
        } else {
            callback({
                success: false,
                STATUSCODE: 4200,
                message: "token missing",
                response: {}
            })
        }
    },
    // addVehicleTypeService: (data, callback) => {
    //     if (!data.type) {
    //         callback({
    //             "response_code": 5002,
    //             "response_message": "please provide type",
    //             "response_data": {}
    //         });
    //     }else {
    //         CommonModel.addVehicleTypeModel(data, function (result) {
    //             callback(result);
    //         });
    //     }
    // },
    // adminSignup: function (adminData, callback) {
    //     if (!adminData.email) {
    //         callback({
    //             success: false,
    //             message: "please enter email"
    //         });
    //     }
    //     if (!adminData.password) {
    //         callback({
    //             success: false,
    //             message: "please enter password"
    //         });
    //     }
    //     if (!adminData.name) {
    //         callback({
    //             success: false,
    //             message: "please enter name"
    //         });
    //     }
        
    //     async.waterfall([
    //         function (nextcb) {       //checking email existance
    //             var cError1 = "";
    //             Admin.findOne({ email: adminData.email }, function (err, admindet) {
    //                 if (err)
    //                     nextcb(err);
    //                 else {
    //                     if (admindet) {
    //                         cError1 = "email already taken";
    //                     }
    //                     nextcb(null, cError1);
    //                 }
    //             });
    //         },
    //         function (cError1, nextcb) {    //updating admin's data
    //             if (cError1) {
    //                 nextcb(null, cError1);
    //             } else {
    //                 var admin = new Admin(adminData);
    //                 admin.save(function (err) {
    //                     if (err) {
    //                         nextcb(err);
    //                     } else {
    //                         nextcb(null, cError1);
    //                     }
    //                 });
    //             }
    //         }

    //     ], function (err, cError) {
    //         if (err) {
    //             callback({ success: false, message: "some internal error has occurred", err: err });
    //         } else if (cError != "") {
    //             callback({ success: false, message: cError });
    //         } else {
    //             callback({ success: true, message: "Admin saved successfully" })
    //         }
    //     });
    // },
    // adminLogin: function (adminData, callback) {
    //     console.log(adminData); 
    //     var id = "0";
    //     if (adminData.email && adminData.password) {

    //         Admin.findOne({ email: adminData.email })
    //             .select('password name companyName profileImage permission authtoken blockStatus userType')
    //             .then(function (loginRes) {
    //                 console.log("loginRes",loginRes);
                    
    //                 if (!loginRes) {
    //                     callback({
    //                         success: false,
    //                         STATUSCODE: 4000,
    //                         message: "User doesn't exist",
    //                         response: {}
    //                     });
    //                 } else {
    //                     if (!loginRes.comparePassword(adminData.password)) {

    //                         callback({
    //                             success: false,
    //                             STATUSCODE: 4000,
    //                             message: "User name or password is wrong",
    //                             response: {}
    //                         });
    //                     } else {
    //                         var token = jwt.sign({
    //                             email: adminData.email
    //                         }, config.secretKey, { expiresIn: '12h' });

    //                         Admin.update({
    //                             _id: loginRes._id
    //                         }, {
    //                             $set: {
    //                                 authtoken: token
    //                             }
    //                         }, function (err, resUpdate) {
    //                             if (err) {
                                    
    //                             } else {
    //                                 callback({
    //                                     success: true,
    //                                     STATUSCODE: 2000,
    //                                     message: "Login success",
    //                                     response: {
    //                                         email: adminData.email,
    //                                         token: token,
    //                                         "id": loginRes._id,
    //                                         "userType": loginRes.userType,
    //                                         "permission": loginRes.permission,
    //                                         "name": loginRes.name,
    //                                         "companyName": loginRes.companyName,
    //                                         "profileImage": loginRes.profileImage,
    //                                         "blockStatus": loginRes.blockStatus
    //                                     }
    //                                 })
    //                             }
    //                         });
                           
    //                     }
    //                 }

    //             });
    //     } else {
    //         callback({
    //             success: false,
    //             STATUSCODE: 5000,
    //             message: "Insufficient information provided for user login",
    //             response: {}
    //         });
    //     }
    // },
    // createUserService: function (adminData, callback) {
    //     if (!adminData.adminId) {
    //         callback({
    //             success: false,
    //             message: "please enter admin id"
    //         });
    //     }
    //     if (!adminData.userType) {
    //         callback({
    //             success: false,
    //             message: "please choose user type"
    //         });
    //     }
    //     if (!adminData.email) {
    //         callback({
    //             success: false,
    //             message: "please enter email"
    //         });
    //     }
    //     if (!adminData.name) {
    //         callback({
    //             success: false,
    //             message: "please enter name"
    //         });
    //     }
    //     if (!adminData.password) {
    //         callback({
    //             success: false,
    //             message: "please enter password"
    //         });
    //     }
    //     CommonModel.createUserModel(adminData, function (result) {
    //         callback(result);
    //     });
    // },
    // carDetailsUploadService: (data, files, callback) => {
    //     CommonModel.carDetailsUploadModel(data, files, function (result) {
    //         callback(result);
    //     });
       
    // },
    // getUserDataService: (data, callback) => {
    //     CommonModel.getUserDataModel(data, function (result) {
    //         callback(result);
    //     });
       
    // },
    

}

module.exports = common;