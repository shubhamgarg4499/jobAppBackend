const mongoose = require('mongoose');

const address = new mongoose.Schema({
    street: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    country: {
        type: String
    },

})

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry: {  
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    ceoName: {
        type: String,
        required: true
    },
    number: { 
        type: String,
        required: true
    },
    website: { 
        type: String,
        required: true
    },
    size: { 
        type: String,
        required: true
    },
    foundedIn: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    gstNumber: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        default: null,
    },
    address: address,
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);