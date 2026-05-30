
const jwt= require("jsonwebtoken")


const verifyToken= async function(req,res,next){

    const tokenHeader= req.headers['authorization'];

     if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "No token provided"
        });
    }

    const token = tokenHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
        };

        next();

    } catch (err) {

        return res.status(401).json({
            error: "Invalid or expired token"
        });
 

    }
}
module.exports= verifyToken;