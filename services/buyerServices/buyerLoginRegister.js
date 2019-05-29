var config = require('../../config');
var async = require("async");
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var ObjectID = mongo.ObjectID;

//======================MONGO MODELS============================
var BuyerModels = require('../../models/buyer/buyerModel');
var mailProperty = require('../../modules/sendMail');

var buyerLoginRegister = {
    jwtAuthVerification: (jwtData, callback) => {
        if (jwtData.authtoken && jwtData.user_id) {
            BuyerModels.authenticate(jwtData, function (auth) {
                callback(auth);
            })
        } else {
            callback({
                "response_code": 5002,
                "response_message": "Please provide required information"
            })
        }
    },
    register: (data, callback) => {
        async.waterfall([
            function (nextCb) {
                if (!data.firstName) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide first name",
                        "response_data": {}
                    });
                } else if (!data.lastName) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide last name",
                        "response_data": {}
                    });
                } else if (!data.email) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide email address",
                        "response_data": {}
                    });
                } else if (!data.password) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide password",
                        "response_data": {}
                    });
                } else if (!data.mobile) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide mobile",
                        "response_data": {}
                    });
                } else {
                    nextCb(null, {
                        "response_code": 2000,
                        "response_message": "success",
                        "response_data": {}
                    });
                }
            },
            function (arg1, nextCb) {
                if (arg1.response_code == 2000) {
                    //data._id = new ObjectID;
                    let buyerSchema = {

                        _id: new ObjectID,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        mobile: data.mobile,
                        email: data.email,
                        password: data.password,
                        contacts: []
                    };
                    //return console.log(userSchema);
                    BuyerModels.addUser(buyerSchema, function (result) {
                        nextCb(null, result);
                    });
                } else {
                    nextCb(null, arg1);
                }
            },
            function (arg1, nextCb) {
                if (arg1.response_code == 2000) {
                    var email_verified_url = config.__site_url + '#/email-verified/?id=' + arg1.response_data._id;
                    nextCb(null, {
                        response_code: 2000,
                        response_message: 'Short url',
                        response_data: email_verified_url,
                        data: arg1.response_data
                    });

                } else {
                    nextCb(null, arg1);
                }
            },
            function (arg1, nextCb) {
                if (arg1.response_code == 2000) {
                    // mailProperty('sendOTPdMail')(data.email, {
                    //     name: data.firstName+' '+data.lastName,
                    //     email: data.email,
                    //     OTP: arg1.data.otp
                    // }).send();
                    nextCb(null, {
                        response_code: 2000,
                        response_message: 'You have succesfully registered. Please check your email address and varify your email .',
                        response_data: arg1.data,
                        otp_token: arg1.data.otp_token
                    });
                } else {
                    nextCb(null, arg1);
                }
            }
        ], function (err, result) {
            if (err) {
                callback({
                    "response_code": 5005,
                    "response_message": "INTERNAL DB ERROR",
                    "response_data": err
                });
            } else {
                callback(result);
            }
        });
    },
    
    profileImageUpload: (data, files, callback) => {
        console.log("wwwwwwwwwwwwww")
        if (!files.image) {
            callback({
                "response_code": 5002,
                "response_message": "please select image",
                "response_data": {}
            });
        } else if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        } else {
            BuyerModels.imageUpload(data, files.image, function (result) {
                callback(result);
            });
        }
    },

    profileDetails: (data, callback) => {
        
        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        }
         else {
            BuyerModels.getProfileDetails(data, function (result) {
                callback(result);
            });
        }
    },

    setProfileDetails: (data, callback) => {
        
        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        }
        if (!data.firstName) {
            callback({
                "response_code": 5002,
                "response_message": "please provide first name",
                "response_data": {}
            });
        }
        if (!data.lastName) {
            callback({
                "response_code": 5002,
                "response_message": "please provide last name",
                "response_data": {}
            });
        }
         else {
            BuyerModels.setProfileDetails(data, function (result) {
                callback(result);
            });
        }
    },
    login: (data, callback) => {
        if (!data.email) {
            callback({
                "response_code": 5002,
                "response_message": "please provide email",
                "response_data": {}
            });
        } else if (!data.password) {
            callback({
                "response_code": 5002,
                "response_message": "please provide password",
                "response_data": {}
            });
        } else if (!data.appType) {
            callback({
                "response_code": 5002,
                "response_message": "please provide app type2",
                "response_data": {}
            });
        }
        else if (!data.deviceToken) {
            callback({
                "response_code": 5002,
                "response_message": "please provide device token",
                "response_data": {}
            });
        } else {
            BuyerModels.login(data, function (result) {
                callback(result);
            });
        }
    },
    sentOTP: (data, callback) => {
        if (!data.email) {
            callback({
                "response_code": 5002,
                "response_message": "please provide email",
                "response_data": {}
            });
        } 
        // else if (!data.userId) {
        //     callback({
        //         "response_code": 5002,
        //         "response_message": "please provide userId",
        //         "response_data": {}
        //     });
        // } 
        else {
            BuyerModels.generateOtpAndSend(data, function (result) {
                if(result.response_code === 2000){
                    // mailProperty('sendOTPdMail')(data.email, {
                    //     name: result.data.firstName+' '+result.data.lastName,
                    //     email: data.email,
                    //     OTP: result.response_data.otp
                    // }).send();
                }
                
                callback(result);
            });
        }
    },
    verifyOTP: (data, callback) => {
        if (!data.otp) {
            callback({
                "response_code": 5002,
                "response_message": "please provide OTP",
                "response_data": {}
            });
        } else if (!data.token) {
            callback({
                "response_code": 5002,
                "response_message": "please provide token",
                "response_data": {}
            });
        } else if (!data.emailVerify) {
            callback({
                "response_code": 5002,
                "response_message": "please provide emailVerify",
                "response_data": {}
            });
        }  else {
            BuyerModels.verifyOTP(data, function (result) {
                callback(result);
            });
        }
    },
    setPassword: (data, callback) => {
        
        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        }
        if(!data.forgotPassword){
            callback({
                "response_code": 5002,
                "response_message": "please provide forgot password",
                "response_data": {}
            });
        }
        else{
            if(data.forgotPassword === "0"){
                if (!data.currentpassword) {
                    callback({
                        "response_code": 5002,
                        "response_message": "please provide current password",
                        "response_data": {}
                    });
                }
            }
        }
        
        
        if (!data.password) {
            callback({
                "response_code": 5002,
                "response_message": "please provide password",
                "response_data": {}
            });
        }
         else {
            BuyerModels.changepassword(data, function (result) {
                callback(result);
            });
        }
    },
}

module.exports = buyerLoginRegister;