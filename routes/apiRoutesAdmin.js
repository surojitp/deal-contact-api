'use strict';
var express = require("express");
var commonService = require('../services/adminServices/adminCommonService');
var bodyParser = require('body-parser');
var config = require('../config');
var jwt = require('jsonwebtoken');

var secretKey = config.secretKey;





    var api = express.Router();
    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({
        extended: false
    }));

    api.post('/add-vehicle-type', function (req, res) {
       
        commonService.addVehicleTypeService(req.body, function (result) {
            
            res.send(result)
        })
    });

    api.post('/adminSignup', function (req, res) {
        var adminData = req.body;
        commonService.adminSignup(adminData, function (response) {
          res.send(response);
        });
    });
    api.post('/adminLogin', function (req, res) {
        var adminData = req.body;
        commonService.adminLogin(adminData, function (response) {
          res.send(response);
        });
    });

    api.post('/createUser', function (req, res) {
        var adminData = req.body;
        commonService.createUserService(adminData, function (response) {
          res.send(response);
        });
    });
    api.post('/carDetailsUpload', function (req, res) {
        var adminData = req.body;
        commonService.carDetailsUploadService(adminData, req.files, function (response) {
          res.send(response);
        });
    });

    api.post('/listUser', function (req, res) {
        console.log(req.headers);
        
        commonService.jwtAuthVerification(req.headers, function (auth) {
            console.log(11111111111,auth);
            
            if (auth.STATUSCODE == 2000) {
                var adminData = req.body;
                commonService.getUserDataService(adminData, function (response) {
                  res.send(response);
                });
            } else if (auth.STATUSCODE == 4001) {
                res.send(auth);
            } else {
                res.send(auth);
            }
        });
        
    });


    // api.post('/profile-image-upload', function (req, res) {
    //     loginRegister.profileImageUpload(req.body, req.files, function (result) {
    //         res.send(result)
    //     })

    // });

    // api.post('/get-user-profile', function (req, res) {
    //     loginRegister.jwtAuthVerification(req.headers, function (auth) {
    //         if (auth.response_code == 2000) {
    //             loginRegister.profileDetails(req.body, function (result) {
    //                 res.send(result)
    //             })
    //         } else if (auth.response_code == 4001) {
    //             res.send(auth);
    //         } else {
    //             res.send(auth);
    //         }
    //     });
    // });

    module.exports = api;