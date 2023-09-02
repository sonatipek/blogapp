const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Category = sequelize.define("category", {
    // primary key will add by sequelize
    category_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    timestamps: false
});


async function syncSQL() {
    await Category.sync({force: true})
    console.info("Category table is added!")

    if (await Category.count() === 0) {
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
        await Category.bulkCreate([
            {category_name: "Portfolio"},
            {category_name: "Software"},
            {category_name: "Web Frameworks"},

        ])
        
        console.log("Veritabanına kayıt eklendi");
    }

}

syncSQL();

module.exports=Category;