import React from "react";

const mockNotifications = [
  {
    id: 1,
    type: "like",
    message: "John Doe liked your post.",
    date: "2025-04-18 09:30",
    unread: true,
    title: "John Doe liked your post",
    time: "2025-04-18 09:30",
  },
  {
    id: 2,
    type: "comment",
    message: "Jane Smith commented: 'Great job!'",
    date: "2025-04-18 08:45",
    unread: false,
    title: "Jane Smith commented on your post",
    time: "2025-04-18 08:45",
  },
  {
    id: 3,
    type: "follow",
    message: "Michael Lee started following you.",
    date: "2025-04-17 17:00",
    unread: true,
    title: "Michael Lee started following you",
    time: "2025-04-17 17:00",
  },
];

const NotificationSection = () => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md mt-0 border border-gray-200 flex flex-col min-h-[500px] max-h-full p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Notifications</h2>
      <div className="flex-1 overflow-y-auto">
        {mockNotifications.length === 0 ? (
          <p className="text-gray-500">You have no notifications.</p>
        ) : (
          <ul className="space-y-4 px-4 py-2">
            {mockNotifications.map((n) => (
              <li key={n.id} className="flex items-center space-x-4 border-b pb-4 last:border-b-0">
                <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: n.unread ? '#1e88e5' : '#e0e0e0' }}></div>
                <div>
                  <div className="font-semibold text-gray-800">{n.title}</div>
                  <div className="text-xs text-gray-500">{n.time}</div>
                  <div className="text-sm text-gray-700 mt-1">{n.message}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationSection;
