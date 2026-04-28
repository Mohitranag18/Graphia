import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useNotifications } from '../context/NotificationContext';
import BlankImage from '../assets/blank_profile_picture2.png';
import '../styles/NotificationDropdown.css';

function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead } = useNotifications();
    const nav = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(prev => {
            const newState = !prev;
            if (newState && unreadCount > 0) {
                markAsRead();
            }
            return newState;
        });
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const handleMarkAllRead = async () => {
        await markAsRead();
    };

    const handleNotificationClick = (notification) => {
        // Mark this notification as read
        if (!notification.is_read) {
            markAsRead([notification.id]);
        }
        closeDropdown();

        // Navigate based on notification type
        switch (notification.notification_type) {
            case 'follow':
                nav(`/user/${notification.sender_username}`);
                window.location.reload();
                break;
            case 'like':
            case 'comment':
                if (notification.post || notification.post_id) {
                    nav(`/post/${notification.post || notification.post_id}`);
                }
                break;
            case 'message':
                nav(`/chat/${notification.sender_username}`);
                break;
            default:
                break;
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMin = Math.floor(diffMs / 60000);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffMin < 1) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay < 7) return `${diffDay}d ago`;
        return date.toLocaleDateString();
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'follow': return '👤';
            case 'like': return '❤️';
            case 'comment': return '💬';
            case 'message': return '✉️';
            default: return '🔔';
        }
    };

    return (
        <div className="notification-wrapper">
            <button className="notification-bell" onClick={toggleDropdown}>
                <IoNotificationsOutline />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="notification-overlay" onClick={closeDropdown} />
                    <div className="notification-dropdown">
                        <div className="notification-dropdown-header">
                            <h4>Notifications</h4>
                            {unreadCount > 0 && (
                                <button
                                    className="notification-mark-read"
                                    onClick={handleMarkAllRead}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="notification-dropdown-body">
                            {notifications.length === 0 ? (
                                <p className="notification-empty">No notifications yet</p>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notif)}
                                    >
                                        <img
                                            src={notif.sender_profile_image || BlankImage}
                                            alt=""
                                            className="notification-avatar"
                                        />
                                        <div className="notification-content">
                                            <p className="notification-text">{notif.message}</p>
                                            <span className="notification-time">
                                                {formatTimeAgo(notif.created_at)}
                                            </span>
                                        </div>
                                        <span className={`notification-type-icon ${notif.notification_type}`}>
                                            {getTypeLabel(notif.notification_type)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default NotificationDropdown;
