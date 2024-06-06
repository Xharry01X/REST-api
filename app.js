import express from "express"
import router from "./route/authRoute"


const app=express()

const port=4000


app.use("/",router)



app.listen(port,()=>{
    console.log(`Server live ar ${port}`)
})