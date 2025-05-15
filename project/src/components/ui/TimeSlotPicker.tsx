import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked?: boolean;
}

interface TimeSlotPickerProps {
  date: Date;
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  date,
  slots,
  selectedSlotId,
  onSelectSlot,
}) => {
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-gray-700 font-medium mb-1">No Available Slots</h3>
        <p className="text-gray-500 text-sm">
          There are no available time slots for {date.toLocaleDateString()}.
          Please select another date.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-800 font-medium mb-4">
        Available time slots for {date.toLocaleDateString()}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => !slot.isBooked && onSelectSlot(slot.id)}
            disabled={slot.isBooked}
            className={`
              p-3 rounded-md border transition-colors duration-200 flex items-center
              ${selectedSlotId === slot.id 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : slot.isBooked
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
              }
            `}
          >
            <Clock className={`h-4 w-4 mr-2 ${selectedSlotId === slot.id ? 'text-blue-500' : slot.isBooked ? 'text-gray-400' : 'text-gray-500'}`} />
            <span>
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;