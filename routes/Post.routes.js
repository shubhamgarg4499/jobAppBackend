const express = require('express')
const isAdmin = require('../middleswares/isAdmin')
const verifyTokenMiddleware = require('../middleswares/verifyJWT.middlewares')
const { createPost, getAllPosts, getPostById, updatePost, deletePost, likePost, addComment } = require('../controllers/Post.controller')
const postRouter = express.Router()

postRouter.post('/create', verifyTokenMiddleware, createPost);
postRouter.get('/listall', verifyTokenMiddleware, getAllPosts); 
postRouter.get('/detailone/:id', verifyTokenMiddleware, getPostById); 
postRouter.put('/update/:id', verifyTokenMiddleware, updatePost); 
postRouter.delete('/delete/:id', verifyTokenMiddleware, isAdmin, deletePost);
postRouter.post('/like/:id', verifyTokenMiddleware, likePost); 
postRouter.post('/comment/:id', verifyTokenMiddleware, addComment);

module.exports = postRouter;