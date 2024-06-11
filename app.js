const express=require("express")
const authRouting=require("./route/authRouting")
const app=express()
require("dotenv").config()

const port=process.env.APP_PORT || 5000

app.use(express.json())

app.use("/api/auth",authRouting)

app.listen(port,()=>{
    console.log(`Server live at ${port}`);
})