
const express= require("express")
require('dotenv').config();
const PORT=process.env.PORT;



const app=express();
app.use(express.json());



app.listen( PORT,(err,msg)=>{

    console.log(` server running on port: ${PORT}`);
})