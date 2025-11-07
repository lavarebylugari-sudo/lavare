
import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import { MOCK_APPOINTMENTS } from '../constants';

const CalendarDay: React.FC<{ day: number; hasAppointment: boolean; isToday: boolean; isSelected: boolean; onClick: () => void }> = ({ day, hasAppointment, isToday, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`h-24 border border-gray-200 flex flex-col p-2 cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-[#D4AF37] text-white' : 'hover:bg-amber-50'}`}
  >
    <span className={`self-end font-medium ${isToday ? 'bg-[#333333] text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>{day}</span>
    {hasAppointment && <div className={`mt-auto h-2 w-2 rounded-full mx-auto ${isSelected ? 'bg-white' : 'bg-[#D4AF37]'}`}></div>}
  </div>
);

const AppointmentDetails: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const handleAddToCalendar = () => {
        const startDate = new Date(`${appointment.date}T${appointment.time.includes('PM') ? (parseInt(appointment.time.split(':')[0]) % 12 + 12) : parseInt(appointment.time.split(':')[0])}:${appointment.time.split(':')[1].slice(0, 2)}:00`);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const formatICSDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, '');
        };
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${formatICSDate(startDate)}`,
            `DTEND:${formatICSDate(endDate)}`,
            `SUMMARY:Grooming Appointment for ${appointment.petName}`,
            `DESCRIPTION:Service: ${appointment.service}\\nAdd-ons: ${appointment.addons.join(', ') || 'None'}`,
            'LOCATION:LAVARE Pet Salon',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `LAVARE_Appointment_${appointment.petName}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 space-y-3">
            <h4 className="font-bold text-lg text-[#333333]">{appointment.service} for {appointment.petName}</h4>
            <p className="text-gray-600"><strong>Time:</strong> {appointment.time}</p>
            {appointment.addons.length > 0 && <p className="text-gray-600"><strong>Add-ons:</strong> {appointment.addons.join(', ')}</p>}
            <div className="flex space-x-2 pt-2">
                <button onClick={handleAddToCalendar} className="text-sm bg-[#333333] text-white px-4 py-2 rounded-md hover:bg-[#555] transition-colors">Add to Calendar</button>
                <button className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">Add a Service</button>
            </div>
        </div>
    );
};


const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const appointmentsByDate = useMemo(() => {
    return MOCK_APPOINTMENTS.reduce((acc, appt) => {
      (acc[appt.date] = acc[appt.date] || []).push(appt);
      return acc;
    }, {} as Record<string, Appointment[]>);
  }, []);

  const selectedDateString = selectedDate?.toISOString().split('T')[0];
  const appointmentsForSelectedDay = selectedDateString ? appointmentsByDate[selectedDateString] || [] : [];

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="border border-gray-200"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const today = new Date();
    const isToday = today.getFullYear() === date.getFullYear() && today.getMonth() === date.getMonth() && today.getDate() === day;
    const isSelected = selectedDateString === dateString;

    calendarDays.push(
      <CalendarDay
        key={day}
        day={day}
        hasAppointment={!!appointmentsByDate[dateString]}
        isToday={isToday}
        isSelected={isSelected}
        onClick={() => setSelectedDate(date)}
      />
    );
  }

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="container mx-auto">
      <h2 className="font-display text-4xl mb-6">Your Appointments</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
            <h3 className="font-display text-2xl">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold py-2 bg-gray-50">{day}</div>
            ))}
            {calendarDays}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-display text-2xl">
            {selectedDate ? selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
          </h3>
          {appointmentsForSelectedDay.length > 0 ? (
            appointmentsForSelectedDay.map(appt => <AppointmentDetails key={appt.id} appointment={appt} />)
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <p className="text-gray-500">No appointments scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
