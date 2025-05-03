const {pool} = require('./db');

async function getAll(){
    try{
        const [rows] = await pool.query("SELECT * FROM tool_set");
        return {
            success: true,
            operation: 'read',
            data: rows,
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.error("Error in getAll: ", err);
        return {
            success: false,
            operation: 'read',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function getRequiredData(userData){
    try{
        const [rows] = await pool.query(`SELECT * from tool_set WHERE theme = ? AND subtheme = ? AND category = ?`, [userData.theme, userData.subtheme, userData.category]);
        return {
            success: true,
            operation: 'read',
            data: rows,
            timestamp: new Date().toISOString()
        };
    }catch(err){
        console.error("Error in getRequired: ", err);
        return {
            success: false,
            operation: 'read',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function insertData(userData){
    try{
        const [result] = await pool.query(`INSERT INTO tool_set (name, theme, subtheme, category)  VALUES (?, ?, ?, ?)`,
            [userData.name, userData.theme, userData.subtheme, userData.category]);

        return { 
            success: true,
            operation: 'insert',
            insertedID: result.insertedID,
            affectedRows: result.affectedRows,
            data:{
                name: userData.name,
                theme: userData.theme,
                subtheme: userData.subtheme,
                category: userData.category
            },
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.error("Error in insertData: ", err);
        return {
            success: false,
            operation: 'insert',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function updateData(userData){
    try{
        const [result] = pool.query(`UPDATE tool_set SET theme = ?, subtheme = ?, category = ? WHERE name = ? AND theme = ? AND subtheme = category AND ? = ?`, 
            [userData.newTheme, userData.newSubtheme, userData.newCategory, userData.name, userData.theme, userData.subtheme, userData.category]);
            
        return { 
            success: true,
            operation: 'update',
            affectedRows: result.affectedRows,
            changedRows: result.changedRows,
            oldData:{
                name: userData.name, 
                theme: userData.theme,
                subtheme: userData.subtheme,
                category: userData.category
            },
            newData: {
                name: userData.name, 
                theme: userData.newTheme,
                subtheme: userData.newSubtheme,
                category: userData.newCategory
            },
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.error("Error in insertData: ", err);
        return {
            success: false,
            operation: 'update',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function deleteData(userData){
    try{
        const [rows] = await pool.query(`SELECT * FROM tool_set  WHERE name = ? AND theme = ? AND subtheme = ? AND category = ?`,
            [userData.name, userData.theme, userData.subtheme, userData.category]);

        const [result] = await pool.query(`DELETE FROM tool_set WHERE name = ? AND theme = ? AND subtheme = ? AND category = ?`,
            [userData.name, userData.theme, userData.subtheme, userData.category]);

        return {
            success: true,
            operation: 'delete',
            affectedRows: result.affectedRows,
            deletedData: rows.length > 0 ? rows[0] : null,
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.error("Error in deleteData: ", err);
        return {
            success: false,
            operation: 'delete',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function getThemeList(){
    try{
        const [rows] = await pool.query(`SELECT DISTINCT theme FROM tool_set`);
        return {
            success: true,
            operation: 'read',
            data: rows.map(item=>item.theme),
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.log("Error in getThemeList: ", err);
        return {
            success: false,
            operation: 'read',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function getSubthemeList(){
    try{
        const [rows] = await pool.query(`SELECT DISTINCT subtheme FROM tool_set`);
        return {
            success: true,
            operation: 'read',
            data: rows.map(item=>item.subtheme),
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.log("Error in getSubthemeList: ", err);
        return {
            success: false,
            operation: 'read',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

async function getCategoryList(){
    try{
        const [rows] = await pool.query(`SELECT DISTINCT category FROM tool_set`);
        return {
            success: true,
            operation: 'read',
            data: rows.map(item=>item.category),
            timestamp: new Date().toISOString()
        };
    }
    catch(err){
        console.log("Error in getCategoryList: ", err);
        return {
            success: false,
            operation: 'read',
            error: {
                code: err.code || 'database error',
                message: err.message
            },
            timestamp: new Date().toISOString()
        }
    }
}

module.exports = {
    getAll, 
    getRequiredData, 
    insertData, 
    updateData,
    deleteData, 
    getThemeList, 
    getSubthemeList, 
    getCategoryList
};