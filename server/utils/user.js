const jwt = require("jsonwebtoken");

function verifyUser(req, secret){
    try{
        const authHead = req.get("Authorization");

        if(!authHead){
            return {
                status:403,
                message:"Authorization header missing"
            }
        }
        
        const token = authHead.split(' ')[1];
        const decoded = jwt.verify(token, secret);

        if(decoded.id === "apple" && decoded.password === "apple"){
            return {
                status:200,
                message: "true"
            }
        }
        else{
            return {
                status: 401,
                message: "Invalid token"
            }
        }
    }
    catch(err){
        console.error("Authorization error: ", err);
        return {
            status:403,
            message: err.message
        }
    }
}

module.exports = {verifyUser};