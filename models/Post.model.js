const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    poster: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);