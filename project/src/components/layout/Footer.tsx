import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Calendar className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold">InterviewSync</span>
            </div>
            <p className="text-gray-300 text-sm">
              Streamline your interview scheduling process with our automated platform.
              Save time, reduce conflicts, and focus on finding the right talent.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-300 mr-2" />
                <span className="text-gray-300">s.roshan0202@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-300 mr-2" />
                <span className="text-gray-300">+91 7530006460</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-300 text-sm text-center">
            &copy; {new Date().getFullYear()} InterviewSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;