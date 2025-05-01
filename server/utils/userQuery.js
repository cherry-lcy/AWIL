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

module.exports = {getAll, getRequiredData, insertData, deleteData};