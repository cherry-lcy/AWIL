import {Outlet, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import './index.css';

const Layout = ()=>{
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleNav = ()=>{
        setIsCollapsed(!isCollapsed);
    }

    const onClick = (e)=>{
        navigate(`/home/${e.target.name}`);
    }

    return(
        <div className={`layout-container ${isCollapsed ? 'collapsed' : ''}`}>
            <nav>
                <button className="toggle-button" onClick={toggleNav}>
                    {isCollapsed ? '>' : '<'}
                </button>
                
                <div className="logo-group">
                    <div className="logo"></div>
                    {!isCollapsed && (
                        <div className="description">
                            <p>心 理 健 康 素 養</p>
                            <p>Mental Health Literacy</p>
                        </div>
                    )}
                </div>
                
                {!isCollapsed && (
                    <>
                        <button className="nav-button" name="edit" onClick={onClick}>Edit Data</button>
                        <button className="nav-button" name="view" onClick={onClick}>View Data</button>
                    </>
                )}
            </nav>
            <div className="content-container">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;