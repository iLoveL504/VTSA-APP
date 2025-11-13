import React, { useState, useEffect } from 'react'
import { useStoreState } from 'easy-peasy'
import { useSharedSocket } from '../Context/SocketContext'
import '../css/Inbox.css'

const Inbox = () => {
    const { messagesSocket } = useSharedSocket()
    const inbox = useStoreState(state => state.inbox)
    const sentMessages = useStoreState(state => state.sentMessages)
    const employees = useStoreState(state => state.employees)
    const user = useStoreState(state => state.user)
    
    const [activeTab, setActiveTab] = useState('inbox')
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [newMessage, setNewMessage] = useState({
        recipients: [],
        content: ''
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [recipientSearch, setRecipientSearch] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [sendStatus, setSendStatus] = useState(null)
    const [mobileView, setMobileView] = useState(false)

    useEffect(() => {
        if (messagesSocket && user) {
            console.log('User ID:', user.employee_id)       
            messagesSocket.emit('join_user', user.employee_id)
            messagesSocket.emit('fetch_inbox', user.employee_id)
            messagesSocket.emit('fetch_sent', user.employee_id)
        }
        
        const checkMobile = () => setMobileView(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        
        return () => window.removeEventListener('resize', checkMobile)
    }, [messagesSocket, user])

    const handleMarkAsRead = (messageId) => {
        messagesSocket.emit('mark_as_read', {
            message_id: messageId,
            recipient_id: user.employee_id
        })
    }

    const handleSendMessage = () => {
        if (!newMessage.content.trim() || newMessage.recipients.length === 0) {
            alert('Please select recipients and enter message content')
            return
        }

        setIsSending(true)
        setSendStatus(null)

        messagesSocket.emit('send_message', {
            sender_id: user.employee_id,
            content: newMessage.content,
            recipients: newMessage.recipients
        }, (ack) => {
            setIsSending(false)
            
            if (ack?.success) {
                setSendStatus({ type: 'success', message: 'Message sent successfully!' })
                setNewMessage({ recipients: [], content: '' })
                
                setTimeout(() => {
                    setIsComposeOpen(false)
                    setSendStatus(null)
                }, 1500)
                
                messagesSocket.emit('fetch_sent', user.employee_id)
            } else {
                setSendStatus({ 
                    type: 'error', 
                    message: ack?.error || 'Failed to send message. Please try again.' 
                })
            }
        })
    }

    const handleRecipientToggle = (employeeId) => {
        setNewMessage(prev => ({
            ...prev,
            recipients: prev.recipients.includes(employeeId)
                ? prev.recipients.filter(id => id !== employeeId)
                : [...prev.recipients, employeeId]
        }))
    }

    const handleSelectAllRecipients = () => {
        const filteredEmployees = getFilteredEmployees()
        const allFilteredIds = filteredEmployees.map(emp => emp.employee_id)
        
        setNewMessage(prev => ({
            ...prev,
            recipients: prev.recipients.length === allFilteredIds.length ? [] : allFilteredIds
        }))
    }

    const getFilteredEmployees = () => {
        if (!employees) return []
        
        return employees.filter(employee => {
            const fullName = `${employee.first_name} ${employee.last_name}`.toLowerCase()
            const job = employee.job?.toLowerCase() || ''
            const search = recipientSearch.toLowerCase()
            
            return fullName.includes(search) || job.includes(search)
        })
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now - date) / (1000 * 60 * 60)
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } else if (diffInHours < 168) {
            return date.toLocaleDateString('en-US', { 
                weekday: 'short'
            })
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        }
    }

    // Helper function to safely get recipient display text
    const getRecipientDisplay = (message) => {
        if (!message.recipients) return 'Multiple recipients'
        
        if (Array.isArray(message.recipients)) {
            return message.recipients.length === 1 
                ? message.recipients[0]
                : `${message.recipients[0]} +${message.recipients.length - 1} more`
        }
        
        // Fallback for string recipients (backward compatibility)
        return message.recipients
    }

    // Helper function to get full recipients list for detail view
    const getFullRecipients = (message) => {
        if (!message.recipients) return 'No recipients'
        
        if (Array.isArray(message.recipients)) {
            return message.recipients.join(', ')
        }
        
        return message.recipients
    }

    const getDisplayMessages = () => {
        const messages = activeTab === 'inbox' ? inbox : sentMessages
        return messages
            .filter(msg => {
                const searchLower = searchTerm.toLowerCase()
                const contentMatch = msg.content.toLowerCase().includes(searchLower)
                
                if (activeTab === 'inbox') {
                    const senderMatch = msg.sender_name?.toLowerCase().includes(searchLower)
                    return contentMatch || senderMatch
                } else {
                    const recipients = Array.isArray(msg.recipients) ? msg.recipients : [msg.recipients]
                    const recipientMatch = recipients.some(recipient => 
                        recipient?.toLowerCase().includes(searchLower)
                    )
                    return contentMatch || recipientMatch
                }
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    const getAvatarColor = (name) => {
        const colors = [
            '#315a95', '#2c5aa0', '#274bab', '#225bb6', '#1d6cc1',
            '#186dcc', '#137ed7', '#0e8fe2', '#09a0ed', '#04b1f8'
        ]
        const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
        return colors[index]
    }

    const getAvatarText = (message) => {
        if (activeTab === 'inbox') {
            return message.sender_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
        } else {
            const firstRecipient = Array.isArray(message.recipients) 
                ? message.recipients[0] 
                : message.recipients?.split(',')[0]
            return firstRecipient?.split(' ').map(n => n[0]).join('').toUpperCase() || 'R'
        }
    }

    const displayMessages = getDisplayMessages()
    const filteredEmployees = getFilteredEmployees()

    return (
        <div className='Content Inbox'>
            <div className="inbox-container">
                {/* Sidebar */}
                <div className="inbox-sidebar">
                    {/* Header */}
                    <div className="sidebar-header">
                        <div className="user-info">
                            <div 
                                className="user-avatar"
                                style={{ 
                                    background: getAvatarColor(user?.first_name + ' ' + user?.last_name)
                                }}
                            >
                                {user?.first_name?.[0]}{user?.last_name?.[0]}
                            </div>
                            <div className="user-details">
                                <h3>{user?.first_name} {user?.last_name}</h3>
                                <span className="user-role">{user?.job}</span>
                            </div>
                        </div>
                        <button 
                            className="compose-btn"
                            onClick={() => setIsComposeOpen(true)}
                        >
                            <i className="fas fa-edit"></i>
                            Compose
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="sidebar-tabs">
                        <button 
                            className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('inbox')
                                setSelectedMessage(null)
                            }}
                        >
                            <i className="fas fa-inbox"></i>
                            <span className="tab-label">Inbox</span>
                            {inbox?.length > 0 && (
                                <span className="tab-badge">{inbox.length}</span>
                            )}
                        </button>
                        <button 
                            className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('sent')
                                setSelectedMessage(null)
                            }}
                        >
                            <i className="fas fa-paper-plane"></i>
                            <span className="tab-label">Sent</span>
                            {sentMessages?.length > 0 && (
                                <span className="tab-badge">{sentMessages.length}</span>
                            )}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="sidebar-search">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Messages List */}
                    <div className="messages-list">
                        {displayMessages.length === 0 ? (
                            <div className="empty-state">
                                <i className="fas fa-envelope-open-text"></i>
                                <h4>No messages found</h4>
                                <p>
                                    {activeTab === 'inbox' 
                                        ? 'When you receive messages, they will appear here.' 
                                        : 'Messages you send will appear here.'
                                    }
                                </p>
                            </div>
                        ) : (
                            displayMessages.map(message => (
                                <div 
                                    key={message.message_id}
                                    className={`message-item ${selectedMessage?.message_id === message.message_id ? 'selected' : ''} ${!message.is_read && activeTab === 'inbox' ? 'unread' : ''}`}
                                    onClick={() => {
                                        setSelectedMessage(message)
                                        if (mobileView) setMobileView(false)
                                        if (activeTab === 'inbox' && !message.is_read) {
                                            handleMarkAsRead(message.message_id)
                                        }
                                    }}
                                >
                                    <div 
                                        className="message-avatar"
                                        style={{ 
                                            background: getAvatarColor(
                                                activeTab === 'inbox' 
                                                    ? message.sender_name 
                                                    : getRecipientDisplay(message)
                                            ) 
                                        }}
                                    >
                                        {getAvatarText(message)}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="sender-name">
                                                {activeTab === 'inbox' 
                                                    ? message.sender_name 
                                                    : 'To: ' + getRecipientDisplay(message)
                                                }
                                            </span>
                                            <span className="message-time">
                                                {formatDate(message.created_at)}
                                            </span>
                                        </div>
                                        <div className="message-preview">
                                            {message.content.length > 60 
                                                ? message.content.substring(0, 60) + '...' 
                                                : message.content
                                            }
                                        </div>
                                        {!message.is_read && activeTab === 'inbox' && (
                                            <div className="unread-indicator"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail View */}
                <div className={`message-detail-panel ${!selectedMessage ? 'empty' : ''} ${mobileView ? 'mobile-hidden' : ''}`}>
                    {!selectedMessage ? (
                        <div className="empty-detail">
                            <i className="fas fa-envelope-open"></i>
                            <h3>Select a message</h3>
                            <p>Choose a message from your {activeTab} to read it here</p>
                        </div>
                    ) : (
                        <>
                            <div className="detail-header">
                                <div className="detail-header-main">
                                    {mobileView && (
                                        <button 
                                            className="back-btn"
                                            onClick={() => setMobileView(true)}
                                        >
                                            <i className="fas fa-arrow-left"></i>
                                        </button>
                                    )}
                                    <div className="message-meta">
                                        <h3>{activeTab === 'inbox' ? selectedMessage.sender_name : 'Sent Message'}</h3>
                                        <div className="meta-details">
                                            <span className="recipient-info">
                                                {activeTab === 'inbox' 
                                                    ? 'To: You' 
                                                    : `To: ${getFullRecipients(selectedMessage)}`
                                                }
                                            </span>
                                            <span className="time-info">
                                                {new Date(selectedMessage.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="detail-actions">
                                    <button className="action-btn" title="Reply">
                                        <i className="fas fa-reply"></i>
                                    </button>
                                    <button className="action-btn" title="Forward">
                                        <i className="fas fa-share"></i>
                                    </button>
                                    <button className="action-btn" title="Delete">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="message-detail-content">
                                <div className="message-body">
                                    {selectedMessage.content}
                                </div>
                                
                                {activeTab === 'inbox' && selectedMessage.read_at && (
                                    <div className="read-receipt">
                                        <i className="fas fa-check-double"></i>
                                        Read {formatDate(selectedMessage.read_at)}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Compose Message Modal */}
                {isComposeOpen && (
                    <div className="modal-overlay" onClick={() => !isSending && setIsComposeOpen(false)}>
                        <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="compose-header">
                                <h3>New Message</h3>
                                <div className="header-actions">
                                    <button 
                                        className="action-btn close"
                                        onClick={() => !isSending && setIsComposeOpen(false)}
                                        disabled={isSending}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="compose-body">
                                <div className="recipients-section">
                                    <label>To:</label>
                                    <div className="recipients-input">
                                        <div className="selected-recipients">
                                            {newMessage.recipients.map(recipientId => {
                                                const employee = employees?.find(emp => emp.employee_id === recipientId)
                                                return employee ? (
                                                    <span key={recipientId} className="recipient-tag">
                                                        {employee.first_name} {employee.last_name}
                                                        <button 
                                                            onClick={() => !isSending && handleRecipientToggle(recipientId)}
                                                            disabled={isSending}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </span>
                                                ) : null
                                            })}
                                        </div>
                                        <div className="recipient-search-wrapper">
                                            <i className="fas fa-search"></i>
                                            <input
                                                type="text"
                                                placeholder="Add recipients..."
                                                value={recipientSearch}
                                                onChange={(e) => setRecipientSearch(e.target.value)}
                                                disabled={isSending}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {recipientSearch && (
                                    <div className="recipients-dropdown">
                                        <div className="dropdown-header">
                                            <span>Select Recipients</span>
                                            <button 
                                                className="select-all-btn"
                                                onClick={handleSelectAllRecipients}
                                                disabled={isSending}
                                            >
                                                {newMessage.recipients.length === filteredEmployees.length 
                                                    ? 'Deselect All' 
                                                    : 'Select All'
                                                }
                                            </button>
                                        </div>
                                        <div className="dropdown-list">
                                            {filteredEmployees.length === 0 ? (
                                                <div className="no-results">
                                                    No employees found matching "{recipientSearch}"
                                                </div>
                                            ) : (
                                                filteredEmployees.map(employee => (
                                                    <div 
                                                        key={employee.employee_id}
                                                        className={`recipient-option ${newMessage.recipients.includes(employee.employee_id) ? 'selected' : ''}`}
                                                        onClick={() => !isSending && handleRecipientToggle(employee.employee_id)}
                                                    >
                                                        <div 
                                                            className="recipient-avatar"
                                                            style={{ background: getAvatarColor(employee.first_name + ' ' + employee.last_name) }}
                                                        >
                                                            {employee.first_name[0]}{employee.last_name[0]}
                                                        </div>
                                                        <div className="recipient-info">
                                                            <span className="recipient-name">
                                                                {employee.first_name} {employee.last_name}
                                                            </span>
                                                            <span className="recipient-job">{employee.job}</span>
                                                        </div>
                                                        <div className="recipient-checkbox">
                                                            <i className={`fas ${newMessage.recipients.includes(employee.employee_id) ? 'fa-check-square' : 'fa-square'}`}></i>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="message-content-section">
                                    <textarea
                                        placeholder="Write your message here..."
                                        value={newMessage.content}
                                        onChange={(e) => setNewMessage(prev => ({
                                            ...prev,
                                            content: e.target.value
                                        }))}
                                        rows="8"
                                        disabled={isSending}
                                    />
                                </div>
                            </div>

                            {sendStatus && (
                                <div className={`send-status ${sendStatus.type}`}>
                                    <i className={`fas ${sendStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                                    {sendStatus.message}
                                </div>
                            )}

                            <div className="compose-footer">
                                <div className="footer-actions">
                                    <button className="attachment-btn" disabled={isSending}>
                                        <i className="fas fa-paperclip"></i>
                                        Attach File
                                    </button>
                                </div>
                                <div className="send-actions">
                                    <button 
                                        className="cancel-btn"
                                        onClick={() => !isSending && setIsComposeOpen(false)}
                                        disabled={isSending}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="send-btn"
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.content.trim() || newMessage.recipients.length === 0 || isSending}
                                    >
                                        {isSending ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane"></i>
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Inbox