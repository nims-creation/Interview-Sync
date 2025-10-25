import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 dark:bg-neutral-900 text-white py-8 transition-colors duration-300 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4 group">
              <Calendar className="h-6 w-6 text-primary-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="ml-2 text-xl font-bold group-hover:text-primary-300 transition-colors duration-300">InterviewSync</span>
            </div>
            <p className="text-neutral-300 dark:text-neutral-400 text-sm">
              Streamline your interview scheduling process with our automated platform.
              Save time, reduce conflicts, and focus on finding the right talent.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-300 dark:text-neutral-400 hover:text-white dark:hover:text-neutral-200 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-300 dark:text-neutral-400 hover:text-white dark:hover:text-neutral-200 transition-colors duration-200">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-neutral-300 dark:text-neutral-400 hover:text-white dark:hover:text-neutral-200 transition-colors duration-200">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-neutral-300 dark:text-neutral-400 mr-2" />
                <span className="text-neutral-300 dark:text-neutral-400">nimscreation06@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-neutral-300 dark:text-neutral-400 mr-2" />
                <span className="text-neutral-300 dark:text-neutral-400">+91 8953227595</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-700 dark:border-neutral-700">
          <p className="text-neutral-300 dark:text-neutral-400 text-sm text-center">
            &copy; {new Date().getFullYear()} InterviewSync by Nitesh Mishra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;