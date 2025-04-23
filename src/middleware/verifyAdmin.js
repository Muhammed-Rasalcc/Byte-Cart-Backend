const verifyAdmin = (req, res, next) =>{
    if (req.role !=='admin'){
       return res.status(403).send({sucess: false, message: "You are not authorised to perform the action"})
    }
    next();
}

module.exports = verifyAdmin