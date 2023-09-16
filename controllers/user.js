// Create Models
const Blog = require('../models/blog');
const Category = require('../models/category');

exports.blogByCategory = async (req, res) => {
    try {
        const url = req.params.slug;

        const blogs = await Blog.findAll({
            where:{
                isActive: true
            },
            include:{
                model: Category,
                where: {
                    url: url
                }
            },
            raw: true
        });
        const categories = await Category.findAll({raw: true});
        

        res.render("pages/category-list", {
            blogs: blogs,
            categories: categories,
            selectedCategory: url
        }) 
    } catch (err) {
        console.log(err);
    }
}

exports.blogDetail = async (req, res) => {
    try {
        const blogs = await Blog.findAll({raw: true});
        const categories = await Category.findAll({raw: true});
     
        
        if (req.params.slug) {
            res.render('pages/blog-detail', {blogs: blogs, categories: categories, url: req.params.slug});
        }else{
            res.render("pages/errors/404.ejs");
        }
    } catch (error) {
        console.log(error);
    }

}

exports.allBlogs = async (req, res) => {

    try {
        const blogs = await Blog.findAll({raw: true});
        const categories = await Category.findAll({raw: true});
       
    
        res.render('pages/blog', {
            blogs: blogs,
            categories: categories
        })
        
    } catch (err) {
        console.log(err);
    }

}

exports.homepage = async (req, res) => {
    try {
        const blogs = await Blog.findAll({raw: true});
        const categories = await Category.findAll({raw: true});
        
        res.render('pages/index', {
            blogs:blogs,
            categories: categories,
            isAuth: req.cookies.isAuth
        })
        
    } catch (err) {
        console.log(err);
    }

    
}