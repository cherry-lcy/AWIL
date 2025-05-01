import {Outlet, useNavigate} from 'react-router-dom';
import './index.css';

const Layout = ()=>{
    const navigate = useNavigate();

    const onClick = (e)=>{
        console.log(e.target.name);
        navigate(`/home/${e.target.name}`);
    }

    return(<div className="layout-container">
        <nav>
            <div className="logo-group">
                <div className="logo"></div>
                <div className="description">
                    <p>心 理 健 康 素 養</p>
                    <p>Mental Health Literacy</p>
                </div>
            </div>
            <button className="nav-button" name="edit" onClick={(e)=>onClick(e)}>Edit Data</button>
            <button className="nav-button" name="view" onClick={(e)=>onClick(e)}>View Data</button>
        </nav>
        <div className="content-container">
            <Outlet/>
        </div>
    </div>)
}

export default Layout;