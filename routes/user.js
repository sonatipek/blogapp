// Requirements
const express = require('express');
// Controllers
const userController = require('../controllers/user');

// Create Router
const router = express.Router();


// User Routes
router.get('/blogs/category/:slug', userController.blogByCategory);

router.get("/blogs/:slug", userController.blogDetail);

router.get("/blogs", userController.allBlogs);

router.get("/", userController.homepage);



module.exports=router;