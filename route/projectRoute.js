const express=require("express")
const { createProject } = require( "../controller/projectController" )
const { authentication } = require( "../controller/authController" )
const projectRouter=express.Router()

projectRouter.route("/create").post(authentication,createProject)

module.exports=projectRouter