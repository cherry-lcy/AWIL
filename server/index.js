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
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
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
    console.log("authentication...");
    if(id === "apple" && password === "apple"){
        const token = jwt.sign({id, password}, secret, {expiresIn: "4hr"})
        return res.send({
            status: 200,
            data:{
                id: id,
                token: token
            },
            timestamp: new Date().toISOString()
        })
    }
    else{
        return res.status(403).send({
            status: 403,
            data: "Invalid id or password",
            timestamp: new Date().toISOString()
        })
    }
})

// get subtheme list api
app.get("/v1/subthemes", async (req, res)=>{
    try{
        console.log("get subthemes");
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const subtheme = await getSubthemeList();
            return res.send({
                status: 200,
                data: subtheme.data,
                timestamp: subtheme.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// get theme api
app.get("/v1/themes", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);

        console.log("get themes");
        
        if(verify.status === 200){
            const theme = await getThemeList();
            return res.send({
                status:200,
                data: theme.data,
                timestamp: theme.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// get category list api
app.get("/v1/categories", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);

        console.log("get categories");
        
        if(verify.status === 200){
            const categories = await getCategoryList();
            return res.send({
                status:200,
                data: categories.data,
                timestamp: categories.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// get all data api
app.get("/v1/all-data", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);

        console.log("get all data");
        
        if(verify.status === 200){
            const queryList = await getAll();
            return res.send({
                status: 200,
                data: queryList.data,
                timestamp: queryList.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// get specific query api
app.get("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);

        console.log("get required data");
        
        if(verify.status === 200){
            const {theme, subtheme, category} = req.query;
            const queryList = await getRequiredData({theme, subtheme, category});
            return res.send({
                status: 200,
                data: queryList.data,
                timestamp: queryList.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// insert data api
app.patch("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);

        console.log("insert data");
        
        if(verify.status === 200){
            const {name, theme, subtheme, category} = req.body;
            const queryList = await insertData({name, theme, subtheme, category});
            return res.send({
                status:200,
                data: {
                    insertedId: queryList.insertedID,
                    affectedRows: queryList.affectedRows,
                    values:queryList.data
                },
                timestamp: queryList.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// update data api
app.put("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);
        
        if(verify.status === 200){
            const { name, theme, subtheme, category, newTheme, newSubtheme, newCategory } = req.body;
            
            const queryList = await updateData({
                name, 
                theme, 
                subtheme, 
                category,
                newTheme, 
                newSubtheme, 
                newCategory
            });

            return res.send({
                status: 200,
                data: {
                    affectedRows: queryList.affectedRows,
                    changedRows: queryList.changedRows,
                    oldValues: { name, theme, subtheme, category },
                    newValues: { newTheme, newSubtheme, newCategory }
                },
                timestamp: queryList.timestamp
            });
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

// delete data api
app.delete("/v1/query", async (req, res)=>{
    try{
        const verify = verifyUser(req, secret);

        console.log("delete data")
        
        if(verify.status === 200){
            const {name, theme, subtheme, category} = req.body;
            const queryList = await deleteData({name, theme, subtheme, category});
            return res.send({
                status:200,
                data: {
                    affectedRows: queryList.affectedRows,
                    deletedValues: queryList.deletedData
                },
                timestamp: queryList.timestamp
            })
        }
        else{
            return res.status(verify.status).send({
                status: verify.status,
                data: verify.message,
                timestamp: new Date().toISOString()
            });
        }
    }
    catch(e){
        return res.status(403).send({
            status: 403,
            data: e.message,
            timestamp: new Date().toISOString()
        })
    }
})

app.listen(5000, ()=>{
    console.log("server is running on port 5000");
})