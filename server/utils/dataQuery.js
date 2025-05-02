const {pool} = require('./db');

async function getAll(){
    try{
        const [rows] = await pool.query("SELECT * FROM tool_set");
        return rows;
    }
    catch(err){
        console.error("Error in getAll: ", err);
        throw err;
    }
}

async function getRequiredData(userData){
    try{
        const [rows] = await pool.query(`SELECT * from tool_set WHERE theme = ? AND subtheme = ? AND category = ?`, [userData.theme, userData.subtheme, userData.category]);
        return rows;
    }catch(err){
        console.error("Error in getRequired: ", err);
        throw err;
    }
}

async function insertData(userData){
    try{
        const [result] = await pool.query(`INSERT INTO tool_set (name, theme, subtheme, category) VALUES (?, ?, ?, ?)`, [userData.name, userData.theme, userData.subtheme, userData.category]);
        return { id: result.id, ...userData };
    }
    catch(err){
        console.error("Error in insertData: ", err);
        throw err;
    }
}

async function updateData(userData){
    try{
        const [result] = pool.query(`UPDATE tool_set 
            SET theme = ? AND subtheme = ? AND category = ? 
            WHERE name = ? AND theme = ? AND subtheme = category AND ? = ?`, 
            [userData.newTheme, userData.newSubtheme, userData.newCategory, userData.name, userData.theme, userData.subtheme, userData.category]);
            
        return result;
    }
    catch(err){
        console.error("Error in insertData: ", err);
        throw err;
    }
}

async function deleteData(userData){
    try{
        const [result] = await pool.query(`DELETE FROM tool_set WHERE name = ? AND theme = ? AND subtheme = ? AND category = ?`, [userData.name, userData.theme, userData.subtheme, userData.category]);
        return { id: result.id, ...userData };
    }
    catch(err){
        console.error("Error in deleteData: ", err);
        throw err;
    }
}

async function getThemeList(){
    try{
        const [rows] = await pool.query(`SELECT DISTINCT theme FROM tool_set`);
        return rows.map(item=>item.theme);
    }
    catch(err){
        console.log("Error in getThemeList: ", err);
        throw err;
    }
}

async function getSubthemeList(){
    try{
        const [rows] = await pool.query(`SELECT DISTINCT subtheme FROM tool_set`);
        return rows.map(item=>item.subtheme);
    }
    catch(err){
        console.log("Error in getSubthemeList: ", err);
        throw err;
    }
}

async function getCategoryList(){
    try{
        const [rows] = await pool.query(`SELECT DISTINCT category FROM tool_set`);
        return rows.map(item=>item.category);
    }
    catch(err){
        console.log("Error in getCategoryList: ", err);
        throw err;
    }
}

getThemeList().then(result=>{
    console.log(result);
}).catch(error=>{
    console.log(error);
});

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