// Requirements
const fs = require('fs');

// Create Models
const Blog = require('../models/blog');
const Category = require('../models/category');

// Category Routes
exports.getCreateCategory = async (req, res) => {
    res.render('admin/category-create');
}

exports.postCreateCategory = async (req, res) => {
    const categoryName = req.body.category_name;

    try {
        await Category.create({category_name: categoryName});

        res.redirect('/admin/categories?action=create');
    } catch (err) {
        console.log(err);
    }
}

exports.getUpdateCategory = async (req, res) => {
    const categoryID = req.params.categoryid;
    try {
        const [category, ] = await Category.findAll({
            raw: true,
            where: {
                id: categoryID
            }
        })
        console.log(category);

        return res.render('admin/category-edit', {category});   
    
    } catch (error) {
        console.error(error);
    }
}

exports.postUpdateCategory = async (req, res) => {
    const categoryID = req.params.categoryid;
    const categoryIDServer = req.body.categoryid;
    const categoryName = req.body.category;

    try {
        if (categoryID == categoryIDServer) {       
            await Category.update({
                category_name: categoryName
            },{
                where: {
                    id: categoryID
                }
            })

            return res.redirect('/admin/categories?action=update') 
        }
            res.redirect('/admin/categories?action=error') 
    } catch (error) {
        console.error(error);
    }
}

exports.deleteCategory = async (req, res) => {
    const categoryID = req.params.categoryid;

    try {
        await Category.destroy({
            where:{
                id: categoryID
            }
        });
        
        res.redirect('/admin/categories?action=delete');
    } catch (error) {
        res.redirect('/admin/categories?action=error');
        console.error(error);
    }
}

exports.listCategory = async (req, res) => {
    const action = req.query.action;

    try {
        const categories = await Category.findAll({raw: true})
        
        res.render('admin/category-list', {categories, action});
    } catch (error) {
        console.error(error);
    }
}


// Blogs Routes
exports.getCreateBlog = async (req, res) => {
    try {
        const categories = await Category.findAll({raw: true})
        
        res.render('admin/blog-create', {categories});
    } catch (err) {
        console.error(err)
    }

}

exports.postCreeateBlog = async (req, res) => {
    try {
    
        await Blog.create({
            title: req.body.title,
            summary: req.body.summary,
            description: req.body.description,
            image: req.file.filename,
            categoryId: req.body.category,
            isShownOnPage: req.body.isActiveOnPage  === "on" ? 1 : 0,
            isActive: req.body.isActive  === "on" ? 1 : 0
        })

        res.redirect('/admin/blogs?action=create');

    } catch (err) {
        console.error(err)
    }
}

exports.getUpdateBlog = async (req, res) => {
    const blogID = req.params.blogid;
    try {
        const blog = await Blog.findByPk(blogID,{raw:true});
        const categories = await Category.findAll({raw:true});    

        
        if (blog) {
            return res.render('admin/blog-edit', {categories, blog});
        }
        res.redirect('/admin/blogs')
    } catch (err) {
        console.log(err);
    }
}

exports.postUpdateBlog = async (req, res) => {
    const blogID = req.params.blogid,
        blogIDServer = req.body.blogid;

    try {
        if (blogID === blogIDServer) {
            await Blog.update({ 
                title: req.body.title,
                summary: req.body.summary,
                description: req.body.description,
                image: req.file ? req.file.filename : req.body.imageServer,
                isShownOnPage: req.body.isActiveOnPage  === "on" ? 1 : 0,
                isActive: req.body.isActive  === "on" ? 1 : 0,
                category: req.body.category
            }, {
                where: {
                  id: blogID
                }
            });

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
}

exports.deleteBlog = async (req, res) => {
    const blogID = req.params.blogid;

    try {
        const blog = await Blog.findByPk(blogID,{raw:true});

        await Blog.destroy({
            where:{
                id: blogID
            }
        });
        
        // Delete image from server
        fs.unlink(`./public/img/${blog.image}`, err => {
            console.error(err);
        })

        res.redirect('/admin/blogs?action=delete')
    } catch (err) {
        console.log(err);
    }
}

exports.listBlog = async (req, res) => {
    const action = req.query.action;
    
    try {
        const blogs = await Blog.findAll({raw: true})

        res.render('admin/blog-list', {blogs, action});
    } catch (err) {
        console.log(err);
    }
}