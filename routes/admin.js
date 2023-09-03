// Requirements
const express = require('express');
const { upload } = require('../helpers/imageupload');
// Controllers
const adminController = require('../controllers/admin');


// Create router
const router = express.Router();

// !Routers
// Category Routes
router.get('/category/create', adminController.getCreateCategory);

router.post('/category/create', adminController.postCreateCategory);

router.get('/categories/:categoryid', adminController.getUpdateCategory);

router.post('/categories/:categoryid', adminController.postUpdateCategory);

router.use('/categories/delete/:categoryid', adminController.deleteCategory);

router.get('/categories', adminController.listCategory);


// Blogs Routes
router.get('/blog/create', adminController.getCreateBlog);

router.post('/blog/create', upload.single('blog_image'), adminController.postCreeateBlog);

router.get('/blogs/:blogid', adminController.getUpdateBlog);

router.post('/blogs/:blogid', upload.single('image'), adminController.postUpdateBlog);

router.get('/blogs/delete/:blogid', adminController.deleteBlog);

router.use('/blogs', adminController.listBlog);

module.exports=router;