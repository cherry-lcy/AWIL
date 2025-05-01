const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const app = express();

const secret = crypto.randomBytes(32).toString('hex');

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.post("/v1/authentication", (req, res)=>{
    const {id, password} = req.body;
    if(id === "apple" && password === "apple"){
        const token = jwt.sign({id, password}, secret, {expiresIn: "4hr"})
        return res.send({
            status: 200,
            message:{
                id: id,
                token: token
            }
        })
    }
    else{
        return res.status(403).send({
            status: 403,
            message: "Invalid id or password"
        })
    }
})

app.listen(5000, ()=>{
    console.log("server is running on port 5000");
})