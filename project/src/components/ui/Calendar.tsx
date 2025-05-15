import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  availableSlots?: Date[];
  bookedSlots?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  availableSlots = [],
  bookedSlots = [],
  minDate,
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(value));
  
  // Format dates to string for comparison
  const formatDateForComparison = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const availableDates = availableSlots.map(formatDateForComparison);
  const bookedDates = bookedSlots.map(formatDateForComparison);
  
  const daysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const firstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };
  
  const prevMonth = () => {
    const prevMonthDate = new Date(currentMonth);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    setCurrentMonth(prevMonthDate);
  };
  
  const nextMonth = () => {
    const nextMonthDate = new Date(currentMonth);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    setCurrentMonth(nextMonthDate);
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth);
    newDate.setDate(day);
    onChange(newDate);
  };
  
  const renderDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }
    
    // Calendar days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDateForComparison(date);
      const isSelected = value && formatDateForComparison(value) === dateStr;
      const isAvailable = availableDates.includes(dateStr);
      const isBooked = bookedDates.includes(dateStr);
      const isToday = formatDateForComparison(new Date()) === dateStr;
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate) || isPast;
      
      let className = 'flex items-center justify-center h-10 w-10 rounded-full text-sm';
      
      if (isDisabled) {
        className += ' text-gray-300 cursor-not-allowed';
      } else if (isSelected) {
        className += ' bg-blue-600 text-white';
      } else if (isBooked) {
        className += ' bg-red-100 text-red-800 cursor-pointer hover:bg-red-200';
      } else if (isAvailable) {
        className += ' bg-green-100 text-green-800 cursor-pointer hover:bg-green-200';
      } else if (isToday) {
        className += ' border border-blue-600 text-blue-600 cursor-pointer hover:bg-blue-50';
      } else {
        className += ' text-gray-700 cursor-pointer hover:bg-gray-100';
      }
      
      days.push(
        <button
          key={day}
          disabled={isDisabled}
          className={className}
          onClick={() => !isDisabled && handleDateClick(day)}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
      
      <div className="mt-4 flex items-center justify-start space-x-4 text-xs">
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-100 mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-red-100 mr-1"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full border border-blue-600 mr-1"></div>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;