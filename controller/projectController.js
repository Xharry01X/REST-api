const catchAsync = require( "../utils/catchAsync" );
const Project=require("../db/models/project")
const createProject = catchAsync(async (req, res, next) => {
    try {
      const { title, isFeatured, productImage, price, shortDescription, description, productUrl, category, tags } = req.body;
      const userId=req.user.id;
  
      // Convert to arrays if they aren't already
      const productImageArray = Array.isArray(productImage) ? productImage : [productImage];
      const categoryArray = Array.isArray(category) ? category : [category];
      const tagsArray = Array.isArray(tags) ? tags : [tags];
  
      const newProject = await Project.create({
        title,
        isFeatured: isFeatured || false,
        productImage: productImageArray,
        price,
        shortDescription,
        description,
        productUrl,
        category: categoryArray,
        tags: tagsArray,
        createdBy: userId, // Replace with actual user ID in a real scenario
      });
  
      return res.status(201).json({
        status: 'success',
        data: newProject,
      });
    } catch (error) {
      // Log the error (optional)
      console.error('Error creating project:', error);
  
      // Pass the error to the next middleware
      return next(error);
    }
  });
  
  module.exports = { createProject };
  