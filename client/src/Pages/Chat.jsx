import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStoreState } from 'easy-peasy';
import { useSocket } from '../hooks/useSocket'

const Chat = () => {

    const [messages, setMessages] = useState([
        { id: 1, sender: 'John Doe', text: 'Has anyone checked the manufacturing timeline for Project Alpha?', timestamp: '10:30 AM', isMe: false },
        { id: 2, sender: 'You', text: 'Yes, it\'s on track. We should complete by Friday.', timestamp: '10:32 AM', isMe: true },
        { id: 3, sender: 'Sarah Wilson', text: 'The electrical team needs access to the schematics. Can someone share them?', timestamp: '10:35 AM', isMe: false },
        { id: 4, sender: 'Mike Johnson', text: 'I\'ve uploaded them to the project folder.', timestamp: '10:37 AM', isMe: false }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const onlineUsers = [
        { id: 1, name: 'John Doe', role: 'Project Manager', isOnline: true },
        { id: 2, name: 'Sarah Wilson', role: 'Electrical Engineer', isOnline: true },
        { id: 3, name: 'Mike Johnson', role: 'Mechanical Engineer', isOnline: false },
        { id: 4, name: 'You', role: 'Site Manager', isOnline: true }
    ];

    const [activeChat, setActiveChat] = useState('team'); // 'team' or direct message user id
    const [directMessages, setDirectMessages] = useState({});
    
    const messagesEndRef = useRef(null);
    const user = useStoreState(state => state.user); // Assuming you have user in your store
    const eventHandlers = useMemo(() => ({
        'chat message': (msg) => {
            console.log("Received from server:", msg);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'Server', text: msg, timestamp: 'Now', isMe: false }]);
        }
    }), []);
    const socket = useSocket(eventHandlers)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        console.log('cli')
        socket.emit('chat message', 'Hello World!')
        const newMsg = {
        id: messages.length + 1,
        sender: 'You',
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
        };
        
        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
        }
    };

    const startDirectMessage = (userId) => {
        const user = onlineUsers.find(u => u.id === userId);
        setActiveChat(userId);
        
        // Initialize direct messages if not exists
        if (!directMessages[userId]) {
        setDirectMessages({
            ...directMessages,
            [userId]: [
            {
                id: 1,
                sender: 'System',
                text: `You started a conversation with ${user.name}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: false
            }
            ]
        });
        }
    };

    const getMessagesToDisplay = () => {
        if (activeChat === 'team') {
        return messages;
        } else {
        return directMessages[activeChat] || [];
        }
    };

    const getActiveChatName = () => {
        if (activeChat === 'team') {
        return 'Team Chat';
        } else {
        const user = onlineUsers.find(u => u.id === activeChat);
        return user ? user.name : 'Direct Message';
        }
    };

    return (
        <div className="Content Chat">
        <div className="chat-container">
            <div className="chat-sidebar">
            <div className="sidebar-header">
                <h3>Chat</h3>
                <button className="new-chat-btn">
                <i className="fas fa-plus"></i>
                </button>
            </div>
            
            <div className="chat-channels">
                <div 
                className={`channel-item ${activeChat === 'team' ? 'active' : ''}`}
                onClick={() => setActiveChat('team')}
                >
                <div className="channel-icon">
                    <i className="fas fa-users"></i>
                </div>
                <div className="channel-info">
                    <span className="channel-name">Team Chat</span>
                    <span className="channel-last-msg">Sarah: Need schematics...</span>
                </div>
                <div className="unread-count">3</div>
                </div>
                
                <div className="channel-section">
                <span className="section-title">Direct Messages</span>
                {onlineUsers.filter(u => u.id !== user?.id).map(user => (
                    <div 
                    key={user.id}
                    className={`channel-item ${activeChat === user.id ? 'active' : ''}`}
                    onClick={() => startDirectMessage(user.id)}
                    >
                    <div className="channel-avatar">
                        <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt={user.name} />
                        <span className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}></span>
                    </div>
                    <div className="channel-info">
                        <span className="channel-name">{user.name}</span>
                        <span className="channel-role">{user.role}</span>
                    </div>
                    {user.isOnline && <div className="unread-count">1</div>}
                    </div>
                ))}
                </div>
            </div>
            </div>
            
            <div className="chat-main">
            <div className="chat-header">
                <div className="header-info">
                <h3>{getActiveChatName()}</h3>
                <span className="participants-count">
                    {activeChat === 'team' ? `${onlineUsers.length} participants` : 'Direct message'}
                </span>
                </div>
                <div className="header-actions">
                <button className="header-btn">
                    <i className="fas fa-phone"></i>
                </button>
                <button className="header-btn">
                    <i className="fas fa-video"></i>
                </button>
                <button className="header-btn">
                    <i className="fas fa-info-circle"></i>
                </button>
                </div>
            </div>
            
            <div className="messages-container">
                {getMessagesToDisplay().map(message => (
                <div key={message.id} className={`message ${message.isMe ? 'my-message' : 'other-message'}`}>
                    {!message.isMe && activeChat === 'team' && (
                    <div className="message-sender">{message.sender}</div>
                    )}
                    <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    <div className="message-time">{message.timestamp}</div>
                    </div>
                </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="message-input-container">
                <div className="input-actions">
                <button className="action-btn">
                    <i className="fas fa-paperclip"></i>
                </button>
                <button className="action-btn">
                    <i className="fas fa-image"></i>
                </button>
                </div>
                <div className="message-input-wrapper">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows="1"
                />
                </div>
                <button 
                className="send-button"
                onClick={handleSendMessage}
                disabled={newMessage.trim() === ''}
                >
                <i className="fas fa-paper-plane"></i>
                </button>
            </div>
            </div>
            
            <div className="chat-details">
            <div className="details-header">
                <h4>Chat Details</h4>
            </div>
            
            {activeChat === 'team' ? (
                <div className="team-details">
                <div className="detail-section">
                    <h5>Participants ({onlineUsers.length})</h5>
                    {onlineUsers.map(user => (
                    <div key={user.id} className="participant-item">
                        <div className="participant-avatar">
                        <img src={`https://i.pravatar.cc/40?u=${user.id}`} alt={user.name} />
                        <span className={`status-indicator ${user.isOnline ? 'online' : 'offline'}`}></span>
                        </div>
                        <div className="participant-info">
                        <span className="participant-name">{user.name}</span>
                        <span className="participant-role">{user.role}</span>
                        </div>
                        <div className="participant-actions">
                        <button className="action-btn">
                            <i className="fas fa-comment"></i>
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                
                <div className="detail-section">
                    <h5>Shared Files</h5>
                    <div className="file-item">
                    <div className="file-icon">
                        <i className="fas fa-file-pdf"></i>
                    </div>
                    <div className="file-info">
                        <span className="file-name">Project_Schematics.pdf</span>
                        <span className="file-details">2.4 MB · 2 days ago</span>
                    </div>
                    </div>
                    <div className="file-item">
                    <div className="file-icon">
                        <i className="fas fa-file-excel"></i>
                    </div>
                    <div className="file-info">
                        <span className="file-name">Timeline_Update.xlsx</span>
                        <span className="file-details">1.1 MB · Yesterday</span>
                    </div>
                    </div>
                </div>
                </div>
            ) : (
                <div className="user-details">
                {(() => {
                    const user = onlineUsers.find(u => u.id === activeChat);
                    return user ? (
                    <>
                        <div className="user-profile">
                        <div className="profile-avatar">
                            <img src={`https://i.pravatar.cc/80?u=${user.id}`} alt={user.name} />
                            <span className={`status-indicator large ${user.isOnline ? 'online' : 'offline'}`}></span>
                        </div>
                        <h4>{user.name}</h4>
                        <p>{user.role}</p>
                        </div>
                        
                        <div className="detail-section">
                        <h5>Contact Information</h5>
                        <div className="contact-info">
                            <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>{user.name.toLowerCase().replace(' ', '.')}@company.com</span>
                            </div>
                            <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <span>+1 (555) 123-4567</span>
                            </div>
                        </div>
                        </div>
                        
                        <div className="detail-section">
                        <h5>Shared Files</h5>
                        <p className="no-files">No files shared yet</p>
                        </div>
                    </>
                    ) : null;
                })()}
                </div>
            )}
            </div>
        </div>
        </div>
    );
};

export default Chat;