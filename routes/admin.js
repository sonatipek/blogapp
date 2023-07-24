// Requirements
const express = require('express');
const db = require('../data/db');
const { upload } = require('../helpers/imageupload');
const fs = require('fs');

// Create router
const router = express.Router();


// !Category Routes
// Get Category Create Page
router.get('/category/create', (req, res) => {
    res.render('admin/category-create');
});

// Create Category
router.post('/category/create', async (req, res) => {
    const categoryName = req.body.category_name;

    try {
        await db.execute('INSERT INTO category(category_name) VALUES(?)', [categoryName]);;

        res.redirect('/admin/categories?action=create');
    } catch (err) {
        console.log(err);
    }
});

// Get Category İnformation
router.get('/categories/:categoryid', async (req, res) => {
    const categoryID = req.params.categoryid;
    try {

        const [categories, ] = await db.execute('select * from category where category_id = ?', [categoryID]);
        const category = categories[0];

        return res.render('admin/category-edit', {category});   
    
    } catch (error) {
        console.error(error);
    }
});

// Update Category
router.post('/categories/:categoryid', async (req, res) => {
    const categoryID = req.params.categoryid;
    const categoryIDServer = req.body.categoryid;
    const categoryName = req.body.category;

    try {
        if (categoryID == categoryIDServer) {
            await db.execute('UPDATE category SET category_name = ? where category_id = ?', [categoryName, categoryIDServer]);
    
            return res.redirect('/admin/categories?action=update') 
        }
            res.redirect('/admin/categories?action=error') 
    } catch (error) {
        console.error(error);
    }
});

// Delete Category
router.use('/categories/delete/:categoryid', async (req, res) => {
    const categoryID = req.params.categoryid;

    try {
        await db.execute('delete from category WHERE category_id = ?', [categoryID]);
        
        res.redirect('/admin/categories?action=delete');
    } catch (error) {
        console.error(error);
    }
});

// Get Category List
router.get('/categories', async (req, res) => {
    const action = req.query.action;

    try {
        const [categories, ] = await db.execute('select * from category');
        
        res.render('admin/category-list', {categories, action});
    } catch (error) {
        console.error(error);
    }
});


// ! Blogs Routes
// Get Blog Create Page
router.get('/blog/create', async (req, res) => {
    try {
        const [categories, ] = await db.execute("select * from category");
        
        res.render('admin/blog-create', {categories});
    } catch (err) {
        console.error(err)
    }

});

// Post Blog
router.post('/blog/create', upload.single('image'), async (req, res) => {
    const title = req.body.title,
        desc = req.body.desc,
        image = req.file.filename,
        category = req.body.category,
        isShownHomepage = req.body.isShownHomepage  === "on" ? 1 : 0;

    try {
        await db.execute("INSERT INTO blogs(title, descr, img, is_shown_homepage, category) VALUES(?,?,?,?,?)", [
            title, desc, image, isShownHomepage, category, 
        ]);
        
        res.redirect('/admin/blogs?action=create');

    } catch (err) {
        console.error(err)
    }
});

// Delete Blog
router.get('/blogs/delete/:blogid', async (req, res) => {
    const blogID = req.params.blogid;

    try {
        await db.execute('DELETE FROM blogs WHERE blogid = ?', [blogID])

        res.redirect('/admin/blogs?action=delete')
    } catch (err) {
        console.log(err);
    }
});

// Get Blog List Page
router.get('/blogs/:blogid', async (req, res) => {
    const blogID = req.params.blogid;
    try {
        const [blogs, ] = await db.execute('SELECT * FROM blogs WHERE blogid = ?', [blogID])
        const blog = blogs[0]

        const [categories, ] = await db.execute('SELECT * FROM category');


        
        if (blog) {
            return res.render('admin/blog-edit', {categories, blog});
        }
        res.redirect('/admin/blogs')
    } catch (err) {
        console.log(err);
    }
});

// Update Blogs
router.post('/blogs/:blogid', upload.single('image'), async (req, res) => {
    const blogID = req.params.blogid,
        blogIDServer = req.body.blogid,
        title = req.body.title,
        desc = req.body.desc,
        image = req.file ? req.file.filename : req.body.imageServer,
        isShownHomepage = req.body.isShownHomepage  === "on" ? 1 : 0,
        category = req.body.category;


    try {
        if (blogID === blogIDServer) {
            await db.execute('UPDATE blogs SET title=?, descr=?, img=?, is_shown_homepage=?, category=? WHERE blogid = ?', [
                title, desc, image, isShownHomepage, category, blogID
            ])

            if (req.file) {
                fs.unlink(`./public/img/${req.body.imageServer}`, err => {
                    console.error(err);
                })
            }
            return res.redirect('/admin/blogs?action=update');
        }
        res.redirect('/admin/blogs?error=true')
        
    } catch (err) {
        console.log(err);
    }
});

// List Blogs
router.use('/blogs', async (req, res) => {
    const action = req.query.action;
    
    try {
        const [blogs,] = await db.execute('SELECT blogid, title, img FROM blogs')


        res.render('admin/blog-list', {blogs, action});
    } catch (err) {
        console.log(err);
    }
});

// Dashboard
router.use('', (req, res) => {
    res.render('admin/dashboard');
});

module.exports=router;