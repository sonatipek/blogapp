// Requirements
const fs = require('fs');
const slugField = require('../helpers/slugfield');

// Create Models
const Blog = require('../models/blog');
const Category = require('../models/category');
const Role = require('../models/role');

// Category Routes
exports.getCreateCategory = async (req, res) => {
    res.render('admin/category-create', {csrfToken: req.csrfToken()});
}

exports.postCreateCategory = async (req, res) => {
    const categoryName = req.body.category_name;

    try {
        await Category.create({category_name: categoryName, url: slugField(categoryName)});

        res.redirect('/admin/categories?action=create');
    } catch (err) {
        console.log(err);
    }
}

exports.getUpdateCategory = async (req, res) => {
    const url = req.params.slug;
    try {
        const [category, ] = await Category.findAll({
            raw: true,
            where: {
                url: url
            }
        })

        return res.render('admin/category-edit', {category, csrfToken: req.csrfToken()});   
    
    } catch (error) {
        console.error(error);
    }
}

exports.postUpdateCategory = async (req, res) => {
    const url = req.params.slug;
    const urlServer = req.body.categoryurl;
    const categoryName = req.body.category;

    try {
        if (url == urlServer) {       
            await Category.update({
                category_name: categoryName
            },{
                where: {
                    url: url
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
        
        res.render('admin/blog-create', {categories, csrfToken: req.csrfToken()});
    } catch (err) {
        console.error(err)
    }

}

exports.postCreeateBlog = async (req, res) => {
    try {
    
        await Blog.create({
            title: req.body.title,
            url: slugField(req.body.title),
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
    const url = req.params.slug;

    try {
        const blog = await Blog.findOne({
            where: {
                url: url
            },
            raw: true
        });
        const categories = await Category.findAll({raw:true});    

        
        if (blog) {
            return res.render('admin/blog-edit', {
                categories, 
                blog, 
                csrfToken: req.csrfToken()
            });
        }
        res.redirect('/admin/blogs')
    } catch (err) {
        console.log(err);
    }
}

exports.postUpdateBlog = async (req, res) => {
    const url = req.params.slug,
    urlServer = req.body.blogurl;

    try {
        if (url === urlServer) {
            await Blog.update({ 
                title: req.body.title,
                url: slugField(req.body.title),
                summary: req.body.summary,
                description: req.body.description,
                image: req.file ? req.file.filename : req.body.imageServer,
                isShownOnPage: req.body.isActiveOnPage  === "on" ? 1 : 0,
                isActive: req.body.isActive  === "on" ? 1 : 0,
                categoryId: req.body.category
            }, {
                where: {
                    url: url
                }
            });

            console.log(req.body.category)

            if (req.file) {
                fs.unlink(`./public/img/${req.body.imageServer}`, err => {
                    console.error(err);
                })
            }
            return res.redirect('/admin/blogs?action=update');
        }
        res.redirect('/admin/blogs?action=error')
        
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

        res.render('admin/blog-list', {blogs, action, cs});
    } catch (err) {
        console.log(err);
    }
}

// Role Controllers
exports.getUpdateRole = async (req,res) => {
    const id = req.params.roleid;

    const role = await Role.findOne({
        where: {
            id: id
        },
        raw: true
    });
    
    try {
        return res.render('admin/role-edit', {role, csrfToken: req.csrfToken()});

    } catch (error) {
        console.log(error);
    }
}

exports.postUpdateRole = async (req,res) => {
    const id = req.params.roleid, 
    roleIdFromServer = req.body.roleid, 
    roleName = req.body.rolename;

    try {

        if (id === roleIdFromServer) {
            await Role.update({ 
                role_name: roleName
            }, {
                where: {
                    id: roleIdFromServer
                }
            });

            return res.redirect('/admin/roles?action=update');
        }
    
    
        return res.redirect('/admin/roles?action=error');

    } catch (error) {
        console.log(error);
    }
}

exports.listRoles = async (req, res) => {
    const action = req.query.action;
    const roles = await Role.findAll({raw:true});

    try {
        return res.render('admin/roles-list', {action, roles});
    } catch (error) {
        console.log(error);
    }
}