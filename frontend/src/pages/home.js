import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import './home.css';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [userRole, setUserRole] = useState('');
    const [contents, setContents] = useState([]);
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
                handleError(result?.message || 'Unable to fetch contents');
                if (response.status === 401 || response.status === 403) {
                    setTimeout(() => navigate('/login'), 1000);
                }
                setContents([]);
                return;
            }

            setContents(result.data || []);
        } catch (err) {
            handleError(err?.message || 'Something went wrong');
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
            <header className='home-header'>
                <div>
                    <p className='home-subtitle'>Content Broadcasting Dashboard</p>
                    <h1>Welcome {loggedInUser || "User"} {userRole && `(${userRole.toUpperCase()})`}</h1>
                </div>
                <button className='logout-btn' onClick={handleLogout}>Logout</button>
            </header>

            <section className='product-grid'>
                {contents.map((item, index) => (
                    <article className='product-card' key={item._id || index} style={{minHeight: '200px'}}>
                        <div className='product-info' style={{padding: '20px'}}>
                            <h3>{item.title}</h3>
                            <p style={{margin: '5px 0'}}><strong>Subject:</strong> {item.subject}</p>
                            <p style={{margin: '5px 0'}}><strong>Status:</strong> <span style={{fontWeight: 'bold', color: item.status === 'approved' ? 'green' : item.status === 'rejected' ? 'red' : 'orange'}}>{item.status.toUpperCase()}</span></p>
                            <p style={{margin: '5px 0'}}><strong>Duration:</strong> {item.durationMinutes} mins</p>
                            {item.rejectionReason && <p style={{margin: '5px 0', color: 'red'}}><strong>Reason:</strong> {item.rejectionReason}</p>}
                        </div>
                    </article>
                ))}
            </section>

            {!contents.length && (
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}>
                    <p className='empty-products' style={{fontSize: '20px'}}>No uploaded content available right now.</p>
                </div>
            )}

            <div><ToastContainer /></div>
        </div>
    )
}

export default Home;