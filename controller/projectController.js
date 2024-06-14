const catchAsync = require("../utils/catchAsync");
const Project = require("../db/models/project");
const AppError = require("../utils/appError");
const user = require("../db/models/user");

const createProject = catchAsync(async (req, res, next) => {
  try {
    const { title, isFeatured, productImage, price, shortDescription, description, productUrl, category, tags } = req.body;
    const userId = req.user.id;

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
      createdBy: userId,
    });

    return res.status(201).json({
      status: 'success',
      data: newProject,
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return next(error);
  }
});

const getAllProject = catchAsync(async (req, res, next) => {
  try {
    const userId=req.user.id;
    const result = await Project.findAll({ include: user,where:{createdBy:userId} });
    return res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppError("Failed to get projects", 403));
  }
});

const getProjectById = catchAsync(async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const result = await Project.findByPk(projectId, { include: user });

    if (!result) {
      return next(new AppError("Invalid project ID", 404));
    }

    return res.json({
      status: "success",
      data: result,
    });
  } catch (error) {
    return next(new AppError("Failed to get project by ID", 403));
  }
});

const updateProduct = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    const body = req.body;

    const result = await Project.findOne({ where: { id: projectId, createdBy: userId } });

    if (!result) {
      return next(new AppError("No project found with this ID for the current user", 404));
    }

    // Update the fields
    result.title = body.title || result.title;
    result.isFeatured = body.isFeatured !== undefined ? body.isFeatured : result.isFeatured;
    result.productImage = Array.isArray(body.productImage) ? body.productImage : result.productImage;
    result.price = body.price !== undefined ? body.price : result.price;
    result.shortDescription = body.shortDescription || result.shortDescription;
    result.description = body.description || result.description;
    result.productUrl = body.productUrl || result.productUrl;
    result.category = Array.isArray(body.category) ? body.category : result.category;
    result.tags = Array.isArray(body.tags) ? body.tags : result.tags;

    const updatedResult = await result.save();

    return res.json({
      status: "success",
      data: updatedResult,
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return next(new AppError("Failed to update project", 403));
  }
});

const deleteProject=catchAsync(async(req,res,next)=>{
 try {
   const userId=req.user.id;
   const productId=req.params.id;
   
   const result=await Project.findOne({where:{id:productId,createdBy:userId}})
   if (!result) {
    return next(new AppError("No project found with this ID for the current user", 404));
  }

  await result.destroy()

  return res.json({
    status: "success",
    message:"Record deleted"
  });

 } catch (error) {
  return next(new AppError("Failed to delete the record",404))
 }
})

module.exports = { createProject, getAllProject, getProjectById, updateProduct,deleteProject };
