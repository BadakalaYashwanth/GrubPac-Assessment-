import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Signup() {
    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: '',
        role: 'teacher'
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo({ ...signupInfo, [name]: value });
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email and password are required')
        }
        try {
            const url = `https://grubpac-assessment.onrender.com/api/auth/register`;
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, errors } = result;
            if (success) {
                handleSuccess(message);
                setTimeout(() => navigate('/login'), 1000)
            } else if (errors) {
                handleError(errors[0]);
            } else if (!success) { 
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    }
    return (
        <div className='container'>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input onChange={handleChange} type='text' name='name' autoFocus placeholder='Enter your name...' value={signupInfo.name} />
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input onChange={handleChange} type='email' name='email' placeholder='Enter your email...' value={signupInfo.email} />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input onChange={handleChange} type='password' name='password' placeholder='Enter your password...' value={signupInfo.password} />
                </div>
                <div>
                    <label htmlFor='role'>Role</label>
                    <select name='role' value={signupInfo.role} onChange={handleChange} style={{width:'100%', padding: '10px', marginTop: '5px', marginBottom: '10px'}}>
                        <option value="teacher">Teacher</option>
                        <option value="principal">Principal</option>
                    </select>
                </div>
                <button type='submit'>Signup</button>
                <span>Already have an account ? <Link to="/login">Login</Link></span>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Signup;