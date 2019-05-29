var BuyerSchema = require('../../schema/buyer/buyer');
var config = require('../../config');
var async = require("async");
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var jwtOtp = require('jwt-otp');
var fs = require('fs');
var base64ToImage = require('base64-to-image');

var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;

var UserModels = {
    authenticate: function (jwtData, callback) {
        if (jwtData.user_id) {
            jwt.verify(jwtData.authtoken, config.secretKey, function (err, decoded) {
                if (err) {
                    callback({
                        response_code: 4000,
                        response_message: "Session timeout! Please login again.",
                        response_data: err
                    });
                } else {
                    callback({
                        response_code: 2000,
                        response_message: "Authenticate successfully.",
                        response_data: decoded
                    });
                }
            });
        }
    },
    addUser: function (data, callback) {
        if (data) {

            BuyerSchema.count({
                mobile: data.mobile
            }).exec(function (err, resCount) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    if (resCount > 0) {
                        callback({
                            "response_code": 2008,
                            "response_message": "Phone no already exist",
                            "response_data": err
                        });
                    }
                }
            });

            BuyerSchema.count({
                email: data.email
            }).exec(function (err, resCount) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    if (resCount > 0) {
                        callback({
                            "response_code": 2008,
                            "response_message": "Email already exist",
                            "response_data": err
                        });
                    } else {
                        new BuyerSchema(data).save(function (err, result) {

                            if (err) {
                                callback({
                                    "response_code": 5005,
                                    "response_message": "INTERNAL DB ERROR",
                                    "response_data": err
                                });
                            } else {
                                let otpAndToken = generateOtpAndToken(result._id);
                                callback({
                                    "response_code": 2000,
                                    "response_message": "You have registered successfully.",
                                    "response_data": {
                                        "otp": otpAndToken.otp,
                                        "otp_token": otpAndToken.token
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": err
            });
        }
    },
    login: function (data, callback) {
        console.log(data);
        
        if (data) {
            BuyerSchema.findOne({
                    email: data.email
                }, {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    mobile: 1,
                    emailVerify: 1,
                    password: 1,
                    authToken: 1,
                    profileImage: 1
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "Wrong phone no. Please provide registered details.",
                                "response_data": {}
                            });
                        } else {

                            //return console.log(result);

                            var comparePass = bcrypt.compareSync(data.password, result.password);
                            if (comparePass == true) {
                                if (result.emailVerify == '0') {
                                    callback({
                                        "response_code": 5010,
                                        "response_message": "Please verify your email.",
                                        "response_data": result
                                    });
                                } else {
                                    var token = jwt.sign({
                                        email: data.email
                                    }, config.secretKey, {
                                        expiresIn: '8760h'
                                    });

                                    BuyerSchema.update({
                                        _id: result._id
                                    }, {
                                        $set: {
                                            authToken: token,
                                            appType: data.appType,
                                            deviceToken: data.deviceToken ? data.deviceToken : ''
                                        }
                                    }, function (err, resUpdate) {
                                        if (err) {
                                            callback({
                                                "response_code": 5005,
                                                "response_message": "INTERNAL DB ERROR",
                                                "response_data": err
                                            });
                                        } else {
                                            result.authToken = token;
                                            result.password = "";
                                            if (result.profileImage !== "") {
                                                let profileImageWithPath = config.liveUrl + `user/profileImage/${result.profileImage}`
                                                result.profileImage = profileImageWithPath;
                                            }

                                            callback({
                                                "response_code": 2000,
                                                "response_message": "Logged in to your account successfully !",
                                                "response_data": result
                                            });
                                        }
                                    });
                                }

                            } else {
                                callback({
                                    "response_code": 5002,
                                    "response_message": "Wrong password. Please provide registered details.",
                                    "response_data": {}
                                });
                            }

                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": err
            });
        }
    },
    generateOtpAndSend: function (data, callback) {
        if (data) {
            BuyerSchema.findOne({
                email: data.email
            })
            .select('firstName lastName')
            .exec(function (err, res) {
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "INTERNAL DB ERROR",
                        "response_data": err
                    });
                } else {
                    if (!res) {
                        callback({
                            "response_code": 2008,
                            "response_message": "User does not exist",
                            "response_data": err
                        });
                    } else {
                        let otpAndToken = generateOtpAndToken(res._id);
                        callback({
                            "response_code": 2000,
                            "response_message": "OTP sent successfully",
                            "data": res,
                            "response_data": {
                                "otp": otpAndToken.otp,
                                "otp_token": otpAndToken.token
                            }
                        });
                    }
                }
            });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": err
            });
        }
    },
    verifyOTP: function (data, callback) {

        if (data) {
            verifyOtpToken(data.token, (err, res) => {
                console.log(res);
                
                if (err) {
                    callback({
                        "response_code": 5005,
                        "response_message": "Something went wrong",
                        "response_data": err
                    });
                }

                if (data.otp === res.fourDigitOtp.toString()) {
                    var token = jwt.sign({
                        email: data.email
                    }, config.secretKey, {
                        expiresIn: '8760h'
                    });

                    if(data.emailVerify == 1){
                        BuyerSchema.update({
                            _id: res.userId.toString()
                        }, {
                            $set: {
                                emailVerify: "1"
                            }
                        }, function (err, result) {
                            console.log("ee",err,"res",result);
                            
                        });
                    }
                    callback({
                        "response_code": 2000,
                        "response_message": "OTP verified successfully !",
                        "response_data": {
                            "token": token,
                            "userId": res.userId.toString()
                        }
                    });
                       
                } else {
                    callback({
                        "response_code": 5002,
                        "response_message": "Wrong OTP!! Plese try again"

                    });
                }
            })



        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": err
            });
        }
    },
    changepassword: function (data, callback) {
        if (data) {
            BuyerSchema.findOne({
                    _id: data.userId
                },
                function (err, result) {
                    if (err) {
                        callback({
                            "response_code": 5005,
                            "response_message": "INTERNAL DB ERROR",
                            "response_data": err
                        });
                    } else {
                        if (result == null) {
                            callback({
                                "response_code": 5002,
                                "response_message": "User doest not exist.",
                                "response_data": {}
                            });
                        } else {
                            var comparePass = true;
                            if (data.forgotPassword === "0") {
                                comparePass = bcrypt.compareSync(data.currentpassword, result.password);
                            }

                            if (comparePass == true) {
                                bcrypt.hash(data.password, null, null, function (err, hash) {
                                    if (err) {
                                        callback({
                                            "response_code": 5005,
                                            "response_message": "INTERNAL DB ERROR",
                                            "response_data": err
                                        });
                                    } else {
                                        BuyerSchema.update({
                                                _id: data.userId
                                            }, {
                                                $set: {
                                                    password: hash
                                                }
                                            },
                                            function (err, resUpdate) {
                                                if (err) {
                                                    callback({
                                                        "response_code": 5005,
                                                        "response_message": "INTERNAL DB ERROR",
                                                        "response_data": err
                                                    });
                                                } else {
                                                    callback({
                                                        "response_code": 2000,
                                                        "response_message": "Password has been changed."
                                                    });
                                                }
                                            });
                                    }
                                });

                            } else {
                                callback({
                                    "response_code": 5020,
                                    "response_message": "Current password is wrong.",
                                    "response_data": {}
                                });
                            }
                        }
                    }
                });
        } else {
            callback({
                "response_code": 5005,
                "response_message": "INTERNAL DB ERROR",
                "response_data": err
            });
        }
    },

    
    
    

}
// generate otp and token
function generateOtpAndToken(userId) {
    var sessionAgent = new jwtOtp();

    var otp = Math.floor(1000 + Math.random() * 9000);

    // Set a seed secret to issue tokens with
    sessionAgent.setIssuingSecret(config.secretKey);
    sessionAgent.issuingSeed.ex

    // Create a token using an arbitrary payload 
    var myToken = sessionAgent.issueToken({
        userId: userId,
        fourDigitOtp: otp
    })



    return {
        token: myToken,
        otp: otp
    };
}
// verify OTP
function verifyOtpToken(token, callback) {



    var sessionAgent = new jwtOtp();
    sessionAgent.setIssuingSecret(config.secretKey);


    sessionAgent.validateToken(token, function (err, payload) {
        if (err) {
            console.log(err)
            callback(err)
            return console.log("The token is invalid!")
        }


        callback(null, payload)
        //console.log("UserId: ", payload.userId, " otherInfo: ", payload.fourDigitOtp); 
    });
}
//Date to time stamp
function dateTimeToTimeStamp(date, time, timezone='UTC'){
    var fullDate = date+' '+time+' '+timezone;
    var timeStamp = Math.floor((new Date(fullDate)).getTime() / 1000);
    return timeStamp;
}

