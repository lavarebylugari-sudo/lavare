import React, { useState, useEffect } from 'react';

const ALL_ADDONS = ['Pawdicure', 'Blueberry Facial', 'Aromatherapy', 'De-Shedding Treatment'];
const ALL_TIME_SLOTS = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM'];

const Booking: React.FC = () => {
  const [service, setService] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addons, setAddons] = useState<string[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [wasPaid, setWasPaid] = useState(false);
  const [suggestedAddons, setSuggestedAddons] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [isReferralApplied, setIsReferralApplied] = useState(false);
  const [referralError, setReferralError] = useState('');


  // Effect to suggest add-ons based on service and pet type
  useEffect(() => {
    const getSuggestions = () => {
        if (!service) return [];
        
        let suggestions: string[] = [];
        switch(service) {
            case 'The Luxe Wash':
                suggestions.push('Blueberry Facial', 'Pawdicure');
                break;
            case 'Glamour Cut & Style':
                suggestions.push('Pawdicure');
                if (petType === 'Long-Haired Dog') {
                    suggestions.push('De-Shedding Treatment');
                }
                break;
            case 'Vitality Spa Day':
                suggestions.push('Aromatherapy', 'Blueberry Facial');
                break;
            case "Puppy's First Groom":
                 suggestions.push('Pawdicure');
                break;
        }
        return suggestions;
    };
    
    setSuggestedAddons(getSuggestions());
  }, [service, petType]);

  // Effect to simulate fetching booked times for the selected date
  useEffect(() => {
    let newBookedTimes: string[] = [];
    if (date) {
        // Simple pseudo-random logic based on the day of the month to simulate dynamic availability
        const dayOfMonth = new Date(date).getDate();
        if (dayOfMonth % 4 === 0) {
            newBookedTimes = ['10:30 AM', '03:00 PM'];
        } else if (dayOfMonth % 3 === 0) {
            newBookedTimes = ['09:00 AM', '12:00 PM', '04:30 PM'];
        } else if (dayOfMonth % 2 === 0) {
             newBookedTimes = ['01:30 PM'];
        }
    }
    setBookedTimes(newBookedTimes);

    // If the currently selected time is now unavailable on the new date, reset it
    if (newBookedTimes.includes(time)) {
        setTime('');
    }
  }, [date, time]);


  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) {
        alert("Please select an available time slot.");
        return;
    }
    console.log({ service, petName, petType, date, time, addons, paid: wasPaid, referralCode: isReferralApplied ? referralCode : '' });
    setIsBooked(true);
  };
  
  const handleAddonToggle = (addon: string) => {
    setAddons(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  };

  const handleApplyCode = () => {
    if (referralCode.toUpperCase() === 'LAVARE10') {
      setIsReferralApplied(true);
      setReferralError('');
    } else {
      setIsReferralApplied(false);
      setReferralError('Invalid referral code. Please try again.');
    }
  };
  
  const handleReset = () => {
    setService('');
    setPetName('');
    setPetType('');
    setDate('');
    setTime('');
    setAddons([]);
    setIsBooked(false);
    setWasPaid(false);
    setBookedTimes([]);
    setReferralCode('');
    setIsReferralApplied(false);
    setReferralError('');
  };
  
  const handleAddToCalendar = () => {
    if (!date || !time || !service || !petName) return;

    const [timePart, ampm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    const startDate = new Date(`${date}T00:00:00`);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Assume 1 hour duration

    const formatICSDate = (d: Date) => d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:LAVARE Grooming for ${petName}`,
      `DESCRIPTION:Service: ${service}\\nAdd-ons: ${addons.join(', ') || 'None'}`,
      'LOCATION:LAVARE Pet Salon',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `LAVARE_Appointment_${petName}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isBooked) {
    return (
      <div className="text-center max-w-lg mx-auto bg-white p-12 rounded-xl shadow-lg transition-all duration-500 animate-fade-in">
        <h2 className="font-display text-4xl text-[#D4AF37]">
          {wasPaid ? 'Payment Successful!' : 'Appointment Confirmed!'}
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          Your luxurious experience has been booked. We can't wait to pamper {petName}!
        </p>

        <div className="mt-8 text-left bg-amber-50 p-6 rounded-lg border border-amber-200 space-y-3">
            <h3 className="font-display text-xl text-center text-[#333333] mb-4">Booking Summary</h3>
            <p><strong className="text-gray-800">Service:</strong> {service}</p>
            <p><strong className="text-gray-800">Pet:</strong> {petName}</p>
            <p><strong className="text-gray-800">Date:</strong> {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong className="text-gray-800">Time:</strong> {time}</p>
            {addons.length > 0 && <p><strong className="text-gray-800">Add-ons:</strong> {addons.join(', ')}</p>}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={handleAddToCalendar} className="bg-[#333333] text-white px-6 py-3 rounded-md hover:bg-[#555] transition-colors flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Add to Calendar
            </button>
            <button onClick={handleReset} className="bg-[#D4AF37] text-white px-6 py-3 rounded-md hover:bg-[#b3922e] transition-colors">
                Book Another Appointment
            </button>
        </div>
      </div>
    );
  }
  
  const otherAddons = ALL_ADDONS.filter(a => !suggestedAddons.includes(a));

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="font-display text-4xl mb-8 text-center">Book a Luxurious Experience</h2>
      <form onSubmit={handleBooking} className="bg-white p-8 rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">1. Select a Service</label>
                <select id="service" value={service} onChange={e => setService(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                    <option value="">Choose a service...</option>
                    <option>The Luxe Wash</option>
                    <option>Glamour Cut & Style</option>
                    <option>Vitality Spa Day</option>
                    <option>Puppy's First Groom</option>
                </select>
            </div>
             <div>
                <label htmlFor="petType" className="block text-sm font-medium text-gray-700 mb-2">2. Pet's Type</label>
                <select id="petType" value={petType} onChange={e => setPetType(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]">
                    <option value="">Choose pet type...</option>
                    <option>Long-Haired Dog</option>
                    <option>Short-Haired Dog</option>
                    <option>Cat</option>
                </select>
            </div>
        </div>
        
        <div>
          <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-2">3. Pet's Name</label>
          <input type="text" id="petName" value={petName} onChange={e => setPetName(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]" />
        </div>

        <div>
           <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">4. Date</label>
           <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]" min={new Date().toISOString().split("T")[0]} />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">5. Select a Time</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ALL_TIME_SLOTS.map(t => {
              const isBooked = bookedTimes.includes(t);
              return (
                <button 
                  type="button" 
                  key={t} 
                  onClick={() => setTime(t)} 
                  disabled={isBooked}
                  className={`p-3 rounded-md border text-center transition-colors ${
                    isBooked 
                      ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed' 
                      : time === t 
                        ? 'bg-[#333333] text-white border-transparent' 
                        : 'bg-gray-50 hover:bg-gray-200'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {date && <p className="text-xs text-gray-500 mt-2">Unavailable slots are already booked for the selected date.</p>}
        </div>

        <div className="col-span-1 md:col-span-2">
           <h3 className="text-sm font-medium text-gray-700 mb-2">6. Optional Add-ons</h3>
           {suggestedAddons.length > 0 && (
            <div className="mb-4 p-4 bg-amber-50 rounded-lg">
                <h4 className="text-sm font-semibold text-[#D4AF37] mb-2">Suggested for You</h4>
                <div className="flex flex-wrap gap-3">
                    {suggestedAddons.map(addon => (
                        <button type="button" key={addon} onClick={() => handleAddonToggle(addon)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${addons.includes(addon) ? 'bg-[#D4AF37] text-white border-transparent' : 'bg-white border-gray-300 hover:bg-gray-100'}`}>
                            {addon}
                        </button>
                    ))}
                </div>
            </div>
           )}
           {otherAddons.length > 0 && (
             <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">{suggestedAddons.length > 0 ? 'Other Add-ons' : ''}</h4>
                <div className="flex flex-wrap gap-3">
                    {otherAddons.map(addon => (
                        <button type="button" key={addon} onClick={() => handleAddonToggle(addon)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${addons.includes(addon) ? 'bg-[#D4AF37] text-white border-transparent' : 'bg-transparent border-gray-300 hover:bg-gray-100'}`}>
                            {addon}
                        </button>
                    ))}
                </div>
             </div>
           )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Have a Referral Code? (Try LAVARE10)</h3>
          <div className="flex items-start space-x-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => { setReferralCode(e.target.value); setReferralError(''); }}
              placeholder="Enter code"
              disabled={isReferralApplied}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={handleApplyCode}
              disabled={isReferralApplied || !referralCode}
              className="flex-shrink-0 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isReferralApplied ? 'Applied!' : 'Apply'}
            </button>
          </div>
          {referralError && <p className="text-red-500 text-xs mt-1">{referralError}</p>}
          {isReferralApplied && <p className="text-green-600 text-sm mt-2 font-semibold">Success! A 10% referral discount has been applied.</p>}
        </div>

        <div className="col-span-1 md:col-span-2 border-t pt-6 flex justify-end items-center space-x-4">
            <button type="submit" onClick={() => { setWasPaid(true) }} className="text-sm font-medium text-white bg-[#D4AF37] px-8 py-3 rounded-md hover:bg-[#b3922e] transition-colors">
              {isReferralApplied ? 'Pay Now & Save 15%' : 'Pay Now & Save 5%'}
            </button>
            <button type="submit" onClick={() => { setWasPaid(false) }} className="text-white bg-[#333333] px-8 py-3 rounded-md hover:bg-[#555] transition-colors">
              Book Appointment
            </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;