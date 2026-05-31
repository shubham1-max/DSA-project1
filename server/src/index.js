
const express= require("express")
require("dotenv").config();
const PORT=process.env.PORT;
const URL= process.env.MONGO_URL;
const connectDB= require("../src/lib/db");
const userRouter=require("./routers/auth.router")
const problemRouter= require("./routers/problem.router");
const cors = require("cors");
const app=express();

//connection with DB
connectDB(URL).then(()=>{
    console.log("mongoDB connected!")
})


//middlewares
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use('/user',userRouter);
app.use('/problem', problemRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
server.on('error', (err) => {
  console.error('Server failed to start:', err.message);
  process.exit(1);
});