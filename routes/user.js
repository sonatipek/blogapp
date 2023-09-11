// Requirements
const express = require('express');
// Controllers
const userController = require('../controllers/user');

// Create Router
const router = express.Router();


// User Routes
router.use('/blogs/category/:slug', userController.blogByCategory);

router.use("/blogs/:slug", userController.blogDetail);

router.use("/blogs", userController.allBlogs);

router.use("/", userController.homepage);



module.exports=router;