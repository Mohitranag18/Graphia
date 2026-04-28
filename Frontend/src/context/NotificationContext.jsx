import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { get_notifications, mark_notifications_read, get_unread_count, get_unread_messages_count } from '../api/endpoints';
import { useToast } from './ToastContext';
import { useAuth } from './useAuth';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const socketRef = useRef(null);
    const { showToast } = useToast();
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await get_notifications();
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const data = await get_unread_count();
            if (data && typeof data.unread_count === 'number') {
                setUnreadCount(data.unread_count);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, []);

    const fetchUnreadMessageCount = useCallback(async () => {
        try {
            const data = await get_unread_messages_count();
            if (data && typeof data.unread_count === 'number') {
                setUnreadMessageCount(data.unread_count);
            }
        } catch (error) {
            console.error('Error fetching unread message count:', error);
        }
    }, []);

    const markAsRead = useCallback(async (ids = null) => {
        try {
            await mark_notifications_read(ids);
            if (ids) {
                setNotifications(prev =>
                    prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - ids.length));
            } else {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    }, []);

    // Connect WebSocket for real-time notifications
    useEffect(() => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            return;
        }

        const wsBase = import.meta.env.VITE_WS_BASE_URL || 'ws://127.0.0.1:8000';
        const wsUrl = `${wsBase}/ws/notifications/`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Notification WebSocket connected');
        };

        ws.onmessage = (event) => {
            try {
                const notification = JSON.parse(event.data);
                if (notification.notification_type === 'new_message') {
                    setUnreadMessageCount(prev => prev + 1);
                    showToast(notification.message, 'info');
                } else {
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    showToast(notification.message, 'info');
                }
            } catch (error) {
                console.error('Error parsing notification:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('Notification WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('Notification WebSocket disconnected');
        };

        socketRef.current = ws;

        return () => {
            ws.close();
        };
    }, [showToast, user]);

    // Fetch initial data
    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
            fetchUnreadMessageCount();
        }
    }, [fetchNotifications, fetchUnreadCount, fetchUnreadMessageCount, user]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            unreadMessageCount,
            setUnreadMessageCount,
            fetchNotifications,
            fetchUnreadCount,
            fetchUnreadMessageCount,
            markAsRead,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
