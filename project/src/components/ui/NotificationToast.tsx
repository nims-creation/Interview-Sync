import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        removeNotification(notifications[0].id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, removeNotification]);
  
  if (notifications.length === 0) {
    return null;
  }
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-amber-50';
      default:
        return 'bg-blue-50';
    }
  };
  
  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-400';
      case 'error':
        return 'border-red-400';
      case 'warning':
        return 'border-amber-400';
      default:
        return 'border-blue-400';
    }
  };
  
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`${getBgColor(notification.type)} ${getBorderColor(notification.type)} border-l-4 p-4 shadow-md rounded-md max-w-md flex items-start animate-slide-in`}
        >
          <div className="flex-shrink-0 mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            {notification.title && (
              <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
            )}
            <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(notification.id)}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;