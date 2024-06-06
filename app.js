const express=require("express")
const authRouting=require("./route/authRouting")
const app=express()

const port=4000

app.use("/",authRouting)

app.listen(port,()=>{
    console.log(`Server live at ${port}`);
})