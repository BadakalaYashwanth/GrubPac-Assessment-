import React, { useState } from 'react';
import { handleError, handleSuccess } from '../utils';

function TeacherDashboard({ contents, fetchContent }) {
    const [uploadInfo, setUploadInfo] = useState({
        title: '',
        subject: '',
        description: '',
        startTime: '',
        endTime: '',
        durationMinutes: 5
    });
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUploadInfo({ ...uploadInfo, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !uploadInfo.title || !uploadInfo.subject || !uploadInfo.startTime || !uploadInfo.endTime) {
            return handleError('All fields and file are required');
        }

        const formData = new FormData();
        formData.append('file', file);
        Object.keys(uploadInfo).forEach(key => {
            formData.append(key, uploadInfo[key]);
        });

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = "https://grubpac-assessment.onrender.com/api/content/upload";
            const response = await fetch(url, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setUploadInfo({
                    title: '',
                    subject: '',
                    description: '',
                    startTime: '',
                    endTime: '',
                    durationMinutes: 5
                });
                setFile(null);
                fetchContent();
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        try {
            const token = localStorage.getItem('token');
            const url = `https://grubpac-assessment.onrender.com/api/content/${id}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                fetchContent();
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <>
            <section className="upload-section">
                <h2>Upload New Content</h2>
                <form onSubmit={handleUpload} className="upload-form">
                    <div className="form-group">
                        <input type="text" name="title" placeholder="Title" value={uploadInfo.title} onChange={handleChange} required />
                        <select name="subject" value={uploadInfo.subject} onChange={handleChange} required>
                            <option value="">Select Subject</option>
                            <option value="Maths">Maths</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="History">History</option>
                        </select>
                    </div>
                    <textarea name="description" placeholder="Description" value={uploadInfo.description} onChange={handleChange} />
                    <div className="form-group">
                        <label>Start Time: <input type="datetime-local" name="startTime" value={uploadInfo.startTime} onChange={handleChange} required /></label>
                        <label>End Time: <input type="datetime-local" name="endTime" value={uploadInfo.endTime} onChange={handleChange} required /></label>
                    </div>
                    <div className="form-group">
                        <label>Duration (mins): <input type="number" name="durationMinutes" value={uploadInfo.durationMinutes} onChange={handleChange} min="1" required /></label>
                        <input type="file" onChange={handleFileChange} accept="image/*" required />
                    </div>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Uploading...' : 'Upload Content'}</button>
                </form>
            </section>

            <section className="content-list">
                <h2>My Content</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Duration</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.map(item => (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>{item.subject}</td>
                                    <td><span className={`status-badge ${item.status}`}>{item.status.toUpperCase()}</span></td>
                                    <td>{new Date(item.startTime).toLocaleString()}</td>
                                    <td>{new Date(item.endTime).toLocaleString()}</td>
                                    <td>{item.durationMinutes}m</td>
                                    <td>{item.rejectionReason || '-'}</td>
                                    <td>
                                        {item.status === 'pending' && (
                                            <button onClick={() => handleDelete(item._id)} className="delete-btn">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}

export default TeacherDashboard;
