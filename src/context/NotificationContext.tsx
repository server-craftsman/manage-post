import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAllPosts } from '../services/posts';
import moment from 'moment';

interface NotificationContextType {
  newNotificationsCount: number;
  resetNewNotificationsCount: () => void;
  isNewNotification: (date: string) => boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  newNotificationsCount: 0,
  resetNewNotificationsCount: () => {},
  isNewNotification: () => false,
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);
  const [lastViewedDate, setLastViewedDate] = useState(moment());

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

  const resetNewNotificationsCount = useCallback(() => {
    setNewNotificationsCount(0);
    setLastViewedDate(moment());
  }, []);

  const isNewNotification = useCallback((date: string) => {
    return moment(date).isAfter(lastViewedDate);
  }, [lastViewedDate]);

  return (
    <NotificationContext.Provider value={{ newNotificationsCount, resetNewNotificationsCount, isNewNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};