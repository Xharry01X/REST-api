const expressAsyncHandler=require("express-async-handler")

const signUp=expressAsyncHandler(async(req,res)=>{
    res.send("Hii")
})

module.exports={signUp}