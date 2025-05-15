import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  const getDashboardLink = () => {
    if (!user?.role) return '/login';
    
    switch (user.role) {
      case 'candidate':
        return '/candidate/dashboard';
      case 'interviewer':
        return '/interviewer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Streamline Your Interview Scheduling Process
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Automate interview coordination, eliminate scheduling conflicts, and focus on finding the right talent.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link to={getDashboardLink()}>
                  <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Say Goodbye to Scheduling Headaches
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 transition-transform hover:transform hover:scale-105">
              <div className="bg-blue-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Scheduling</h3>
              <p className="text-gray-600">
                Automatically sync with Google Calendar to find the perfect time slots for both interviewers and candidates.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 transition-transform hover:transform hover:scale-105">
              <div className="bg-blue-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Automated Reminders</h3>
              <p className="text-gray-600">
                Send timely notifications and reminders to reduce no-shows and keep everyone on the same page.
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100 transition-transform hover:transform hover:scale-105">
              <div className="bg-blue-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Secure Video Links</h3>
              <p className="text-gray-600">
                Generate secure video conference links automatically for each interview, integrated directly into calendar invites.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Set Availability</h3>
              <p className="text-gray-600">
                Interviewers mark their available time slots or sync with Google Calendar.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Book Interviews</h3>
              <p className="text-gray-600">
                Candidates browse available slots and select their preferred time.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Automated Confirmation</h3>
              <p className="text-gray-600">
                Everyone receives calendar invites with video links automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Join Interview</h3>
              <p className="text-gray-600">
                Click the video link at the scheduled time to start the interview.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to={isAuthenticated ? getDashboardLink() : "/register"}>
              <Button size="lg" variant="primary" rightIcon={<CheckCircle className="h-5 w-5" />}>
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Now'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Trusted by Hiring Teams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                  TC
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Thomas Chen</h4>
                  <p className="text-sm text-gray-600">HR Director, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700">
                "We reduced our interview scheduling time by 75% and eliminated double-bookings completely. A game-changer for our hiring process."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
                  SJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Tech Recruiter, StartupX</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The automatic reminders have cut our no-show rate in half, and candidates love how easy it is to reschedule when needed."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                  MR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-600">Engineering Manager, DevHQ</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As an interviewer, I love how it syncs with my calendar and blocks off times automatically. No more context switching between multiple tools."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-600 py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join thousands of companies that have streamlined their interview scheduling with InterviewSync.
          </p>
          <Link to={isAuthenticated ? getDashboardLink() : "/register"}>
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;