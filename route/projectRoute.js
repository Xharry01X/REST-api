const express=require("express")
const { createProject, getAllProject, getProjectById, updateProduct, deleteProject } = require( "../controller/projectController" )
const { authentication, restrictTo } = require( "../controller/authController" )
const projectRouter=express.Router()

projectRouter.route("/create").post(authentication,restrictTo('seller'),createProject)
projectRouter.route("/").get(authentication,restrictTo("seller"),getAllProject)
projectRouter.route("/:id").get(authentication,restrictTo("seller"),getProjectById)
projectRouter.route("/:id").patch(authentication,restrictTo("seller"),updateProduct)
projectRouter.route("/:id").delete(authentication,restrictTo("seller"),deleteProject)
module.exports=projectRouter