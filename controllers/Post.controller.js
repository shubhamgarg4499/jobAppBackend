const Post = require('../models/Post.model');
const user = require('../models/User.models');
const ErrorHandler = require('../others/ErrorHandler.class');

exports.createPost = async (req, res, next) => {
    try {
        const { title, content, id, likes = 0, comments = [] } = req?.body;
        if (!title) return next(new ErrorHandler(400, "Title is required"))
        if (!content) return next(new ErrorHandler(400, "Post can't be empty"))
        if (!id) return next(new ErrorHandler(400, "Poster (user ID) is required"));

        const findUser = await user.findById(id)
        if (!findUser) return next(new ErrorHandler(404, "User not found"))
        if (!findUser.isEmailVerified || !findUser.isPhoneVerified) return next(new ErrorHandler(400, "User must be verified"))

        const post = await Post.create({
            title,
            content,
            poster: id,
            likes,
            comments
        })

        res.status(201).json({ post: post, message: "Post created successfully", success: true })
    } catch (error) {
        return next(new ErrorHandler(error.status || 500, error.message || "Internal Server Error"));
    }
}

exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('poster', 'name');
        res.status(200).json({ success: true, posts });
    } catch (error) {
        next(new ErrorHandler(500, error.message || 'Failed to fetch posts.'));
    }
};

exports.getPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate('poster', 'name');
        if (!post) return next(new ErrorHandler(404, 'Post not found.'));
        res.status(200).json({ success: true, post });
    } catch (error) {
        next(new ErrorHandler(500, error.message || 'Failed to fetch the post.'));
    }
};

exports.updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, poster } = req.body;

        if (!title && !content) return next(new ErrorHandler(400, 'Nothing to update.'));
        if (!poster) return next(new ErrorHandler(400, "Poster (User ID) required"));

        const findPost = await Post.findById(id).populate('poster', '_id');
        if (!findPost) return next(new ErrorHandler(404, 'Post not found.'));

        if (findPost.poster._id.toString() !== poster) return next(new ErrorHandler(403, "Only original poster can edit"));
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: { title, content } },
            { new: true }
        );

        if (!updatedPost) return next(new ErrorHandler(404, 'Post not found.'));
        res.status(200).json({ success: true, message: 'Post updated successfully.', post: updatedPost });
    } catch (error) {
        next(new ErrorHandler(500, error.message || 'Failed to update the post.'));
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) return next(new ErrorHandler(404, 'Post not found.'));
        res.status(200).json({ success: true, message: 'Post deleted successfully.' });
    } catch (error) {
        next(new ErrorHandler(500, error.message || 'Failed to delete the post.'));
    }
};

exports.likePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) return next(new ErrorHandler(404, 'Post not found.'));

        post.likes += 1;
        await post.save();

        res.status(200).json({ success: true, message: 'Post liked successfully.', likes: post.likes });
    } catch (error) {
        next(new ErrorHandler(500, error.message || 'Failed to like the post.'));
    }
};

exports.addComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content, poster } = req.body;

        if (!content) return next(new ErrorHandler(400, 'Comment content is required.'));

        const post = await Post.findById(id);
        if (!post) return next(new ErrorHandler(404, 'Post not found.'));

        const comment = {
            content,
            poster: poster,
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json({ success: true, message: 'Comment added successfully.', comments: post.comments });
    } catch (error) {
        next(new ErrorHandler(500, error.message || 'Failed to add the comment.'));
    }
};