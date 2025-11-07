import React, { useState, useEffect } from 'react';

const ALL_ADDONS = ['Pawdicure', 'Blueberry Facial', 'Aromatherapy', 'De-Shedding Treatment'];

// Comprehensive time slots every 30 minutes
const ALL_TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
];

// Service durations and pricing
const SERVICE_DURATIONS = {
  'The Luxe Wash': { duration: 60, basePrice: 45, colorOptions: false },
  'Glamour Cut & Style': { duration: 90, basePrice: 65, colorOptions: true },
  'Vitality Spa Day': { duration: 120, basePrice: 120, colorOptions: true },
  'Puppy\'s First Groom': { duration: 45, basePrice: 35, colorOptions: false },
  'Color & Cut Express': { duration: 75, basePrice: 85, colorOptions: true },
  'Full Color Treatment': { duration: 150, basePrice: 150, colorOptions: true },
  'Cut Only (Short)': { duration: 30, basePrice: 25, colorOptions: false },
  'Cut Only (Medium)': { duration: 45, basePrice: 35, colorOptions: false },
  'Cut Only (Long)': { duration: 60, basePrice: 45, colorOptions: false }
};

// Color options for pets
const PET_COLORS = {
  'Natural Highlights': { duration: 30, price: 25, safe: true },
  'Pastel Tips': { duration: 45, price: 35, safe: true },
  'Rainbow Streaks': { duration: 60, price: 50, safe: true },
  'Seasonal Theme': { duration: 45, price: 40, safe: true },
  'Glitter Accents': { duration: 20, price: 20, safe: true },
  'Temporary Chalk': { duration: 15, price: 15, safe: true }
};

// Cutting styles with time requirements
const CUTTING_STYLES = {
  'Basic Trim': { duration: 15, price: 0 },
  'Breed Standard': { duration: 30, price: 10 },
  'Creative Styling': { duration: 45, price: 25 },
  'Show Cut': { duration: 60, price: 35 },
  'Lion Cut': { duration: 40, price: 20 },
  'Teddy Bear Cut': { duration: 35, price: 15 }
};

// Access codes for appointment approval
const ADMIN_ACCESS_CODES = ['LAVARE2025', 'ADMIN001', 'STAFF2024'];
const VIP_ACCESS_CODES = ['VIPGOLD', 'PLATINUM', 'DIAMOND'];

type ApprovalStatus = 'none' | 'pending' | 'approved' | 'vip';

