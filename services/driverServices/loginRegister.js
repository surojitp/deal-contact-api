var config = require('../../config');
var async = require("async");
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var ObjectID = mongo.ObjectID;

//======================MONGO MODELS============================
var DriverModels = require('../../models/driver/driver');
var mailProperty = require('../../modules/sendMail');

var loginRegister = {
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
    register: (data, callback) => {

        console.log(data);
        async.waterfall([
            function (nextCb) {
                if (!data.email || typeof data.email === undefined) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide email address",
                        "response_data": {}
                    });
                } else if (!data.password || typeof data.password === undefined) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide password",
                        "response_data": {}
                    });
                } else {
                    nextCb(null, {
                        "response_code": 2000,
                        "response_message": "please provide email address",
                        "response_data": {}
                    });
                }
            },
            function (arg1, nextCb) {
                if (arg1.response_code == 2000) {
                    //data._id = new ObjectID;
                    var token = "";
                    if (data.mobileVerify === '1') {
                        token = jwt.sign({
                            email: data.email
                        }, config.secretKey, {
                            expiresIn: '2h'
                        });
                    }
                    let driverSchema = {

                        _id: new ObjectID,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        location: data.location,
                        address: data.address,
                        licenceNo: '',
                        ssnNo: '',
                        idOrpassportNo: data.idOrpassportNo,
                        mobile: data.mobile,
                        mobileVerify: '0',
                        email: data.email,
                        emailVerify: '0',
                        password: data.password,
                        state: '',
                        city: '',
                        zip: '',
                        country: '',
                        rating: '',
                        profileImage: data.profileImage,
                        documentImage: [],
                        type: 'NORMAL',
                        socialLogin: [],
                        birthDay: '',
                        rideDemandDestination: [],
                        twoardsSourceDestination: [],
                        uniqueCode: '',
                        usedRefferalCode: '',
                        totalRideBalance: '0',
                        loginStatus: 'yes',
                        accountDeleteStatus: 'no',
                        blockStatus: 'no',
                        authToken: token,
                        appType: data.appType,
                        deviceToken: data.deviceToken ? data.deviceToken : ''

                    };
                    console.log(driverSchema);
                    DriverModels.addDriver(driverSchema, function (result) {
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
                    // mailProperty('userMail')(data.email, {
                    //     name: data.firstName+' '+data.lastName,
                    //     email: data.email,
                    //     email_validation_url: arg1.response_data
                    // }).send();
                    nextCb(null, {
                        response_code: 2000,
                        response_message: 'You have succesfully registered. Please check your email address and varify your email .',
                        response_data: arg1.data
                    });
                } else {
                    nextCb(null, arg1);
                }
            }
        ], function (err, result) {
            if (err) {
                console.log("Erroreee  " + err)
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
    registerSocial: (data, callback) => {

        console.log(data);
        async.waterfall([
            function (nextCb) {
                if (!data.email || typeof data.email === undefined) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide email address",
                        "response_data": {}
                    });
                } else if (!data.mobile || typeof data.mobile === undefined) {
                    nextCb(null, {
                        "response_code": 5002,
                        "response_message": "please provide phone no",
                        "response_data": {}
                    });
                } else {
                    nextCb(null, {
                        "response_code": 2000,
                        "response_message": "Success",
                        "response_data": {}
                    });
                }
            },
            function (arg1, nextCb) {
                if (arg1.response_code == 2000) {
                    var token = "";
                    if (data.mobileVerify === '1') {
                        token = jwt.sign({
                            email: data.email
                        }, config.secretKey, {
                            expiresIn: '2h'
                        });
                    }

                    //data._id = new ObjectID;
                    let driverSchema = {

                        _id: new ObjectID,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        location: data.location,
                        address: data.address,
                        licenceNo: '',
                        ssnNo: '',
                        idOrpassportNo: data.idOrpassportNo,
                        mobile: data.mobile,
                        mobileVerify: '0',
                        email: data.email,
                        emailVerify: '0',
                        password: data.password,
                        state: '',
                        city: '',
                        zip: '',
                        country: '',
                        rating: '',
                        profileImage: data.profileImage,
                        documentImage: [],
                        type: data.type,
                        socialLogin: [data.socialLogin],
                        birthDay: '',
                        rideDemandDestination: [],
                        twoardsSourceDestination: [],
                        uniqueCode: '',
                        usedRefferalCode: '',
                        totalRideBalance: '0',
                        loginStatus: 'yes',
                        accountDeleteStatus: 'no',
                        blockStatus: 'no',
                        authToken: token,
                        appType: data.appType,
                        deviceToken: data.deviceToken ? data.deviceToken : ''

                    };
                    //return console.log(userSchema);
                    DriverModels.addDriver(driverSchema, function (result) {
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
                    // mailProperty('userMail')(data.email, {
                    //     name: data.firstName+' '+data.lastName,
                    //     email: data.email,
                    //     email_validation_url: arg1.response_data
                    // }).send();
                    nextCb(null, {
                        response_code: 2000,
                        response_message: 'You have succesfully registered. Please check your email address and varify your email .',
                        response_data: arg1.data
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
    checkSocial: (data, callback) => {

        if (!data.socialLogin) {
            callback({
                "response_code": 5002,
                "response_message": "please provide social details",
                "response_data": {}
            });
        }
        if (!data.image) {
            callback({
                "response_code": 5002,
                "response_message": "please provide image",
                "response_data": {}
            });
        } else {
            DriverModels.checkSocialLogin(data, function (result) {
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
        if (!data.forgotPassword) {
            callback({
                "response_code": 5002,
                "response_message": "please provide forgot password",
                "response_data": {}
            });
        } else {
            if (data.forgotPassword === "0") {
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
        } else {
            DriverModels.changepassword(data, function (result) {
                callback(result);
            });
        }
    },
    profileImageUpload: (data, files, callback) => {
        if (!files) {
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
            DriverModels.imageUpload(data, files.image, function (result) {
                callback(result);
            });
        }
    },

    sentOTP: (data, callback) => {
        if (!data.mobile) {
            callback({
                "response_code": 5002,
                "response_message": "please provide mobile no",
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
            DriverModels.generateOTP(data, function (result) {
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
        } else {
            DriverModels.verifyOTP(data, function (result) {
                callback(result);
            });
        }
    },


    login: (data, callback) => {
        if (!data.mobile) {
            callback({
                "response_code": 5002,
                "response_message": "please provide user phone no",
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
                "response_message": "please provide app type",
                "response_data": {}
            });
        } else {
            DriverModels.login(data, function (result) {
                callback(result);
            });
        }
    },
    addCar: (data, callback) => {
        if (!data.driver) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        } else if (!data.vehicleNo) {
            callback({
                "response_code": 5002,
                "response_message": "please provide vehicle no",
                "response_data": {}
            });
        } else if (!data.noOfSeats) {
            callback({
                "response_code": 5002,
                "response_message": "please provide No of seats",
                "response_data": {}
            });
        } else if (!data.color) {
            callback({
                "response_code": 5002,
                "response_message": "please provide Color",
                "response_data": {}
            });
        } else if (!data.type) {
            callback({
                "response_code": 5002,
                "response_message": "please provide Type",
                "response_data": {}
            });
        } else {
            DriverModels.addCarModel(data, function (result) {
                callback(result);
            });
        }
    },
    deleteCar: (data, callback) => {
        if (!data.driver) {
            callback({
                "response_code": 5002,
                "response_message": "please provide driver id",
                "response_data": {}
            });
        } else if (!data.carId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide vehicle no",
                "response_data": {}
            });
        } else {
            DriverModels.deleteCarModel(data, function (result) {
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
        } else {
            DriverModels.getProfileDetails(data, function (result) {
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
        if (!data.address) {
            callback({
                "response_code": 5002,
                "response_message": "please provide address",
                "response_data": {}
            });
        }
        if (!data.idOrpassportNo) {
            callback({
                "response_code": 5002,
                "response_message": "please ID No",
                "response_data": {}
            });
        } else {
            DriverModels.setProfileDetails(data, function (result) {
                callback(result);
            });
        }
    },
    getCarList: (data, callback) => {

        if (!data.userId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide userId",
                "response_data": {}
            });
        } else {
            DriverModels.getAllCarList(data, function (result) {
                callback(result);
            });
        }
    },
    driverDocumentImageUpload: (data, files, callback) => {
        if (!files) {
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
        } else if (!data.type) {
            callback({
                "response_code": 5002,
                "response_message": "please provide type",
                "response_data": {}
            });
        } else {
            DriverModels.modelDriverDocumentImageUpload(data, files.image, function (result) {
                callback(result);
            });
        }
    },
    carDocumentImageUpload: (data, files, callback) => {
        if (!files) {
            callback({
                "response_code": 5002,
                "response_message": "please select image",
                "response_data": {}
            });
        }
        if (!data.carId) {
            callback({
                "response_code": 5002,
                "response_message": "please provide carId",
                "response_data": {}
            });
        }
        if (!data.type) {
            callback({
                "response_code": 5002,
                "response_message": "please provide type",
                "response_data": {}
            });
        } else {
            // console.log(data.type);

            // console.log(data.type !== "INSURANCE" && data.type !== "REGISTRATION");

            if (data.type !== "INSURANCE" && data.type !== "REGISTRATION") {
                callback({
                    "response_code": 5002,
                    "response_message": "type only will be INSURANCE and  REGISTRATION",
                    "response_data": {}
                });
            } else {
                DriverModels.modelCarDocumentImageUpload(data, files.image, function (result) {
                    callback(result);
                });
            }

        }
    },
    getCarTypeService: (callback) => {


        DriverModels.getCarTypeModel(function (result) {
            callback(result);
        });


    }
}
module.exports = loginRegister;