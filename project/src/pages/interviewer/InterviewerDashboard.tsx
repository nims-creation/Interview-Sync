import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, User, Users, CheckSquare, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface Interview {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  candidateName: string;
  candidateEmail: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  videoLink?: string;
}

const InterviewerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUpcoming: 0,
    totalCompleted: 0,
    totalCancelled: 0,
    totalSlots: 0
  });
  
  useEffect(() => {
    // Mock API call to fetch interviews
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockInterviews: Interview[] = [
          {
            id: '1',
            date: new Date(Date.now() + 86400000), // tomorrow
            startTime: '10:00',
            endTime: '10:30',
            candidateName: 'Alice Johnson',
            candidateEmail: 'alice@example.com',
            status: 'upcoming',
            videoLink: 'https://meet.jit.si/InterviewSyncMeeting123'
          },
          {
            id: '2',
            date: new Date(Date.now() + 172800000), // day after tomorrow
            startTime: '14:00',
            endTime: '14:45',
            candidateName: 'Bob Smith',
            candidateEmail: 'bob@example.com',
            status: 'upcoming',
            videoLink: 'https://meet.jit.si/InterviewSyncMeeting456'
          },
          {
            id: '3',
            date: new Date(Date.now() + 259200000), // 3 days from now
            startTime: '11:00',
            endTime: '11:30',
            candidateName: 'Charlie Brown',
            candidateEmail: 'charlie@example.com',
            status: 'upcoming',
            videoLink: 'https://meet.jit.si/InterviewSyncMeeting789'
          },
          {
            id: '4',
            date: new Date(Date.now() - 86400000), // yesterday
            startTime: '13:00',
            endTime: '13:45',
            candidateName: 'David Lee',
            candidateEmail: 'david@example.com',
            status: 'completed'
          },
          {
            id: '5',
            date: new Date(Date.now() - 172800000), // 2 days ago
            startTime: '15:00',
            endTime: '15:30',
            candidateName: 'Eve Wilson',
            candidateEmail: 'eve@example.com',
            status: 'cancelled'
          }
        ];
        
        setInterviews(mockInterviews);
        
        // Calculate stats
        const upcomingCount = mockInterviews.filter(i => i.status === 'upcoming').length;
        const completedCount = mockInterviews.filter(i => i.status === 'completed').length;
        const cancelledCount = mockInterviews.filter(i => i.status === 'cancelled').length;
        
        setStats({
          totalUpcoming: upcomingCount,
          totalCompleted: completedCount,
          totalCancelled: cancelledCount,
          totalSlots: 15 // Mock total available slots
        });
      } catch (error) {
        addNotification({ 
          type: 'error', 
          title: 'Error', 
          message: 'Failed to load interviews. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, [addNotification]);
  
  const upcomingInterviews = interviews.filter(interview => interview.status === 'upcoming');
  const pastInterviews = interviews.filter(interview => interview.status === 'completed' || interview.status === 'cancelled');
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const getTodayInterviews = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return interviews.filter(
      interview => 
        interview.status === 'upcoming' && 
        interview.date >= today && 
        interview.date < tomorrow
    );
  };
  
  const todayInterviews = getTodayInterviews();
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviewer Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name || 'Interviewer'}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/interviewer/slots">
            <Button leftIcon={<Calendar className="h-5 w-5" />}>
              Manage Availability
            </Button>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Overview */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Upcoming Interviews</p>
                    <p className="text-2xl font-semibold text-gray-800">{stats.totalUpcoming}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <CheckSquare className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-2xl font-semibold text-gray-800">{stats.totalCompleted}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-100 mr-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Cancelled</p>
                    <p className="text-2xl font-semibold text-gray-800">{stats.totalCancelled}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Available Slots</p>
                    <p className="text-2xl font-semibold text-gray-800">{stats.totalSlots}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Today's Interviews */}
          {todayInterviews.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Interviews</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden border border-blue-200">
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                  <p className="text-blue-800 font-medium">You have {todayInterviews.length} interviews scheduled for today.</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {todayInterviews.map((interview) => (
                    <div key={interview.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatTime(interview.startTime)} - {formatTime(interview.endTime)}
                          </p>
                          <p className="text-sm text-gray-600">{interview.candidateName}</p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0">
                        {interview.videoLink && (
                          <a 
                            href={interview.videoLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Video className="h-4 w-4 mr-1.5" />
                            Join Meeting
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* Upcoming Interviews */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
            {upcomingInterviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-700 font-medium mb-1">No Upcoming Interviews</h3>
                <p className="text-gray-500 text-sm mb-4">
                  You don't have any upcoming interviews scheduled.
                </p>
                <Link to="/interviewer/slots">
                  <Button variant="outline" size="sm">
                    Manage Availability
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingInterviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(interview.date)}</div>
                          <div className="text-sm text-gray-500">{formatTime(interview.startTime)} - {formatTime(interview.endTime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                              <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Confirmed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {interview.videoLink && (
                            <a 
                              href={interview.videoLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 font-medium hover:underline"
                            >
                              Join Meeting
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          
          {/* Past Interviews */}
          {pastInterviews.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Interviews</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pastInterviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatDate(interview.date)}</div>
                          <div className="text-sm text-gray-500">{formatTime(interview.startTime)} - {formatTime(interview.endTime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{interview.candidateName}</div>
                              <div className="text-sm text-gray-500">{interview.candidateEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            interview.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {interview.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewerDashboard;