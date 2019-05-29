var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');

//Create UserSchema
var cartypeSchema = new mongoose.Schema({
	year: {type: String},
    make: {type: String},
    model: {type: String},
    body: {type: String}
},{
    timestamps: true
});


// Export your module
module.exports = mongoose.model("CarType", cartypeSchema);
