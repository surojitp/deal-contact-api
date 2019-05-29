'use strict';
//var express = require("express");
var buyerLoginRegister = require('../services/buyerServices/buyerLoginRegister');
var bodyParser = require('body-parser');
var config = require('../config');
var jwt = require('jsonwebtoken');

var secretKey = config.secretKey;



module.exports = function (app, express) {

    var api = express.Router();
    api.use(bodyParser.json());
    api.use(bodyParser.urlencoded({
        extended: false
    }));

    api.post('/register', function (req, res) {
        buyerLoginRegister.register(req.body, function (result) {
            res.send(result)
        })
    });

    api.post('/login', function (req, res) {
        //console.log("Bodyyyyy" + JSON.stringify(req.body))
        buyerLoginRegister.login(req.body, function (result) {
            console.log(`REsponce ${JSON.stringify(result)}`)
            res.send(result)
        })

    });
    api.post('/sent-otp', function (req, res) {
        buyerLoginRegister.sentOTP(req.body, function (result) {
            res.send(result)
        })

    });
    api.post('/verify-otp', function (req, res) {

        buyerLoginRegister.verifyOTP(req.body, function (result) {
            res.send(result)
        })

    });
    api.post('/change-password', function (req, res) {
        buyerLoginRegister.jwtAuthVerification(req.headers, function (auth) {
            if (auth.response_code == 2000) {
                buyerLoginRegister.setPassword(req.body, function (result) {
                    res.send(result)
                })
            } else if (auth.response_code == 4001) {
                res.send(auth);
            } else {
                res.send(auth);
            }
        });
    });
    return api;
}

function checkToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token);
    if (token) {


        jwt.verify(token, secretKey, function (err, decoded) {
            console.log("req.user : ", decoded, err);

            if (err) {


                res.status(403).json({
                    success: false,
                    message: "failed to authenticate"
                });
            } else {
                req.user = decoded;
                console.log("req.user : ", req.user);
                return next();
            }
        });
    } else {
        res.status(403).json({
            success: false,
            message: "token required"
        });
    }
}