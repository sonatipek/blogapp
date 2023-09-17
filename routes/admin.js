// Requirements
const express = require('express');
const { upload } = require('../helpers/imageupload');
const routeProtection = require('../middlewares/routeProtection')

// Controllers
const adminController = require('../controllers/admin');


// Create router
const router = express.Router();

// !Routers
// Category Routes
router.get('/category/create',routeProtection, adminController.getCreateCategory);

router.post('/category/create', routeProtection, adminController.postCreateCategory);

router.get('/categories/:slug', routeProtection, adminController.getUpdateCategory);

router.post('/categories/:slug', routeProtection, adminController.postUpdateCategory);

router.get('/categories/delete/:categoryid', routeProtection, adminController.deleteCategory);

router.get('/categories',routeProtection, adminController.listCategory);


// Blogs Routes
router.get('/blog/create', routeProtection, adminController.getCreateBlog);

router.post('/blog/create', routeProtection, upload.single('blog_image'), adminController.postCreeateBlog);

router.get('/blogs/:slug', routeProtection, adminController.getUpdateBlog);

router.post('/blogs/:slug', routeProtection, upload.single('image'), adminController.postUpdateBlog);

router.get('/blogs/delete/:blogid',routeProtection, adminController.deleteBlog);

router.get('/blogs', routeProtection, adminController.listBlog);

module.exports=router;