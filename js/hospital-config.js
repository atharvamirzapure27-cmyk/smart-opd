// Hospital Working Hours Validation
export const HOSPITAL_HOURS = {
  MONDAY: { open: '09:00', close: '17:00', isOpen: true },
  TUESDAY: { open: '09:00', close: '17:00', isOpen: true },
  WEDNESDAY: { open: '09:00', close: '17:00', isOpen: true },
  THURSDAY: { open: '09:00', close: '17:00', isOpen: true },
  FRIDAY: { open: '09:00', close: '17:00', isOpen: true },
  SATURDAY: { open: '09:00', close: '13:00', isOpen: true },
  SUNDAY: { open: null, close: null, isOpen: false }
};

export const HOSPITALS = {
  AVBRH: 'AVBRH, DMIHER, Sawangi (Wardha)',
  SHALINI: 'Shalini Tai Meghe Superspeciality Centre'
};

export const OPD_DEPARTMENTS = [
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'ENT',
  'Ophthalmology',
  'Dermatology',
  'Psychiatry',
  'Neurology'
];

// Validate if hospital is currently open
export function isHospitalOpen() {
  const now = new Date();
  const day = now.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
  const hours = HOSPITAL_HOURS[day];
  
  if (!hours || !hours.isOpen) {
    return { open: false, message: 'Hospital is closed on Sundays' };
  }
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = hours.open.split(':').map(Number);
  const [closeHour, closeMin] = hours.close.split(':').map(Number);
  const openTime = openHour * 60 + openMin;
  const closeTime = closeHour * 60 + closeMin;
  
  if (currentTime < openTime) {
    return { open: false, message: `Hospital opens at ${hours.open}` };
  }
  
  if (currentTime >= closeTime) {
    return { open: false, message: `Hospital closed at ${hours.close}` };
  }
  
  return { open: true, message: 'Hospital is open' };
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Format time to HH:MM
export function formatTime(date = new Date()) {
  return date.toTimeString().slice(0, 5);
}
