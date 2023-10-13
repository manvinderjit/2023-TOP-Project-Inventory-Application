import Category from "../models/categories.js";

// Display all categories
const categoryList = async(req, res, next) => {
    try {
        const allCategories = await Category.find().sort({ name: 1 }).exec();
        res.render('index', {
            title: 'Inventory Application',
            all_categories: allCategories,
        });
    } catch (error) {
        console.error(error);
    }
}

// Display details for one category
const categoryDetail = async(req, res, next) => {
    try {
        const category = await Category.findById(req.params.id).exec();
        if(category === null) {

        } else {
            res.render("categoryDetail", {
              _id: category._id,
              title: category.name,
              name: category.name,
              description: category.description,
              url: category.url,
            });
        }
        
    } catch (error) {
        console.error(error);
    }
}

// Add a New Category
const createCategoryPost = async(req, res, next) => {
    try {
        const category = new Category({
          name: req.body.nameCategory,
          description: req.body.descriptionCategory,
        });
        await category.save();
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
}

// Display details for one category to be deleted
const deleteCategoryDetails = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();
    if (category === null) {
    } else {
      res.render("categoryDelete", {
        _id: category._id,
        title: category.name,
        name: category.name,
        description: category.description,
        url: category.url,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Delete a Category
const deleteCategory = async(req, res, next) => {
    try {
        console.log("called" + req.body)
        await Category.findByIdAndRemove(req.body.categoryId);
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
}

export {
  categoryList,
  createCategoryPost,
  categoryDetail,
  deleteCategory,
  deleteCategoryDetails,
};
