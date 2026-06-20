
const express=require("express")
const router= express.Router();

const {verifyToken}=require("../middlewares/auth.middleware")
const{register,login,getMe}=require("../controllers/auth.controller");
const {authLimiter}=require("../middlewares/rateLimit.middleware");

// Public routes with rate limiting
router.post('/signup', authLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/me', verifyToken, getMe);

module.exports=router;
