const jwt = require('jsonwebtoken');

const JWT_SECERT = process.env.JWT_SECERT_KEY;

const verifyToken = (req, res, next) =>{
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).send({message:"Invaild token"})
        }
        const decoded = jwt.verify(token, JWT_SECERT)
        if(!decoded){
            return res.status(401).send({message:"Invaild token or not vaild"})
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    }catch(error){
        console.error('Error while verifying token', error);
        res.status(401).send({message:"Error while verifying token"})

    }
}

module.exports = verifyToken;