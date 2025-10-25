import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, Clock, Calendar as CalendarIcon, Check } from 'lucide-react';
import Button from '../../components/ui/Button';
import Calendar from '../../components/ui/Calendar';
import TimeSlotPicker from '../../components/ui/TimeSlotPicker';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';

interface Interviewer {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

interface TimeSlot {
  id: string;
  interviewerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const step = 1;
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedInterviewerId, setSelectedInterviewerId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [allSlots, setAllSlots] = useState<TimeSlot[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  
  // Mock data for available dates with slots
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        // Fetch available slots from API
        const slotsResponse = await axios.get('http://localhost:5000/api/slots', config);
        const slots: TimeSlot[] = slotsResponse.data.data.slots.map((slot: any) => ({
          id: slot._id,
          interviewerId: slot.interviewerId,
          date: new Date(slot.startTime),
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: !slot.isAvailable
        }));

        // Fetch interviewers from slots data
        const uniqueInterviewers = new Map();
        slots.forEach(slot => {
          if (slot.interviewerId && !uniqueInterviewers.has(slot.interviewerId)) {
            uniqueInterviewers.set(slot.interviewerId, {
              id: slot.interviewerId,
              name: 'Interviewer', // We'll need to get this from the slot population
              role: 'interviewer',
              department: 'Engineering'
            });
          }
        });
        
        const interviewers: Interviewer[] = Array.from(uniqueInterviewers.values());

        // Generate available dates from slots
        const dates = [...new Set(slots.map(slot => slot.date.toISOString().split('T')[0]))]
          .map(dateStr => new Date(dateStr))
          .sort((a, b) => a.getTime() - b.getTime());

        setInterviewers(interviewers);
        setAllSlots(slots);
        setAvailableDates(dates);

        // Set initial available slots for the selected date
        updateAvailableSlotsForDate(selectedDate, slots, selectedInterviewerId);
      } catch (error: any) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.response?.data?.message || 'Failed to load booking data. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [addNotification, selectedDate]);
  
  const updateAvailableSlotsForDate = (date: Date, slots: TimeSlot[], interviewerId: string | null) => {
    const dateStr = date.toISOString().split('T')[0];
    
    let filteredSlots = slots.filter(slot => {
      const slotDateStr = new Date(slot.date).toISOString().split('T')[0];
      return slotDateStr === dateStr && !slot.isBooked;
    });
    
    if (interviewerId) {
      filteredSlots = filteredSlots.filter(slot => slot.interviewerId === interviewerId);
    }
    
    setAvailableSlots(filteredSlots);
    
    // Clear selected slot if it's not available on the new date
    if (selectedSlotId) {
      const slotExists = filteredSlots.some(slot => slot.id === selectedSlotId);
      if (!slotExists) {
        setSelectedSlotId(null);
      }
    }
  };
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateAvailableSlotsForDate(date, allSlots, selectedInterviewerId);
  };
  
  const handleInterviewerSelect = (interviewerId: string) => {
    setSelectedInterviewerId(interviewerId);
    updateAvailableSlotsForDate(selectedDate, allSlots, interviewerId);
  };
  
  const handleClearInterviewer = () => {
    setSelectedInterviewerId(null);
    updateAvailableSlotsForDate(selectedDate, allSlots, null);
  };
  
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };
  
  const handleBookInterview = async () => {
    if (!selectedSlotId) return;

    setIsBooking(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const selectedSlot = availableSlots.find(slot => slot.id === selectedSlotId);
      if (!selectedSlot) {
        throw new Error('Selected slot not found');
      }

      const interviewer = interviewers.find(i => i.id === selectedSlot.interviewerId);
      if (!interviewer) {
        throw new Error('Interviewer not found');
      }

      await axios.post('http://localhost:5000/api/interviews', {
        title: `Interview with ${interviewer.name}`,
        description: 'Scheduled interview session',
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        interviewerId: selectedSlot.interviewerId,
        slotId: selectedSlotId
      }, config);

      addNotification({
        type: 'success',
        title: 'Interview Booked',
        message: 'Your interview has been scheduled successfully.'
      });

      navigate('/candidate/dashboard');
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Booking Failed',
        message: error.response?.data?.message || 'Failed to book the interview. Please try again.'
      });
    } finally {
      setIsBooking(false);
    }
  };
  
  const getSelectedSlot = () => {
    return selectedSlotId ? availableSlots.find(slot => slot.id === selectedSlotId) : null;
  };
  
  const getInterviewerById = (id: string) => {
    return interviewers.find(interviewer => interviewer.id === id);
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
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Book an Interview</h1>
        <p className="text-gray-600">Select an available time slot that works for you.</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/5">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Select Date</h2>
              <div className="text-sm text-gray-500">Step {step} of 3</div>
            </div>
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              availableSlots={availableDates}
              minDate={new Date()}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Filter by Interviewer</h2>
              {selectedInterviewerId && (
                <button 
                  onClick={handleClearInterviewer}
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              {interviewers.map(interviewer => (
                <button
                  key={interviewer.id}
                  onClick={() => handleInterviewerSelect(interviewer.id)}
                  className={`w-full text-left p-3 rounded-md flex items-center ${
                    selectedInterviewerId === interviewer.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'border border-gray-200 hover:border-blue-200 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {interviewer.avatar ? (
                      <img 
                        src={interviewer.avatar} 
                        alt={interviewer.name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{interviewer.name}</p>
                    <p className="text-xs text-gray-500">{interviewer.role}, {interviewer.department}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:w-3/5 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-3">
              <h2 className="text-lg font-medium">Available Time Slots</h2>
              <p className="text-sm text-blue-100">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="p-4">
              <TimeSlotPicker
                date={selectedDate}
                slots={availableSlots.map(slot => ({
                  id: slot.id,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  isBooked: slot.isBooked
                }))}
                selectedSlotId={selectedSlotId}
                onSelectSlot={handleSlotSelect}
              />
            </div>
          </div>
          
          {selectedSlotId && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-sm text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Time</p>
                    <p className="text-sm text-gray-900">
                      {getSelectedSlot()?.startTime} - {getSelectedSlot()?.endTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Interviewer</p>
                    <p className="text-sm text-gray-900">
                      {getSelectedSlot() && getInterviewerById(getSelectedSlot()!.interviewerId)?.name}
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  fullWidth
                  isLoading={isBooking}
                  leftIcon={<Check className="h-5 w-5" />}
                  onClick={handleBookInterview}
                >
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;