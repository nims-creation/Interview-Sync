import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Calendar as CalendarIcon, Clock, Info, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Calendar from '../../components/ui/Calendar';
import { useNotification } from '../../contexts/NotificationContext';

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const ManageSlotsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [newSlot, setNewSlot] = useState({
    startTime: '09:00',
    endTime: '09:45'
  });
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock data for dates with slots
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate random slots for the current month
        const slots: TimeSlot[] = [];
        const dates: Date[] = [];
        const today = new Date();
        
        // Generate dates for the next 30 days
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          
          // Skip weekends
          if (date.getDay() !== 0 && date.getDay() !== 6) {
            dates.push(new Date(date));
            
            // Add 2-4 slots per weekday
            const slotsPerDay = Math.floor(Math.random() * 3) + 2;
            const startHours = [9, 10, 11, 13, 14, 15, 16];
            
            // Shuffle start hours
            const shuffledHours = [...startHours].sort(() => 0.5 - Math.random());
            const selectedHours = shuffledHours.slice(0, slotsPerDay);
            
            selectedHours.forEach(hour => {
              const slotDate = new Date(date);
              const startTime = `${hour}:00`;
              
              // Each slot is 45 minutes
              const endHour = hour + (45 >= 60 ? 1 : 0);
              const endMinute = 45 % 60;
              const endTime = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
              
              slots.push({
                id: `slot-${date.toISOString().split('T')[0]}-${startTime}`,
                date: slotDate,
                startTime,
                endTime,
                isBooked: Math.random() > 0.7 // 30% chance of being booked
              });
            });
          }
        }
        
        setSlots(slots);
        setAvailableDates(dates);
        
        // Simulate Google Calendar connection status
        setIsGoogleCalendarConnected(false);
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load availability data. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [addNotification]);
  
  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return slots.filter(slot => {
      const slotDateStr = new Date(slot.date).toISOString().split('T')[0];
      return slotDateStr === dateStr;
    }).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };
  
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowTimeSlotForm(false);
  };
  
  const handleDeleteSlot = (slotId: string) => {
    if (slots.find(slot => slot.id === slotId)?.isBooked) {
      addNotification({
        type: 'warning',
        title: 'Cannot Delete',
        message: 'This slot has already been booked. You cannot delete it.'
      });
      return;
    }
    
    setSlots(slots.filter(slot => slot.id !== slotId));
    addNotification({
      type: 'success',
      message: 'Time slot removed successfully'
    });
  };
  
  const handleAddSlot = async () => {
    setIsSaving(true);
    
    try {
      // Validate time
      const [startHour, startMinute] = newSlot.startTime.split(':').map(Number);
      const [endHour, endMinute] = newSlot.endTime.split(':').map(Number);
      
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      if (endTotalMinutes <= startTotalMinutes) {
        throw new Error('End time must be after start time');
      }
      
      if (endTotalMinutes - startTotalMinutes < 15) {
        throw new Error('Slot must be at least 15 minutes long');
      }
      
      // Check for overlaps
      const dateSlots = getSlotsForDate(selectedDate);
      const hasOverlap = dateSlots.some(slot => {
        const [existingStartHour, existingStartMinute] = slot.startTime.split(':').map(Number);
        const [existingEndHour, existingEndMinute] = slot.endTime.split(':').map(Number);
        
        const existingStartTotalMinutes = existingStartHour * 60 + existingStartMinute;
        const existingEndTotalMinutes = existingEndHour * 60 + existingEndMinute;
        
        // Check if new slot overlaps with existing slot
        return (
          (startTotalMinutes >= existingStartTotalMinutes && startTotalMinutes < existingEndTotalMinutes) ||
          (endTotalMinutes > existingStartTotalMinutes && endTotalMinutes <= existingEndTotalMinutes) ||
          (startTotalMinutes <= existingStartTotalMinutes && endTotalMinutes >= existingEndTotalMinutes)
        );
      });
      
      if (hasOverlap) {
        throw new Error('This slot overlaps with existing slots');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add new slot
      const newSlotId = `slot-${selectedDate.toISOString().split('T')[0]}-${newSlot.startTime}`;
      
      setSlots([...slots, {
        id: newSlotId,
        date: new Date(selectedDate),
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        isBooked: false
      }]);
      
      setShowTimeSlotForm(false);
      setNewSlot({
        startTime: '09:00',
        endTime: '09:45'
      });
      
      addNotification({
        type: 'success',
        message: 'New time slot added successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add time slot'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleConnectGoogleCalendar = () => {
    // In a real app, this would initiate the OAuth flow
    addNotification({
      type: 'info',
      title: 'Google Calendar',
      message: 'Google Calendar integration will be implemented in the full version.'
    });
  };
  
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  const selectedDateSlots = getSlotsForDate(selectedDate);
  
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
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Manage Availability</h1>
        <p className="text-gray-600">Set your available time slots for interviews.</p>
      </div>
      
      {!isGoogleCalendarConnected && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Connect your Google Calendar to automatically sync your availability and interviews.
              </p>
              <div className="mt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={handleConnectGoogleCalendar}
                  className="border-blue-500 text-blue-700 hover:bg-blue-100"
                >
                  Connect Google Calendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/5">
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Select Date</h2>
              <Calendar
                value={selectedDate}
                onChange={handleDateChange}
                availableSlots={availableDates}
                minDate={new Date()}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  fullWidth
                  leftIcon={<Plus className="h-5 w-5" />}
                  onClick={() => {
                    setShowTimeSlotForm(prev => !prev);
                  }}
                >
                  Add Time Slot for Selected Date
                </Button>
                
                <Button 
                  variant="outline" 
                  fullWidth
                  leftIcon={<CalendarIcon className="h-5 w-5" />}
                  onClick={() => {
                    addNotification({
                      type: 'info',
                      message: 'Bulk availability management will be implemented in the full version.'
                    });
                  }}
                >
                  Set Recurring Availability
                </Button>
              </div>
            </div>
          </div>
          
          <div className="lg:w-3/5">
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
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
                {selectedDateSlots.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-gray-700 font-medium mb-1">No Time Slots Available</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      You haven't added any time slots for this date yet.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => setShowTimeSlotForm(true)}
                    >
                      Add Time Slot
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateSlots.map((slot) => (
                      <div 
                        key={slot.id}
                        className={`p-3 rounded-md border flex items-center justify-between ${
                          slot.isBooked 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-500 mr-3" />
                          <div>
                            <p className="font-medium">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </p>
                            {slot.isBooked && (
                              <p className="text-xs text-blue-600 flex items-center mt-1">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Booked
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={slot.isBooked}
                          className={`p-1.5 rounded-full transition-colors ${
                            slot.isBooked
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {showTimeSlotForm && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Time Slot</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                      disabled
                      className="block w-full rounded-md border-gray-300 bg-gray-100 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <select
                        id="startTime"
                        value={newSlot.startTime}
                        onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        {Array.from({ length: 16 }, (_, i) => i + 8).map(hour => (
                          <option key={hour} value={`${hour}:00`}>{formatTime(`${hour}:00`)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <select
                        id="endTime"
                        value={newSlot.endTime}
                        onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                        className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        {Array.from({ length: 16 }, (_, i) => i + 8).map(hour => (
                          <>
                            <option key={`${hour}:15`} value={`${hour}:15`}>{formatTime(`${hour}:15`)}</option>
                            <option key={`${hour}:30`} value={`${hour}:30`}>{formatTime(`${hour}:30`)}</option>
                            <option key={`${hour}:45`} value={`${hour}:45`}>{formatTime(`${hour}:45`)}</option>
                            {hour < 23 && <option key={`${hour + 1}:00`} value={`${hour + 1}:00`}>{formatTime(`${hour + 1}:00`)}</option>}
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowTimeSlotForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      isLoading={isSaving}
                      onClick={handleAddSlot}
                    >
                      Add Slot
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSlotsPage;