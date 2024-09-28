import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllPosts } from '../services/posts';
import moment from 'moment';

interface NotificationContextType {
  newNotificationsCount: number;
}

const NotificationContext = createContext<NotificationContextType>({ newNotificationsCount: 0 });

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  useEffect(() => {
    const checkNewNotifications = async () => {
      const allNotifications = await getAllPosts();
      const lastDay = moment().subtract(1, 'days');
      const newCount = allNotifications.filter(notification => 
        moment(notification.createDate).isAfter(lastDay)
      ).length;
      setNewNotificationsCount(newCount);
    };

    checkNewNotifications();
    const interval = setInterval(checkNewNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ newNotificationsCount }}>
      {children}
    </NotificationContext.Provider>
  );
};