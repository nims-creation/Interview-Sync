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
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 py-20 px-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
              Streamline Your Interview Scheduling Process
            </h1>
            <p className="text-xl mb-8 text-primary-100 animate-fade-in-delay">
              Automate interview coordination, eliminate scheduling conflicts, and focus on finding the right talent.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
              {isAuthenticated ? (
                <Link to={getDashboardLink()}>
                  <Button size="lg" variant="outline" className="bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-xl transition-all duration-300">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" variant="outline" className="bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-xl transition-all duration-300">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-xl transition-all duration-300">
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
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
            Say Goodbye to Scheduling Headaches
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-accent-100 dark:border-neutral-700 transition-transform hover:transform hover:scale-105 animate-slide-up">
              <div className="bg-primary-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Smart Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatically sync with Google Calendar to find the perfect time slots for both interviewers and candidates.
              </p>
            </div>
            
            <div className="bg-accent-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-accent-100 dark:border-neutral-700 transition-transform hover:transform hover:scale-105 animate-slide-up">
              <div className="bg-primary-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Automated Reminders</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send timely notifications and reminders to reduce no-shows and keep everyone on the same page.
              </p>
            </div>
            
            <div className="bg-accent-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-accent-100 dark:border-neutral-700 transition-transform hover:transform hover:scale-105 animate-slide-up">
              <div className="bg-primary-600 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">Secure Video Links</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate secure video conference links automatically for each interview, integrated directly into calendar invites.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-slide-up">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Set Availability</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Interviewers mark their available time slots or sync with Google Calendar.
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Book Interviews</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Candidates browse available slots and select their preferred time.
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Automated Confirmation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Everyone receives calendar invites with video links automatically.
              </p>
            </div>
            
            <div className="text-center animate-slide-up">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Join Interview</h3>
              <p className="text-gray-600 dark:text-gray-400">
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
      <section className="py-16 px-4 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
            Trusted by Hiring Teams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-accent-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-accent-100 dark:border-neutral-700 transition-transform hover:transform hover:scale-105 animate-slide-up">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent-50 dark:bg-accent-900 flex items-center justify-center text-accent-700 dark:text-accent-300 font-bold text-xl">
                  TC
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Thomas Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">HR Director, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "We reduced our interview scheduling time by 75% and eliminated double-bookings completely. A game-changer for our hiring process."
              </p>
            </div>

            <div className="bg-accent-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-accent-100 dark:border-neutral-700 transition-transform hover:transform hover:scale-105 animate-slide-up">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-success-50 dark:bg-success-900 flex items-center justify-center text-success-700 dark:text-success-300 font-bold text-xl">
                  SJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tech Recruiter, StartupX</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "The automatic reminders have cut our no-show rate in half, and candidates love how easy it is to reschedule when needed."
              </p>
            </div>

            <div className="bg-accent-50 dark:bg-neutral-800 p-6 rounded-lg shadow-sm border border-accent-100 dark:border-neutral-700 transition-transform hover:transform hover:scale-105 animate-slide-up">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-accent-50 dark:bg-accent-900 flex items-center justify-center text-accent-700 dark:text-accent-300 font-bold text-xl">
                  MR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engineering Manager, DevHQ</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                "As an interviewer, I love how it syncs with my calendar and blocks off times automatically. No more context switching between multiple tools."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary-600 py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-primary-100">
            Join thousands of companies that have streamlined their interview scheduling with InterviewSync.
          </p>
          <Link to={isAuthenticated ? getDashboardLink() : "/register"}>
            <Button size="lg" variant="outline" className="bg-white dark:bg-neutral-900 text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-neutral-800">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;