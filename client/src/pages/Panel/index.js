import {useState, useEffect} from 'react';
import {useOptions} from '../../hooks/useOption';
import {getAllDataAPI} from '../../apis/data';
import './index.css';

const Panel = ()=>{
    const {optionList} = useOptions();

    const [reqData, setReqData] = useState({
        theme: "",
        subtheme: "",
        category: ""
    })
    const [displayTheme, setDisplayTheme] = useState(true);
    const [displaySubtheme, setDisplaySubtheme] = useState(true);
    const [displayCategory, setDisplayCategory] = useState(true);
    const [dataList, setDataList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const count = dataList.length;

    const onFinish = (e)=>{
        console.log(e);
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
        async function getDataList(){
            try{
                setLoading(true);
                const res = await getAllDataAPI();
                setDataList(res.data || []);
            }
            catch(e){
                console.error("Failed to fetch data: ", e.message);
            }
            finally{
                setLoading(false);
            }
        }

        getDataList();
    },[])
    
    return(<div className="panel-container">
        <form className="filter-form" action={e=>onFinish(e)}>
            <div className="filter-head">Filter</div>
            <div className="filter-option">
                <label>Theme: <select>
                    {optionList.themesList?.map((item, index)=> <option key={index} value={item}>{item}</option>) ?? null}
                </select></label>
                <label>Subtheme: <select>
                    {optionList.subthemesList?.map((item, index)=> <option key={index} value={item}>{item}</option>) ?? null}
                </select></label>
                <label>Category: <select>
                    {optionList.categoriesList?.map((item, index)=> <option key={index} value={item}>{item}</option>) ?? null}
                </select></label>
            </div>
            <div className="button-grp">
                <button type="button">Select Random</button>
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
        <p>{count} result are found: </p>
        <table id="result-table">
            <thead>
                <tr>
                    <th>Name</th>
                    {displayTheme && <th>Theme</th>}
                    {displaySubtheme && <th>Subtheme</th>}
                    {displayCategory && <th>Category</th>}
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td colSpan="4">loading...</td></tr> : dataList.map((item, index)=>
                <tr key={index}>
                    <td>{item.name}</td>
                    {displayTheme && <td>{item.theme}</td>}
                    {displaySubtheme && <td>{item.subtheme}</td>}
                    {displayCategory && <td>{item.category}</td>}
                </tr>)}
            </tbody>
        </table>
    </div>)
}

export default Panel;