import './index.css';

const Panel = ()=>{
    const count = 0;
    
    return(<div className="panel-container">
        <form className="filter-form">
            <div className="filter-head">Filter</div>
            <div className="filter-option">
                <label>Theme: <select>

                </select></label>
                <label>Subtheme: <select>

                </select></label>
                <label>Category: <select>
                    
                </select></label>
            </div>
            <button type="submit" id="filter-button">Search</button>
        </form>
        <form className="display-form">
            Display: 
            <label><input type="checkbox" name="name"/>Name</label>
            <label><input type="checkbox" name="theme"/>Theme</label>
            <label><input type="checkbox" name="subtheme"/>Subtheme</label>
            <label><input type="checkbox" name="category"/>Category</label>
        </form>
        <p>{count} result are found: </p>
        <table>
            <thead>
                <tr>
                </tr>
            </thead>
        </table>
    </div>)
}

export default Panel;