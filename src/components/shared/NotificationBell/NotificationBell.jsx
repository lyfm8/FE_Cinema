import { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { socket } from '@/utils/socket';
import { notificationService } from './notificationService';
import useAuth from '@/features/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchInitialData = async () => {
      try {
        const countRes = await notificationService.getUnreadCount();
        setUnreadCount(countRes.data?.count || 0);

        const listRes = await notificationService.getAllNotifications(1, 10);
        const data = listRes.data || [];
        setNotifications(data);
        if (data.length < 10) setHasMore(false);
      } catch (error) {
        console.error('Lỗi khi tải thông báo:', error);
      }
    };

    fetchInitialData();
  }, [isAuthenticated, user]);

  // Socket.io logic
  useEffect(() => {
    if (!isAuthenticated || !user) {
      socket.disconnect();
      return;
    }

    const onConnect = () => {
      socket.emit('join-notification', { userId: user.id });
    };

    // Kết nối và lắng nghe sự kiện connect để join room
    socket.on('connect', onConnect);
    socket.connect();

    // Nếu socket đã connect từ trước (do re-render)
    if (socket.connected) {
      onConnect();
    }

    // Lắng nghe thông báo mới
    socket.on('new-notification', (newNoti) => {
      console.log('Nhận thông báo mới:', newNoti);
      setNotifications(prev => [newNoti, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('new-notification');
      socket.emit('leave-notification', { userId: user.id });
      socket.disconnect();
    };
  }, [isAuthenticated, user]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = async (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        const nextPage = page + 1;
        const res = await notificationService.getAllNotifications(nextPage, 10);
        const newNotis = res.data || [];
        
        if (newNotis.length === 0) {
          setHasMore(false);
        } else {
          setNotifications(prev => [...prev, ...newNotis]);
          setPage(nextPage);
          if (newNotis.length < 10) setHasMore(false);
        }
      } catch (error) {
        console.error('Lỗi khi tải thêm thông báo:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Lỗi đánh dấu đã đọc:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Lỗi đánh dấu tất cả đã đọc:', error);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti.isRead) {
      await handleMarkAsRead(noti.id);
    }
    if (noti.link) {
      setIsOpen(false);
      navigate(noti.link);
    }
  };

  // Nếu chưa đăng nhập thì không hiện chuông
  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative p-2 text-stone hover:text-galaxyBlue transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon className="w-6 h-6 text-gray-600 hover:text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white shadow-xl border border-gray-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <h3 className="font-bold text-gray-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto" onScroll={handleScroll}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 py-8">
                Bạn chưa có thông báo nào.
              </div>
            ) : (
              notifications.map((noti) => (
                <div 
                  key={noti.id} 
                  className={`p-4 border-b border-gray-50 transition-colors cursor-pointer ${!noti.isRead ? 'bg-blue-50/20' : ''} ${noti.link ? 'hover:bg-gray-100' : 'hover:bg-gray-50'}`}
                  onClick={() => handleNotificationClick(noti)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!noti.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {noti.subject}
                    </h4>
                    {!noti.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></span>}
                  </div>
                  <p className={`text-xs ${!noti.isRead ? 'text-gray-800' : 'text-gray-500'} line-clamp-2`}>
                    {noti.content}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {new Date(noti.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))
            )}
            {isLoadingMore && (
              <div className="p-3 text-center text-xs text-gray-500">
                Đang tải thêm...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;