const Booking: React.FC = () => {
  const [service, setService] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addons, setAddons] = useState<string[]>([]);
  const [isBooked, setIsBooked] = useState(false);
  const [suggestedAddons, setSuggestedAddons] = useState<string[]>([]);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [isReferralApplied, setIsReferralApplied] = useState(false);
  const [referralError, setReferralError] = useState('');
  
  // New color and cutting options
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCuttingStyle, setSelectedCuttingStyle] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  
  // New approval system states
  const [accessCode, setAccessCode] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('none');
  const [accessError, setAccessError] = useState('');
  const [showPendingRedirect, setShowPendingRedirect] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState<string>('');

  // Calendar states
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());


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

  // Effect to calculate total duration and pricing
  useEffect(() => {
    let duration = 0;
    let price = 0;

    if (service && SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS]) {
      const serviceInfo = SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS];
      duration += serviceInfo.duration;
      price += serviceInfo.basePrice;
    }

    if (selectedCuttingStyle && CUTTING_STYLES[selectedCuttingStyle as keyof typeof CUTTING_STYLES]) {
      const cuttingInfo = CUTTING_STYLES[selectedCuttingStyle as keyof typeof CUTTING_STYLES];
      duration += cuttingInfo.duration;
      price += cuttingInfo.price;
    }

    selectedColors.forEach(color => {
      if (PET_COLORS[color as keyof typeof PET_COLORS]) {
        const colorInfo = PET_COLORS[color as keyof typeof PET_COLORS];
        duration += colorInfo.duration;
        price += colorInfo.price;
      }
    });

    // Add addon durations (estimate 15 min each)
    duration += addons.length * 15;

    setTotalDuration(duration);
    setTotalPrice(price);
  }, [service, selectedCuttingStyle, selectedColors, addons]);

  // Effect to calculate available time slots based on duration
  useEffect(() => {
    if (!date || totalDuration === 0) {
      setAvailableTimeSlots(ALL_TIME_SLOTS);
      return;
    }

    const available = ALL_TIME_SLOTS.filter(slot => {
      // Check if the appointment would end before closing time (7:30 PM)
      const [timePart, ampm] = slot.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      
      const startTime = new Date();
      startTime.setHours(hours, minutes, 0, 0);
      
      const endTime = new Date(startTime.getTime() + totalDuration * 60 * 1000);
      const closingTime = new Date();
      closingTime.setHours(19, 30, 0, 0); // 7:30 PM
      
      return endTime <= closingTime && !bookedTimes.includes(slot);
    });

    setAvailableTimeSlots(available);
    
    // Reset time if current selection is no longer available
    if (time && !available.includes(time)) {
      setTime('');
    }
  }, [date, totalDuration, bookedTimes, time]);


  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) {
        alert("Please select an available time slot.");
        return;
    }

    // Check if appointment requires approval
    if (approvalStatus === 'none') {
      // Generate pending booking ID
      const bookingId = `PND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setPendingBookingId(bookingId);
      setApprovalStatus('pending');
      setShowPendingRedirect(true);
      return;
    }

    // Proceed with approved booking
    console.log({ 
      service, 
      petName, 
      petType, 
      date, 
      time, 
      addons, 
      referralCode: isReferralApplied ? referralCode : '',
      accessCode,
      approvalStatus,
      pendingBookingId
    });
    setIsBooked(true);
  };
  
  const handleAccessCodeValidation = () => {
    const code = accessCode.trim().toUpperCase();
    setAccessError('');

    if (ADMIN_ACCESS_CODES.includes(code)) {
      setApprovalStatus('approved');
      setAccessError('');
      return;
    }

    if (VIP_ACCESS_CODES.includes(code)) {
      setApprovalStatus('vip');
      setAccessError('');
      return;
    }

    // Invalid code
    setAccessError('Invalid access code. Your appointment will require manual approval.');
    setApprovalStatus('none');
  };

  const handleBrowseBoutique = () => {
    // In a real app, this would navigate to boutique
    alert('Redirecting to LAVARE Boutique while your appointment awaits approval...');
  };

  const handleExtraServices = () => {
    // In a real app, this would show extra services
    alert('Explore our premium add-on services while waiting for appointment approval...');
  };
  
  const handleAddonToggle = (addon: string) => {
    setAddons(prev => prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleCuttingStyleSelect = (style: string) => {
    setSelectedCuttingStyle(style === selectedCuttingStyle ? '' : style);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours}hr ${mins}min`;
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateAvailable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const handleDateClick = (clickedDate: Date) => {
    if (!isDateAvailable(clickedDate)) return;
    
    setSelectedCalendarDate(clickedDate);
    setDate(clickedDate.toISOString().split('T')[0]);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = () => {
    if (!service || !petName || !petType || !time) {
      alert('Please fill in all required fields.');
      return;
    }

    // Check if appointment requires approval
    if (approvalStatus === 'none') {
      const bookingId = `PND-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setPendingBookingId(bookingId);
      setApprovalStatus('pending');
      setShowPendingRedirect(true);
      setShowBookingModal(false);
      return;
    }

    // Proceed with approved booking
    console.log({ 
      service, 
      petName, 
      petType, 
      date, 
      time, 
      addons, 
      selectedColors,
      selectedCuttingStyle,
      referralCode: isReferralApplied ? referralCode : '',
      accessCode,
      approvalStatus,
      totalDuration,
      totalPrice
    });
    setIsBooked(true);
    setShowBookingModal(false);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedCalendarDate(null);
    // Reset form but keep calendar state
    setService('');
    setPetName('');
    setPetType('');
    setTime('');
    setAddons([]);
    setSelectedColors([]);
    setSelectedCuttingStyle('');
    setReferralCode('');
    setIsReferralApplied(false);
    setReferralError('');
    setAccessCode('');
    setApprovalStatus('none');
    setAccessError('');
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
    setBookedTimes([]);
    setReferralCode('');
    setIsReferralApplied(false);
    setReferralError('');
    setAccessCode('');
    setApprovalStatus('none');
    setAccessError('');
    setShowPendingRedirect(false);
    setPendingBookingId('');
    setSelectedColors([]);
    setSelectedCuttingStyle('');
    setTotalDuration(0);
    setTotalPrice(0);
    setAvailableTimeSlots(ALL_TIME_SLOTS);
    setSelectedCalendarDate(null);
    setShowBookingModal(false);
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
    const getStatusMessage = () => {
      if (approvalStatus === 'vip') return '👑 VIP Appointment Confirmed!';
      if (approvalStatus === 'approved') return '✅ Appointment Confirmed!';
      return 'Appointment Confirmed!';
    };

    const getStatusSubtext = () => {
      if (approvalStatus === 'vip') return 'Your VIP status ensures premium service and priority scheduling.';
      if (approvalStatus === 'approved') return 'Your appointment has been pre-approved for immediate booking.';
      return 'Your luxurious experience has been booked. We can\'t wait to pamper ' + petName + '!';
    };

    return (
      <div className="text-center max-w-lg mx-auto bg-white p-12 rounded-xl shadow-lg transition-all duration-500 animate-fade-in">
        <h2 className="font-display text-4xl text-[#D4AF37]">
          {getStatusMessage()}
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          {getStatusSubtext()}
        </p>

        <div className="mt-8 text-left bg-amber-50 p-6 rounded-lg border border-amber-200 space-y-3">
            <h3 className="font-display text-xl text-center text-[#333333] mb-4">Booking Summary</h3>
            <p><strong className="text-gray-800">Service:</strong> {service}</p>
            <p><strong className="text-gray-800">Pet:</strong> {petName}</p>
            <p><strong className="text-gray-800">Date:</strong> {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong className="text-gray-800">Time:</strong> {time} - {
              (() => {
                const [timePart, ampm] = time.split(' ');
                let [hours, minutes] = timePart.split(':').map(Number);
                if (ampm === 'PM' && hours < 12) hours += 12;
                if (ampm === 'AM' && hours === 12) hours = 0;
                const start = new Date();
                start.setHours(hours, minutes);
                const end = new Date(start.getTime() + totalDuration * 60 * 1000);
                return end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
              })()
            }</p>
            <p><strong className="text-gray-800">Duration:</strong> {formatDuration(totalDuration)}</p>
            {selectedCuttingStyle && <p><strong className="text-gray-800">Cutting Style:</strong> {selectedCuttingStyle}</p>}
            {selectedColors.length > 0 && <p><strong className="text-gray-800">Colors:</strong> {selectedColors.join(', ')}</p>}
            {addons.length > 0 && <p><strong className="text-gray-800">Add-ons:</strong> {addons.join(', ')}</p>}
            <p><strong className="text-gray-800">Total Price:</strong> <span className="text-[#D4AF37] font-bold">${totalPrice + (addons.length * 15)}</span></p>
            {approvalStatus !== 'none' && (
              <p><strong className="text-gray-800">Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  approvalStatus === 'vip' ? 'bg-purple-100 text-purple-800' :
                  approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {approvalStatus === 'vip' ? 'VIP Priority' : 
                   approvalStatus === 'approved' ? 'Pre-Approved' : 'Standard'}
                </span>
              </p>
            )}
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

  // Pending approval redirect screen
  if (showPendingRedirect) {
    return (
      <div className="text-center max-w-2xl mx-auto bg-white p-12 rounded-xl shadow-lg">
        <div className="mb-6">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-[#333333] mb-4">Appointment Pending Approval</h2>
          <p className="text-lg text-gray-600 mb-2">
            Your appointment request has been submitted and is awaiting approval.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Booking ID: <span className="font-mono font-medium text-[#D4AF37]">{pendingBookingId}</span>
          </p>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-8">
          <h3 className="font-display text-xl text-[#333333] mb-4">Appointment Details</h3>
          <div className="text-left space-y-2">
            <p><strong>Service:</strong> {service}</p>
            <p><strong>Pet:</strong> {petName} ({petType})</p>
            <p><strong>Date:</strong> {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p><strong>Time:</strong> {time}</p>
            {addons.length > 0 && <p><strong>Add-ons:</strong> {addons.join(', ')}</p>}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-medium text-[#333333] mb-4">While You Wait...</h3>
          <p className="text-gray-600 mb-6">
            Explore our premium services and boutique collection while your appointment awaits approval.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <button 
              onClick={handleBrowseBoutique}
              className="bg-[#D4AF37] text-white px-6 py-3 rounded-md hover:bg-[#b3922e] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Browse Boutique
            </button>
            
            <button 
              onClick={handleExtraServices}
              className="bg-[#333333] text-white px-6 py-3 rounded-md hover:bg-[#555] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              Extra Services
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-500 mb-4">
            We'll notify you within 24 hours regarding your appointment status.
          </p>
          <button 
            onClick={handleReset}
            className="text-[#D4AF37] hover:text-[#b3922e] font-medium"
          >
            ← Book Another Appointment
          </button>
        </div>
      </div>
    );
  }
  
  const otherAddons = ALL_ADDONS.filter(a => !suggestedAddons.includes(a));

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-4"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = isDateAvailable(date);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedCalendarDate?.toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={!isAvailable}
          className={`p-4 text-center rounded-lg transition-all duration-200 ${
            !isAvailable 
              ? 'text-gray-300 cursor-not-allowed bg-gray-50' 
              : isSelected
                ? 'bg-[#D4AF37] text-white shadow-md'
                : isToday
                  ? 'bg-[#333333] text-white font-semibold'
                  : 'hover:bg-[#D4AF37] hover:text-white bg-white border border-gray-200'
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h3 className="text-xl font-semibold text-[#333333]">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>

        <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#333333] rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-[#D4AF37] rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-5xl mb-4">Book Your Appointment</h2>
        <p className="text-lg text-gray-600">Select a date to view available times and services</p>
      </div>
      
      {renderCalendar()}

      {/* Booking Modal */}
      {showBookingModal && selectedCalendarDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display text-[#333333]">
                  Book for {selectedCalendarDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Service Selection */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                    <select 
                      value={service} 
                      onChange={e => setService(e.target.value)} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    >
                      <option value="">Choose a service...</option>
                      <optgroup label="Full Service Packages">
                        <option>The Luxe Wash</option>
                        <option>Glamour Cut & Style</option>
                        <option>Vitality Spa Day</option>
                        <option>Puppy's First Groom</option>
                      </optgroup>
                      <optgroup label="Color & Styling">
                        <option>Color & Cut Express</option>
                        <option>Full Color Treatment</option>
                      </optgroup>
                      <optgroup label="Cut Only Services">
                        <option>Cut Only (Short)</option>
                        <option>Cut Only (Medium)</option>
                        <option>Cut Only (Long)</option>
                      </optgroup>
                    </select>
                    {service && SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS] && (
                      <p className="text-xs text-gray-500 mt-1">
                        Duration: {formatDuration(SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS].duration)} 
                        • Base Price: ${SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS].basePrice}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                      <input 
                        type="text" 
                        value={petName} 
                        onChange={e => setPetName(e.target.value)} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]" 
                        placeholder="Enter pet's name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                      <select 
                        value={petType} 
                        onChange={e => setPetType(e.target.value)} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                      >
                        <option value="">Choose type...</option>
                        <option>Long-Haired Dog</option>
                        <option>Short-Haired Dog</option>
                        <option>Cat</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Available Times
                      {totalDuration > 0 && (
                        <span className="text-xs text-[#D4AF37] ml-2">
                          ({formatDuration(totalDuration)})
                        </span>
                      )}
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map(t => {
                        const isBooked = bookedTimes.includes(t);
                        return (
                          <button 
                            type="button" 
                            key={t} 
                            onClick={() => setTime(t)} 
                            disabled={isBooked}
                            className={`p-2 text-sm rounded-md border text-center transition-colors ${
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
                  </div>
                </div>

                {/* Options & Add-ons */}
                <div className="space-y-6">
                  {/* Cutting Style */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Cutting Style (Optional)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(CUTTING_STYLES).map(([style, info]) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => handleCuttingStyleSelect(style)}
                          className={`p-3 rounded-lg border text-left transition-colors text-sm ${
                            selectedCuttingStyle === style
                              ? 'bg-[#333333] text-white border-transparent'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium">{style}</div>
                          <div className="text-xs opacity-75">
                            +{formatDuration(info.duration)} • +${info.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  {service && SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS]?.colorOptions && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Color Options <span className="text-green-600 text-xs">(Pet-Safe)</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(PET_COLORS).map(([color, info]) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColorToggle(color)}
                            className={`p-3 rounded-lg border text-left transition-colors text-sm ${
                              selectedColors.includes(color)
                                ? 'bg-[#D4AF37] text-white border-transparent'
                                : 'bg-white border-gray-300 hover:bg-amber-50'
                            }`}
                          >
                            <div className="font-medium">{color}</div>
                            <div className="text-xs opacity-75">
                              +{formatDuration(info.duration)} • +${info.price}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add-ons */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Services</h4>
                    <div className="space-y-2">
                      {ALL_ADDONS.map(addon => (
                        <button 
                          key={addon} 
                          type="button" 
                          onClick={() => handleAddonToggle(addon)} 
                          className={`w-full p-2 text-sm rounded-lg border text-left transition-colors ${
                            addons.includes(addon) 
                              ? 'bg-[#D4AF37] text-white border-transparent' 
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {addon} (+$15)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  {service && totalDuration > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Summary</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>{service}</span>
                          <span>${SERVICE_DURATIONS[service as keyof typeof SERVICE_DURATIONS]?.basePrice || 0}</span>
                        </div>
                        
                        {selectedCuttingStyle && (
                          <div className="flex justify-between text-gray-600">
                            <span>{selectedCuttingStyle}</span>
                            <span>+${CUTTING_STYLES[selectedCuttingStyle as keyof typeof CUTTING_STYLES]?.price || 0}</span>
                          </div>
                        )}
                        
                        {selectedColors.map(color => (
                          <div key={color} className="flex justify-between text-gray-600">
                            <span>{color}</span>
                            <span>+${PET_COLORS[color as keyof typeof PET_COLORS]?.price || 0}</span>
                          </div>
                        ))}
                        
                        {addons.map(addon => (
                          <div key={addon} className="flex justify-between text-gray-600">
                            <span>{addon}</span>
                            <span>+$15</span>
                          </div>
                        ))}
                        
                        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                          <span>Duration: {formatDuration(totalDuration)}</span>
                          <span>Total: ${totalPrice + (addons.length * 15)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Access Code */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Access Code <span className="text-xs text-gray-500">(Optional - VIP/Staff)</span>
                    </h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => { setAccessCode(e.target.value); setAccessError(''); }}
                        placeholder="Enter code"
                        disabled={approvalStatus === 'approved' || approvalStatus === 'vip'}
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-[#D4AF37] focus:border-[#D4AF37] disabled:bg-gray-100"
                      />
                      <button
                        type="button"
                        onClick={handleAccessCodeValidation}
                        disabled={!accessCode || approvalStatus === 'approved' || approvalStatus === 'vip'}
                        className="px-4 py-3 bg-[#333333] text-white rounded-md hover:bg-[#555] transition-colors disabled:bg-gray-300"
                      >
                        {approvalStatus === 'approved' || approvalStatus === 'vip' ? '✓' : 'Verify'}
                      </button>
                    </div>
                    
                    {accessError && (
                      <p className="text-amber-600 text-xs mt-1">{accessError}</p>
                    )}
                    
                    {approvalStatus === 'approved' && (
                      <p className="text-green-600 text-xs mt-1">✓ Access Approved!</p>
                    )}
                    
                    {approvalStatus === 'vip' && (
                      <p className="text-purple-600 text-xs mt-1">👑 VIP Access Granted!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={!service || !petName || !petType || !time}
                  className="px-8 py-3 bg-[#D4AF37] text-white rounded-md hover:bg-[#b3922e] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {approvalStatus === 'approved' || approvalStatus === 'vip' ? 'Book Appointment' : 'Submit for Approval'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;