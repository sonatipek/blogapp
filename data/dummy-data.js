const Category = require('../models/category');
const Blog = require('../models/blog');
const Role = require('../models/role');

const slugfield = require('../helpers/slugfield');

async function syncSQL() {
    await Blog.sync({alter: true});
    await Category.sync({alter: true});
    await Role.sync({alter: true});

    const count = await Category.count()

    if (count === 0) {

        await Category.bulkCreate([
            {category_name: "Portfolio", url: slugfield("Portfolio")},
            {category_name: "Software", url: slugfield("Software")},
            {category_name: "Web Frameworks", url: slugfield("Web Frameworks")},

        ]);

        await Role.bulkCreate([
            {role_name: "admin"},
            {role_name: "moderator"},
            {role_name: "guest"},
        ])


        await Blog.create({
            title: "Lorem",
            url: slugfield("Lorem"),
            summary: "Lorem ipsum",
            description: "Lorem ipsum dolor sit amet",
            image: "1.jpg",
            isShownOnPage: 1,
            isActive: 1
        })

        await Blog.create({
            title: "Lorem 2",
            url: slugfield("Lorem 2"),
            summary: "Lorem ipsum 2",
            description: "Lorem ipsum dolor sit amet 2",
            image: "2.jpg",
            isShownOnPage: 1,
            isActive: 1
        })

    }
}

module.exports = syncSQL;

// 3 diffrent ways to create datas
/*
    *Version -1
    ? Created but not sync to database
        const category1 = Category.build({category_name: "Portfolio"})
    ? Sync to database  
        await category1.save();

*/

/*
    *Version -2
    ?You can assign to the variable if you want
    const category1 = Category.create({
        name: "Portfolio"
    })
    Category.create({
        name: "Portfolio"
    }) 
*/

//? Bulk Create
//*Version -3
// await Category.bulkCreate([
//     {category_name: "Portfolio"},
//     {category_name: "Software"},
//     {category_name: "Web Frameworks"},

// ])