const mongoose = require('mongoose');

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
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);