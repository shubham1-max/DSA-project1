
const express= require("express")
require('dotenv').config();
const PORT=process.env.PORT;
const URL= process.env.MONGO_URL;
const connectDB= require("../src/lib/db");



const app=express();



//connection with DB
connectDB(URL).then(()=>{
    console.log("mongoDB connected!")
})


//middlewares
app.use(express.json());



app.listen( PORT,(err,msg)=>{

    console.log(` server running on port: ${PORT}`);
})