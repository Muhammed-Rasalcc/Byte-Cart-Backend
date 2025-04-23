var jwt = require('jsonwebtoken');
const User = require('../users/user.model');

const JWT_SECERT = process.env.JWT_SECERT_KEY;

const generateToken = async (userId) =>{
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new Error("user not found.");
        }
        const token = jwt.sign({userId: user._id, role: user.role}, JWT_SECERT,{ expiresIn: '1h' });
        return token;
    }
    catch{

    }

}
module.exports = generateToken;