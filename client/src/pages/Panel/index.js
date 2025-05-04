import {useState, useEffect} from 'react';
import {useOptions} from '../../hooks/useOption';
import {getAllDataAPI, getRequiredDataAPI, deleteDataAPI, updateDataAPI} from '../../apis/data';
import './index.css';

const Panel = ()=>{
    const {optionList} = useOptions();

    const [reqData, setReqData] = useState({
        theme: "",
        subtheme: "",
        category: ""
    });

    const [displayTheme, setDisplayTheme] = useState(true);
    const [displaySubtheme, setDisplaySubtheme] = useState(true);
    const [displayCategory, setDisplayCategory] = useState(true);
    const [displayData, setDisplayData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const [editID, setEditID] = useState(null);
    const [editData, setEditData] = useState({
        id: null,
        name: null,
        theme: "",
        subtheme: "",
        category: ""
    })

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            theme: formData.get('theme'),
            subtheme: formData.get('subtheme'),
            category: formData.get('category')
        };

        setReqData({
            ...data
        })
    }

    const onClickRandom = ()=>{
        if (displayData.length === 0) return;

        const randomIndex = Math.floor(Math.random()*count);
        const randomItem = displayData[randomIndex];
    
        setDisplayData([randomItem]);
    }

    const handleEdit = (item)=>{
        setEditID(item.id);
        setEditData({
            ...item
        });
    }

    const handleEditFormChange = (e)=>{
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    }

    const handleEditSubmit = async (item)=>{
        try{
            const updatePayload = {
                name: item.name,
                theme: item.theme,
                subtheme: item.subtheme,
                category: item.category,
                newTheme: editData.theme,
                newSubtheme: editData.subtheme,
                newCategory: editData.category
            };
    
            await updateDataAPI(updatePayload);    

            setDisplayData(displayData.map(data => 
                data.id === item.id ? { ...data, ...editData } : data
            ));
            
            setEditID(null);
        }catch(e){
            console.error("Failed to update data: ", e.message);
            alert("Update failed. Please try again.");
        }
    }

    const handleCancelEdit = ()=>{
        setEditID(null);
        setEditData({
            id: null,
            name: null,
            theme: "",
            subtheme: "",
            category: ""
        })
    }

    const handleDelete = async (data)=>{
        if(window.confirm("This data will be deleted permanently.")){
            try{
                deleteDataAPI({data});
                setReqData({
                    ...reqData
                });
                setCount(count-1);
            }
            catch(e){
                console.error("Failed to delete data: ", e.message);
                alert("Delete failed. Please try again.");
            }
        }
    }

    const themeOnChange = (e)=>{
        setDisplayTheme(e.target.checked);
    }

    const subthemeOnChange = (e)=>{
        setDisplaySubtheme(e.target.checked);
    }

    const categoryOnChange = (e)=>{
        setDisplayCategory(e.target.checked);
    }

    useEffect(()=>{
        async function getRequired(){
            try{
                setLoading(true);
                const res = reqData.theme || reqData.subtheme || reqData.category ? await getRequiredDataAPI(reqData) : await getAllDataAPI();
                setDisplayData(res.data || []);
                setCount(res.data.length);
            }
            catch(e){
                console.error("Failed to fetch required data: ", e.message);
            }
            finally{
                setLoading(false);
            }
        }
        
        getRequired();
    }, [reqData])
    
    return(<div className="panel-container">
        <form className="filter-form" onSubmit={e=>onSubmit(e)}>
            <div className="filter-head">Filter</div>
            <div className="filter-option">
                <label>Theme: 
                    <select name="theme">
                    {optionList.themesList?.map((item, index)=> <option key={index} value={item}>{item}</option>) ?? null}
                    </select>
                </label>
                <label>Subtheme: 
                    <select name="subtheme">
                    {optionList.subthemesList?.map((item, index)=> <option key={index} value={item}>{item}</option>) ?? null}
                    </select>
                </label>
                <label>Category: 
                    <select name="category">
                    {optionList.categoriesList?.map((item, index)=> <option key={index} value={item}>{item}</option>) ?? null}
                    </select>
                </label>
            </div>
            <div className="button-grp">
                <button type="button" onClick={()=>{
                    setReqData({ theme: "", subtheme: "", category: "" });
                }}>Show All</button>
                <button type="button" onClick={onClickRandom}>Select Random</button>
                <button type="submit">Search</button>
            </div>
        </form>
        <form className="display-form">
            Display: 
            <label><input type="checkbox" name="name" checked="true" disabled/>Name</label>
            <label><input 
                type="checkbox" 
                name="theme" 
                checked={displayTheme}
                onChange={e=>themeOnChange(e)}
                />Theme</label>
            <label><input 
                type="checkbox" 
                name="subtheme" 
                checked={displaySubtheme}
                onChange={e=>subthemeOnChange(e)}
                />Subtheme</label>
            <label><input 
                type="checkbox" 
                name="category" 
                checked={displayCategory}
                onChange={e=>categoryOnChange(e)}
                />Category</label>
        </form>
        <div className="result-container">
            <div id="result-description">{count} result are found: </div>
            <button id="insert-button">Insert</button>
        </div>
        <table id="result-table">
            <thead>
                <tr>
                    <th>Name</th>
                    {displayTheme && <th>Theme</th>}
                    {displaySubtheme && <th>Subtheme</th>}
                    {displayCategory && <th>Category</th>}
                    <th>Operation</th>
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td colSpan="4">loading...</td></tr> : displayData.map((item, index)=>
                <tr key={index}>
                    <td>{item.name}</td>
                    {displayTheme && (<td>
                        {editID === item.id ? 
                        <input 
                            type="text" 
                            name="theme" 
                            value={editData.theme} 
                            placeholder={item.theme}
                            onChange={handleEditFormChange}
                        ></input> 
                        : item.theme}
                    </td>)}
                    {displaySubtheme && (<td>
                        {editID === item.id ? 
                        <input 
                            type="text" 
                            name="subtheme" 
                            value={editData.subtheme} 
                            placeholder={item.subtheme}
                            onChange={handleEditFormChange}
                        ></input>
                         : item.subtheme}
                    </td>)}
                    {displayCategory && (<td>{
                        editID === item.id ? <input
                            type="text"
                            name="category"
                            value={editData.category}
                            placeholder={item.category}
                            onChange={handleEditFormChange}
                        ></input>
                         : item.category}
                    </td>)}
                    <td>
                        <div className="table-button-grp">
                            {editID === item.id ? <>
                                <button id="confirm-button" value={item.name} onClick={()=>handleEditSubmit(item)}>Confirm</button>
                                <button id="cancel-button" value={item.name} onClick={handleCancelEdit}>Cancel</button> 
                            </> : <>
                                <button id="edit-button" value={item.name} onClick={()=>handleEdit(item)}>Edit</button>
                                <button id="delete-button" value={item.name} onClick={()=>handleDelete(item)}>Delete</button>
                            </>}
                        </div>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </div>)
}

export default Panel;