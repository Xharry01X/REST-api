const express=require("express")
const { signUp } = require( "../controller/authController" )

const router=express.Router()

router.route("/signUp").post(signUp)

module.exports=router