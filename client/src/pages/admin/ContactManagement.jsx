import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import './ContactManagement.css';

const ContactManagement = () => {
    const { axios, getToken } = useAppContext();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        search: ''
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalContacts: 0
    });

    useEffect(() => {
        fetchContacts();
        fetchStats();
    }, [filters, pagination.currentPage]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            const params = new URLSearchParams({
                page: pagination.currentPage,
                limit: 10,
                ...filters
            });

            const response = await axios.get(`/api/contact/admin/all?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setContacts(response.data.data);
                setPagination(response.data.pagination);
            }
        } catch (error) {
    
            toast.error('Failed to fetch contact submissions');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = await getToken();
            const response = await axios.get('/api/contact/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
    
        }
    };

    const updateContactStatus = async (contactId, newStatus) => {
        try {
            const token = await getToken();
            const response = await axios.put(`/api/contact/admin/${contactId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Contact status updated successfully');
                fetchContacts();
                fetchStats();
            }
        } catch (error) {
    
            toast.error('Failed to update contact status');
        }
    };

    const deleteContact = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact submission?')) {
            return;
        }

        try {
            const token = await getToken();
            const response = await axios.delete(`/api/contact/admin/${contactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Contact submission deleted successfully');
                fetchContacts();
                fetchStats();
            }
        } catch (error) {
    
            toast.error('Failed to delete contact submission');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'read': return '#3b82f6';
            case 'replied': return '#10b981';
            case 'resolved': return '#059669';
            default: return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && contacts.length === 0) {
        return (
            <div className="contact-management">
                <div className="loading">Loading contact submissions...</div>
            </div>
        );
    }

    return (
        <div className="contact-management">
            <div className="contact-header">
                <h1>Contact Management</h1>
                <p>Manage and respond to customer inquiries</p>
            </div>

            {/* Stats Section */}
            {stats && (
                <div className="stats-section">
                    <div className="stat-card">
                        <h3>Total Inquiries</h3>
                        <p className="stat-number">{stats.total}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Recent (7 days)</h3>
                        <p className="stat-number">{stats.recent}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p className="stat-number" style={{ color: getStatusColor('pending') }}>
                            {stats.byStatus.pending}
                        </p>
                    </div>
                    <div className="stat-card">
                        <h3>Resolved</h3>
                        <p className="stat-number" style={{ color: getStatusColor('resolved') }}>
                            {stats.byStatus.resolved}
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>
                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Search by name, email, or message..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Contacts List */}
            <div className="contacts-list">
                {contacts.map((contact) => (
                    <div key={contact._id} className="contact-card">
                        <div className="contact-header-info">
                            <div className="contact-basic-info">
                                <h3>{contact.name}</h3>
                                <p className="contact-email">{contact.email}</p>
                                <p className="contact-date">{formatDate(contact.createdAt)}</p>
                            </div>
                            <div className="contact-status-section">
                                <span 
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(contact.status) }}
                                >
                                    {contact.status}
                                </span>
                                <div className="status-actions">
                                    <select
                                        value={contact.status}
                                        onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="read">Read</option>
                                        <option value="replied">Replied</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                    <button
                                        onClick={() => deleteContact(contact._id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="contact-message">
                            <p>{contact.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                        disabled={pagination.currentPage === 1}
                        className="pagination-btn"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {contacts.length === 0 && !loading && (
                <div className="no-contacts">
                    <p>No contact submissions found.</p>
                </div>
            )}
        </div>
    );
};

export default ContactManagement;
