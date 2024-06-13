const express=require("express")
const { createProject } = require( "../controller/projectController" )
const projectRouter=express.Router()

projectRouter.route("/create").post(createProject)

module.exports=projectRouter