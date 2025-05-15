import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'interviewer';
  interviews: number;
}

interface Interview {
  id: string;
  date: Date;
  candidateName: string;
  interviewerName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AnalyticsData {
  totalInterviews: number;
  upcomingInterviews: number;
  completedInterviews: number;
  cancelledInterviews: number;
  totalCandidates: number;
  totalInterviewers: number;
  interviewsByDay: {
    date: string;
    count: number;
  }[];
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentInterviews, setRecentInterviews] = useState<Interview[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock analytics data
        const mockAnalytics: AnalyticsData = {
          totalInterviews: 157,
          upcomingInterviews: 42,
          completedInterviews: 98,
          cancelledInterviews: 17,
          totalCandidates: 85,
          totalInterviewers: 12,
          interviewsByDay: [
            { date: '2023-09-01', count: 5 },
            { date: '2023-09-02', count: 3 },
            { date: '2023-09-03', count: 0 },
            { date: '2023-09-04', count: 7 },
            { date: '2023-09-05', count: 4 },
            { date: '2023-09-06', count: 6 },
            { date: '2023-09-07', count: 2 }
          ]
        };
        
        // Mock recent interviews
        const mockInterviews: Interview[] = [
          {
            id: '1',
            date: new Date(Date.now() + 3600000), // 1 hour from now
            candidateName: 'Emily Johnson',
            interviewerName: 'Michael Smith',
            status: 'upcoming'
          },
          {
            id: '2',
            date: new Date(Date.now() + 86400000), // tomorrow
            candidateName: 'David Lee',
            interviewerName: 'Sarah Wilson',
            status: 'upcoming'
          },
          {
            id: '3',
            date: new Date(Date.now() - 3600000), // 1 hour ago
            candidateName: 'Jessica Brown',
            interviewerName: 'Robert Taylor',
            status: 'completed'
          },
          {
            id: '4',
            date: new Date(Date.now() - 7200000), // 2 hours ago
            candidateName: 'Thomas Garcia',
            interviewerName: 'Jennifer Adams',
            status: 'cancelled'
          }
        ];
        
        // Mock recent users
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Emma Wilson',
            email: 'emma@example.com',
            role: 'candidate',
            interviews: 2
          },
          {
            id: '2',
            name: 'James Miller',
            email: 'james@example.com',
            role: 'candidate',
            interviews: 1
          },
          {
            id: '3',
            name: 'Olivia Davis',
            email: 'olivia@example.com',
            role: 'interviewer',
            interviews: 8
          },
          {
            id: '4',
            name: 'William Martinez',
            email: 'william@example.com',
            role: 'interviewer',
            interviews: 12
          }
        ];
        
        setAnalytics(mockAnalytics);
        setRecentInterviews(mockInterviews);
        setRecentUsers(mockUsers);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load dashboard data. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [addNotification]);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Admin'}</p>
      </div>
      
      {/* Stats Overview */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Interviews</p>
                <p className="text-2xl font-semibold text-gray-800">{analytics?.totalInterviews}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <div>
                <span className="text-green-600 font-medium">{analytics?.upcomingInterviews}</span>
                <span className="text-gray-500 ml-1">Upcoming</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">{analytics?.completedInterviews}</span>
                <span className="text-gray-500 ml-1">Completed</span>
              </div>
              <div>
                <span className="text-red-600 font-medium">{analytics?.cancelledInterviews}</span>
                <span className="text-gray-500 ml-1">Cancelled</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Candidates</p>
                <p className="text-2xl font-semibold text-gray-800">{analytics?.totalCandidates}</p>
              </div>
            </div>
            <div className="mt-4 flex">
              <span className="text-green-600 text-sm">
                <span className="font-medium">+4</span> new this week
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Interviewers</p>
                <p className="text-2xl font-semibold text-gray-800">{analytics?.totalInterviewers}</p>
              </div>
            </div>
            <div className="mt-4 flex">
              <span className="text-purple-600 text-sm">
                <span className="font-medium">+1</span> new this week
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 mr-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Avg. Response Time</p>
                <p className="text-2xl font-semibold text-gray-800">4.2h</p>
              </div>
            </div>
            <div className="mt-4 flex">
              <span className="text-green-600 text-sm">
                <span className="font-medium">-12%</span> from last month
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Weekly Activity Chart */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Interviews This Week</h2>
          <div className="h-64 flex items-end justify-between">
            {analytics?.interviewsByDay.map((day, index) => (
              <div key={index} className="flex flex-col items-center w-full">
                <div 
                  className="bg-blue-500 rounded-t-sm w-10" 
                  style={{ height: `${day.count * 10}px` }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Interviews */}
        <section>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Interviews</h2>
              <button className="text-sm flex items-center text-blue-100 hover:text-white">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {recentInterviews.map((interview) => (
                <div key={interview.id} className="p-4 flex items-center">
                  <div className="flex-shrink-0">
                    {interview.status === 'upcoming' ? (
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Calendar className="h-5 w-5" />
                      </div>
                    ) : interview.status === 'completed' ? (
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-full bg-red-100 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {interview.candidateName} 
                      <span className="mx-2 text-gray-500">with</span> 
                      {interview.interviewerName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(interview.date)}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      interview.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800' 
                        : interview.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Recent Users */}
        <section>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
              <h2 className="text-lg font-medium">Recent Users</h2>
              <button className="text-sm flex items-center text-green-100 hover:text-white">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full ${
                      user.role === 'candidate' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="ml-4 flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'candidate' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    {user.role === 'interviewer' && (
                      <span className="ml-2 text-sm text-gray-500">
                        {user.interviews} interviews
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;