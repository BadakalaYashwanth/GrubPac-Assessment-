import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './home.css';
import TeacherDashboard from './TeacherDashboard';
import PrincipalDashboard from './PrincipalDashboard';

function Home({ setIsAuthenticated }) {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userRole, setUserRole] = useState('');
    const [contents, setContents] = useState([]);
    const [fetchError, setFetchError] = useState('');
    const hasFetched = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser') || '');
        setUserRole(localStorage.getItem('userRole') || '');
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        handleSuccess('User Logged out');
        setTimeout(() => navigate('/login'), 1000)
    }

    const fetchContent = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            if (!token) {
                navigate('/login');
                return;
            }

            const url = role === 'principal' 
                ? "https://grubpac-assessment.onrender.com/api/admin/content/all" 
                : "https://grubpac-assessment.onrender.com/api/content/my-content";
                
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            
            if (!response.ok) {
                setFetchError(result?.message || 'Unable to fetch contents');
                if (response.status === 401 || response.status === 403) {
                    setTimeout(() => navigate('/login'), 1000);
                }
                setContents([]);
                return;
            }

            setContents(result.data || []);
            setFetchError('');
        } catch (err) {
            setFetchError(err?.message || 'Something went wrong');
            setContents([]);
        }
    }, [navigate])

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchContent()
    }, [fetchContent])

    return (
        <div className='home-page'>
            <div className="main-app-container">
                <header className='home-header'>
                    <div>
                        <p className='home-subtitle'>Content Broadcasting Dashboard</p>
                        <h1>Welcome {loggedInUser || "User"} {userRole && `(${userRole.toUpperCase()})`}</h1>
                    </div>
                    <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </header>

                <main className='dashboard-content'>
                    {userRole === 'teacher' ? (
                        <TeacherDashboard contents={contents} fetchContent={fetchContent} />
                    ) : userRole === 'principal' ? (
                        <PrincipalDashboard contents={contents} fetchContent={fetchContent} />
                    ) : (
                        <p>Loading your dashboard...</p>
                    )}
                </main>

                {fetchError && (
                    <div style={{ marginTop: '20px', padding: '10px', background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', color: '#ff4d4d', fontSize: '0.9rem' }}>
                        <strong>Note:</strong> {fetchError}
                    </div>
                )}
            </div>
            <div><ToastContainer /></div>
        </div>
    )
}

export default Home;