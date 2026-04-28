import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required')
        }
        setIsLoading(true);
        try {
            const url = `https://grubpac-assessment.onrender.com/api/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginInfo),
            });
            const result = await response.json();
            if (result.success) {
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('loggedInUser', result.data.name);
                localStorage.setItem('userRole', result.data.role);
                handleSuccess(result.message);
                setTimeout(() => navigate('/home'), 1000)
            } else if (result.errors) {
                handleError(result.errors[0]);
            } else { 
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input onChange={handleChange} type='email' name='email' placeholder='Enter your email...' value={loginInfo.email} />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input onChange={handleChange} type='password' name='password' placeholder='Enter your password...' value={loginInfo.password} />
                </div>
                <button type='submit' disabled={isLoading}>
                    {isLoading ? 'Loading (Server waking up...)' : 'Login'}
                </button>
                <span>Don't have an account ? <Link to="/signup">Signup</Link></span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login;