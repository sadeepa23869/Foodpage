import React, { useState, useEffect } from "react";
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "../../api";
import { 
  CircularProgress, 
  IconButton, 
  Badge,
  Avatar // Import Avatar from MUI
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const NotificationSection = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getNotifications();
      setNotifications(response.data || response);
      setUnreadCount((response.data || response).filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredNotifications = showAll 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md mt-0 border border-gray-200 flex flex-col min-h-[500px] max-h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Notifications</h2>
        <div className="flex space-x-2">
          <IconButton 
            onClick={() => setShowAll(!showAll)}
            color="primary"
            size="small"
          >
            <Badge badgeContent={unreadCount} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton 
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            color="primary"
            size="small"
          >
            <CheckIcon />
          </IconButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <CircularProgress />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            {showAll ? "You have no notifications." : "No unread notifications."}
          </p>
        ) : (
          <ul className="space-y-4 px-4 py-2">
            {filteredNotifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`flex items-start space-x-4 border-b pb-4 last:border-b-0 
                  ${!notification.isRead ? 'bg-blue-50 rounded-lg p-3' : ''}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex-shrink-0">
                  <Avatar
                    alt={notification.senderName}
                    src={notification.senderPhoto || undefined}
                    sx={{ width: 48, height: 48 }}
                  >
                    {notification.senderName ? notification.senderName.charAt(0) : ''}
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {notification.senderName}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {notification.message}
                      </div>
                    </div>
                    {!notification.isRead && (
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(notification.createdAt)}
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationSection;