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
    useEffect(() => {
        if (messagesSocket && user) {
            console.log('User ID:', user.employee_id)       
            messagesSocket.emit('join_user', user.employee_id)
            messagesSocket.emit('fetch_inbox', user.employee_id)
            messagesSocket.emit('fetch_sent', user.employee_id)
        }
        console.log('Sent Messages:', sentMessages)
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

        messagesSocket.emit('send_message', {
            sender_id: user.employee_id,
            content: newMessage.content,
            recipients: newMessage.recipients
        }, (ack) => {
            if (ack?.success) {
                setNewMessage({ recipients: [], content: '' })
                setIsComposeOpen(false)
                messagesSocket.emit('fetch_sent', user.employee_id)
            } else {
                alert(ack?.error || 'Failed to send message')
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
        const allEmployeeIds = employees?.map(emp => emp.employee_id) || []
        setNewMessage(prev => ({
            ...prev,
            recipients: prev.recipients.length === allEmployeeIds.length ? [] : allEmployeeIds
        }))
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getDisplayMessages = () => {
        console.log(inbox)
        console.log(sentMessages)
        const messages = activeTab === 'inbox' ? inbox : sentMessages
        return messages.filter(msg => 
            msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (activeTab === 'inbox' 
                ? msg.sender_name?.toLowerCase().includes(searchTerm.toLowerCase())
                : msg.recipients?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }

    const getAvatarText = (message) => {
        if (activeTab === 'inbox') {
            return message.sender_name?.split(' ').map(n => n[0]).join('') || 'U'
        } else {
            // For sent messages, use the first letter of the first recipient
            console.log(message)
             const firstRecipient = message.recipients?.join(',')[0]?.trim() || 'R'
             return firstRecipient.split(' ').map(n => n[0]).join('')
        }
    }

    const displayMessages = getDisplayMessages()

    return (
        <div className='Content Inbox'>
            <div className="inbox-container">
                {/* Header */}
                <div className="inbox-header">
                    <h1>Messages</h1>
                    <button 
                        className="compose-btn"
                        onClick={() => setIsComposeOpen(true)}
                    >
                        <i className="fas fa-edit"></i>
                        Compose
                    </button>
                </div>

                {/* Tabs */}
                <div className="inbox-tabs">
                    <button 
                        className={`tab ${activeTab === 'inbox' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inbox')}
                    >
                        <i className="fas fa-inbox"></i>
                        Inbox ({inbox?.length || 0})
                    </button>
                    <button 
                        className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        <i className="fas fa-paper-plane"></i>
                        Sent ({sentMessages?.length || 0})
                    </button>
                </div>

                {/* Search */}
                <div className="inbox-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'inbox' ? 'messages' : 'sent messages'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Messages List */}
                <div className="messages-list">
                    {displayMessages.length === 0 ? (
                        <div className="empty-state">
                            <i className="fas fa-envelope-open"></i>
                            <h3>No messages</h3>
                            <p>
                                {activeTab === 'inbox' 
                                    ? 'Your inbox is empty' 
                                    : 'No sent messages yet'
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
                                    if (activeTab === 'inbox' && !message.is_read) {
                                        handleMarkAsRead(message.message_id)
                                    }
                                }}
                            >
                                <div className="message-avatar">
                                    {getAvatarText(message)}
                                </div>
                                <div className="message-content">
                                    <div className="message-header">
                                        <span className="sender-name">
                                            {activeTab === 'inbox' 
                                                ? message.sender_name 
                                                : `To: ${message.recipients || 'Multiple recipients'}`
                                            }
                                        </span>
                                        <span className="message-time">
                                            {formatDate(message.created_at)}
                                        </span>
                                    </div>
                                    <div className="message-preview">
                                        {message.content}
                                    </div>
                                    {!message.is_read && activeTab === 'inbox' && (
                                        <div className="unread-indicator"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Message Detail View */}
                {selectedMessage && (
                    <div className="message-detail">
                        <div className="detail-header">
                            <button 
                                className="back-btn"
                                onClick={() => setSelectedMessage(null)}
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <h3>Message Details</h3>
                        </div>
                        
                        <div className="message-detail-content">
                            <div className="detail-sender">
                                <strong>
                                    {activeTab === 'inbox' ? 'From:' : 'To:'}
                                </strong>
                                <span>
                                    {activeTab === 'inbox' 
                                        ? selectedMessage.sender_name 
                                        : selectedMessage.recipients
                                    }
                                </span>
                            </div>
                            
                            <div className="detail-time">
                                <strong>Sent:</strong>
                                <span>{formatDate(selectedMessage.created_at)}</span>
                            </div>

                            {activeTab === 'inbox' && selectedMessage.read_at && (
                                <div className="detail-read">
                                    <strong>Read:</strong>
                                    <span>{formatDate(selectedMessage.read_at)}</span>
                                </div>
                            )}

                            <div className="detail-message">
                                {selectedMessage.content}
                            </div>
                        </div>
                    </div>
                )}

                {/* Compose Message Modal */}
                {isComposeOpen && (
                    <div className="modal-overlay" onClick={() => setIsComposeOpen(false)}>
                        <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="compose-header">
                                <h3>New Message</h3>
                                <button 
                                    className="close-btn"
                                    onClick={() => setIsComposeOpen(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="compose-recipients">
                                <label>To:</label>
                                <div className="recipients-selector">
                                    <button 
                                        className="select-all-btn"
                                        onClick={handleSelectAllRecipients}
                                    >
                                        {newMessage.recipients.length === employees?.length 
                                            ? 'Deselect All' 
                                            : 'Select All'
                                        }
                                    </button>
                                    <div className="recipients-list">
                                        {employees?.map(employee => (
                                            <div 
                                                key={employee.employee_id}
                                                className={`recipient-option ${newMessage.recipients.includes(employee.employee_id) ? 'selected' : ''}`}
                                                onClick={() => handleRecipientToggle(employee.employee_id)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={newMessage.recipients.includes(employee.employee_id)}
                                                    onChange={() => {}}
                                                />
                                                <span className="recipient-name">
                                                    {employee.last_name} {employee.first_name} ({employee.job})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="compose-content">
                                <textarea
                                    placeholder="Type your message here..."
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage(prev => ({
                                        ...prev,
                                        content: e.target.value
                                    }))}
                                    rows="6"
                                />
                            </div>

                            <div className="compose-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setIsComposeOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="send-btn"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.content.trim() || newMessage.recipients.length === 0}
                                >
                                    <i className="fas fa-paper-plane"></i>
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Inbox