function base64ToImageFunc(string, fileName, filePath){
    return new Promise(function(resolve, reject) {
        var base64Str = string;
        //var path ='./public/images/';
        var path = filePath;
        var extension = base64Str.substring(base64Str.indexOf('/') + 1, base64Str.indexOf(';base64'));
        var optionalObj = {'fileName': fileName, 'type': extension};

        
            
        //Note base64ToImage function returns imageInfo which is an object with imageType and fileName.
        var imageInfo = base64ToImage(base64Str,path,optionalObj); 
        //console.log(imageInfo);
        resolve(imageInfo);
        //return imageInfo;

    })
    
}
function generateOtpAndToken(userId) {
    var sessionAgent = new jwtOtp();

    var otp = Math.floor(1000 + Math.random() * 9000);

    // Set a seed secret to issue tokens with
    sessionAgent.setIssuingSecret(config.secretKey);
    sessionAgent.issuingSeed.ex

    // Create a token using an arbitrary payload 
    var myToken = sessionAgent.issueToken({
        userId: userId,
        fourDigitOtp: otp
    })



    return {
        token: myToken,
        otp: otp
    };
}

function verifyOtpToken(token, callback) {



    var sessionAgent = new jwtOtp();
    sessionAgent.setIssuingSecret(config.secretKey);


    sessionAgent.validateToken(token, function (err, payload) {
        if (err) {
            console.log(err)
            callback(err)
            return console.log("The token is invalid!")
        }


        callback(null, payload)
        //console.log("UserId: ", payload.userId, " otherInfo: ", payload.fourDigitOtp); 
    });
}


module.exports = UserModels;