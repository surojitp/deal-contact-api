var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var buyerschema = new Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    mobile: { type: String, default: '' },
    email: { type: String, default: '' },
    emailVerify: { type: String, enum: ['0', '1',], default: '0' },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHERS', 'NO'], default: 'NO' },
    address: { type: String, default: '' },
    password: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    loginStatus: {  type: String, enum: ['yes', 'no'], default: 'yes', default: 'yes'  },
    accountDeleteStatus: {  type: String, enum: ['yes', 'no'], default: 'yes', default: 'no'  },
    blockStatus: {  type: String, enum: ['yes', 'no'], default: 'yes', default: 'no' },
    authToken: { type: String, default: '' },
    appType: { type: String, enum: ['IOS', 'ANDROID', 'BROWSER',''], default: '' },
    deviceToken: { type: String, default: '' },
    rating: { type: Number, default: 0 },

    proofOfFunds: { type: String, default: '' },
    contacts: [{
        email: { type: String },
        phone: { type: String }
    }],
    company: { type: String, default: '' },
    allcash: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    hardMoney: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    rental: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    flip: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    escrowDeposit: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    stateYouOperate: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    onlinePresence: {  type: String, enum: ['yes', 'no'], default: 'no'  },
    investmentAssociation: {  type: String, enum: ['yes', 'no'], default: 'no'  },

    planType: { type: String, enum: ['0', '1', '3', '4'], default: '0' },
}, {
        timestamps: true
    });
buyerschema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    
    bcrypt.hash(user.password, null, null, function (err, hash) {
        if (err) {
            return next(err);
        }
        if(user.password !== ""){
            user.password = hash;
        }
        next();
    });
    
    
});
module.exports = mongoose.model('Buyer', buyerschema);