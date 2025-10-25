import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Video, X, Check, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';

interface Interview {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  interviewerName: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  videoLink?: string;
}

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://localhost:5000/api/interviews', config);
        const interviewsData: Interview[] = response.data.data.interviews.map((interview: any) => ({
          id: interview._id,
          date: new Date(interview.startTime),
          startTime: new Date(interview.startTime).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          endTime: new Date(interview.endTime).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          interviewerName: interview.interviewer?.name || 'Unknown',
          status: interview.status.toLowerCase(),
          videoLink: interview.videoLink
        }));

        setInterviews(interviewsData);
      } catch (error: any) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.response?.data?.message || 'Failed to load interviews. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [addNotification]);
  
  const handleCancelInterview = async (interviewId: string) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.patch(`http://localhost:5000/api/interviews/${interviewId}/cancel`, {}, config);

      setInterviews(interviews.map(interview =>
        interview.id === interviewId
          ? { ...interview, status: 'cancelled' as const }
          : interview
      ));

      addNotification({
        type: 'success',
        title: 'Interview Cancelled',
        message: 'The interview has been cancelled successfully.'
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.response?.data?.message || 'Failed to cancel the interview. Please try again.'
      });
    }
  };
  
  const upcomingInterviews = interviews.filter(interview => interview.status === 'scheduled');
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in">Candidate Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 animate-fade-in-delay">Welcome back, {user?.name || 'Candidate'}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/candidate/book">
            <Button leftIcon={<Calendar className="h-5 w-5" />} className="hover:shadow-xl transition-shadow duration-300">
              Book New Interview
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
                <Link to="/candidate/book">
                  <Button variant="outline" size="sm">
                    Book an Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 transition-transform hover:transform hover:scale-105">
                    <div className="bg-blue-600 text-white px-4 py-2 font-medium flex justify-between items-center">
                      <span>{formatDate(interview.date)}</span>
                      <span className="text-sm bg-blue-500 px-2 py-0.5 rounded">Upcoming</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start mb-4">
                        <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <h3 className="font-medium">Interviewer</h3>
                          <p>{interview.interviewerName}</p>
                        </div>
                      </div>
                      <div className="flex items-start mb-4">
                        <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                        <div>
                          <h3 className="font-medium">Time</h3>
                          <p>{formatTime(interview.startTime)} - {formatTime(interview.endTime)}</p>
                        </div>
                      </div>
                      {interview.videoLink && (
                        <div className="flex items-start mb-4">
                          <Video className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                          <div>
                            <h3 className="font-medium">Video Call</h3>
                            <a 
                              href={interview.videoLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Join meeting
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="flex mt-4 space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          leftIcon={<X className="h-4 w-4" />}
                          onClick={() => handleCancelInterview(interview.id)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="flex-1"
                          leftIcon={<Check className="h-4 w-4" />}
                          onClick={() => {
                            if (interview.videoLink) {
                              window.open(interview.videoLink, '_blank');
                            }
                          }}
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          {/* Past Interviews */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Interviews</h2>
            {pastInterviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-gray-700 font-medium">No Past Interviews</h3>
                <p className="text-gray-500 text-sm">
                  You don't have any past interviews.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interviewer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pastInterviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(interview.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(interview.startTime)} - {formatTime(interview.endTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {interview.interviewerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${interview.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {interview.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;