const mongoose=require("mongoose")
require("dotenv").config();


// const URL=process.env.MONGO_URL;
const connectDB= async function(url){

    const connect= mongoose.connect(url);
    return connect;
}

module.exports=connectDB;




