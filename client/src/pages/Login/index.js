import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {fetchLogin} from '../../store/modules/user';
import './index.css';

const Login = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '', 
        password: ''
    });

    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const result = await dispatch(fetchLogin(formData));

        if(result?.success){
            navigate('/home');
        }
        else{
            alert(result?.message || "Login failed");
            setFormData({
                id: '',
                password: ''
            });
        }
    }

    return (<div className="login-container">
        <div className="logo-container">
            <div className="logo"></div>
            <div className="description">
                <p>心 理 健 康 素 養</p>
                <p>Mental Health Literacy</p>
            </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>ID: </label>
                <input type="text" name="id" value={formData.id} onChange={handleInputChange} required></input>
            </div>
            <div className="input-group">
                <label>Password: </label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} required></input>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>)
}

export default Login;