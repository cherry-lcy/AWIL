import {useState, useEffect} from 'react';
import {useOptions} from '../../hooks/useOption';
import {getAllDataAPI, getRequiredDataAPI, insertDataAPI, deleteDataAPI, updateDataAPI} from '../../apis/data';
import './index.css';

const Panel = ()=>{
    const {optionList} = useOptions();

    const [reqData, setReqData] = useState({
        theme: "",
        subtheme: "",
        category: ""
    });

    const [display, setDisplay] = useState({
        theme: true,
        subtheme: true,
        category: true
    });
    const [displayOperations, setDisplayOperations] = useState(true);
    const [displayData, setDisplayData] = useState([]);
    const [displayInsert, setDisplayInsert] = useState(false);
    const [newData, setNewData] = useState({
        name: null,
        theme: "",
        subtheme: "",
        category: ""
    })
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const handleInsert = ()=>{
        setDisplayInsert(true);
    }

    const handleInsertFormChange = (e)=>{
        setNewData({
            ...newData,
            [e.target.name]: e.target.value
        })
    }

    const handleInsertSubmit = async ()=>{
        try{
            setLoading(true);
            await insertDataAPI(newData);
            setNewData({
                name: null,
                theme: "",
                subtheme: "",
                category: ""
            });
            setReqData({ ...reqData });
        }
        catch(e){
            console.error("Failed to insert data: ", e.message);
            alert("Insert failed. Please try again.");
        }
        finally{
            setLoading(false);
            setDisplayInsert(false);
        }
    }

    const handleCancelInsert = ()=>{
        setDisplayInsert(false);
        setNewData({
            name: null,
            theme: "",
            subtheme: "",
            category: ""
        })
    }

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

    const displayOnChange = (e)=>{
        const updatedDisplay = {
            ...display,
            [e.target.name]: e.target.checked
        };
        
        setDisplay(updatedDisplay);
        
        const shouldShowOperations = Object.values(updatedDisplay).every(Boolean);
        setDisplayOperations(shouldShowOperations);    
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
                checked={display.theme}
                onChange={e=>displayOnChange(e)}
                />Theme</label>
            <label><input 
                type="checkbox" 
                name="subtheme" 
                checked={display.subtheme}
                onChange={e=>displayOnChange(e)}
                />Subtheme</label>
            <label><input 
                type="checkbox" 
                name="category" 
                checked={display.category}
                onChange={e=>displayOnChange(e)}
                />Category</label>
        </form>
        <div className="result-container">
            <div id="result-description">{count} result are found: </div>
            <button id="insert-button" onClick={handleInsert}>Insert</button>
        </div>
        {displayInsert && <div className="insert-form">
            <div className="insert-head">Insert</div>
            <div className="insert-option">
                <label>Name: <input 
                    type="number" 
                    name="name" 
                    value={newData.name}
                    maxLength="8"
                    onChange={e=>handleInsertFormChange(e)} 
                    required/>
                </label>
                <label>Theme: <input 
                    type="text" 
                    name="theme" 
                    value={newData.theme}
                    maxLength="8" 
                    onChange={e=>handleInsertFormChange(e)}
                    required/>
                </label>
                <label>Subtheme: <input 
                    type="text" 
                    name="subtheme" 
                    value={newData.subtheme}
                    maxLength="8" 
                    onChange={e=>handleInsertFormChange(e)}
                    required/>
                </label>
                <label>Category: <input 
                    type="text" 
                    name="category" 
                    value={newData.category}
                    maxLength="8" 
                    onChange={e=>handleInsertFormChange(e)}
                    required/>
                </label>
            </div>
            <div className="button-grp">
                <button className="confirm-button" onClick={handleInsertSubmit}>Confirm</button>
                <button className="cancel-button" onClick={handleCancelInsert}>Cancel</button> 
            </div>
        </div>}
        <table id="result-table">
            <thead>
                <tr>
                    <th>Name</th>
                    {display.theme && <th>Theme</th>}
                    {display.subtheme && <th>Subtheme</th>}
                    {display.category && <th>Category</th>}
                    {displayOperations && <th>Operations</th>}
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td colSpan="4">loading...</td></tr> : displayData.map((item, index)=>
                <tr key={index}>
                    <td>{item.name}</td>
                    {display.theme && (<td>
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
                    {display.subtheme && (<td>
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
                    {display.category && (<td>{
                        editID === item.id ? <input
                            type="text"
                            name="category"
                            value={editData.category}
                            placeholder={item.category}
                            onChange={handleEditFormChange}
                        ></input>
                         : item.category}
                    </td>)}
                    {displayOperations && (<td>
                        <div className="table-button-grp">
                            {editID === item.id ? <>
                                <button className="confirm-button" value={item.name} onClick={()=>handleEditSubmit(item)}>Confirm</button>
                                <button className="cancel-button" value={item.name} onClick={handleCancelEdit}>Cancel</button> 
                            </> : <>
                                <button id="edit-button" value={item.name} onClick={()=>handleEdit(item)}>Edit</button>
                                <button id="delete-button" value={item.name} onClick={()=>handleDelete(item)}>Delete</button>
                            </>}
                        </div>
                    </td>)}
                </tr>)}
            </tbody>
        </table>
    </div>)
}

export default Panel;