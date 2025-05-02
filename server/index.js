const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
    getAll, 
    getRequiredData, 
    insertData, 
    updateData,
    deleteData, 
    getThemeList, 
    getSubthemeList, 
    getCategoryList
} = require("./utils/dataQuery");
const {verifyUser} = require("./utils/user");

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

// login authentication API
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

// get theme list api
app.get("/v1/subthemes", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const subtheme = await getSubthemeList();
            return res.send({
                status:200,
                message: subtheme
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

// get category api
app.get("/v1/themes", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const theme = await getThemeList();
            return res.send({
                status:200,
                message: theme
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

// get category list api
app.get("/v1/categories", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const categories = await getCategoryList();
            return res.send({
                status:200,
                message: categories
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

// get all data api
app.get("/v1/all-data", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const allData = await getAll();
            return res.send({
                status:200,
                message: allData
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

// get specific query api
app.get("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const theme = res.query.theme;
            const subtheme = res.query.subtheme;
            const category = res.query.category;
            const queryList = await getRequiredData({theme, subtheme, category});
            return res.send({
                status:200,
                message: queryList
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

// insert data api
app.patch("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const theme = res.query.theme;
            const subtheme = res.query.subtheme;
            const category = res.query.category;
            const queryList = await insertData({theme, subtheme, category});
            return res.send({
                status:200,
                message: queryList
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

// update data api
app.put("/v1/query", async (res, req)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const newTheme = res.query.theme;
            const newSubtheme = res.query.subtheme;
            const newCategory = res.query.category;
            const query = res.body.data;
            const queryList = await updateData({newTheme, newSubtheme, newCategory, ...query});
            return res.send({
                status:200,
                message: queryList
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

app.delete("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const theme = res.query.theme;
            const subtheme = res.query.subtheme;
            const category = res.query.category;
            const queryList = await deleteData({theme, subtheme, category});
            return res.send({
                status:200,
                message: queryList
            })
        }
        else{
            return res.status(verify.status).send(verify);
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            message: "Invalid Credential"
        })
    }
})

app.listen(5000, ()=>{
    console.log("server is running on port 5000");
})