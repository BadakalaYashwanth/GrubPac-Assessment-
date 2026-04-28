import React, { useState } from 'react';
import { handleError, handleSuccess } from '../utils';

function PrincipalDashboard({ contents, fetchContent }) {
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectingId, setRejectingId] = useState(null);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/content/admin/${id}/approve`;
            const response = await fetch(url, {
                method: "PATCH",
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

    const handleReject = async (e) => {
        e.preventDefault();
        if (!rejectionReason) return handleError('Reason is mandatory');
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/api/content/admin/${rejectingId}/reject`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rejectionReason })
            });
            const result = await response.json();
            if (result.success) {
                handleSuccess(result.message);
                setRejectingId(null);
                setRejectionReason('');
                fetchContent();
            } else {
                handleError(result.message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className="dashboard-container">
            <section className="pending-section">
                <h2>Pending Approvals</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Preview</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.filter(c => c.status === 'pending').map(item => (
                                <tr key={item._id}>
                                    <td>{item.uploadedBy?.name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.subject}</td>
                                    <td><a href={`http://localhost:8080${item.fileUrl}`} target="_blank" rel="noreferrer">View File</a></td>
                                    <td>
                                        <button onClick={() => handleApprove(item._id)} className="approve-btn">Approve</button>
                                        <button onClick={() => setRejectingId(item._id)} className="reject-btn">Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {rejectingId && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Reject Content</h3>
                        <form onSubmit={handleReject}>
                            <textarea 
                                placeholder="Mandatory rejection reason..." 
                                value={rejectionReason} 
                                onChange={(e) => setRejectionReason(e.target.value)} 
                                required 
                            />
                            <div className="modal-actions">
                                <button type="submit">Submit Rejection</button>
                                <button type="button" onClick={() => setRejectingId(null)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <section className="approved-section">
                <h2>Approved Content History</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contents.filter(c => c.status !== 'pending').map(item => (
                                <tr key={item._id}>
                                    <td>{item.uploadedBy?.name}</td>
                                    <td>{item.title}</td>
                                    <td>{item.subject}</td>
                                    <td><span className={`status-badge ${item.status}`}>{item.status.toUpperCase()}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default PrincipalDashboard;
