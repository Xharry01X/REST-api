const express=require("express")
const authRouting=require("./route/authRouting")
const app=express()
require("dotenv").config()

const port=process.env.APP_PORT || 5000

app.use("/",authRouting)

app.listen(port,()=>{
    console.log(`Server live at ${port}`);
})