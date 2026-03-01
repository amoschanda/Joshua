import { useState } from 'react';
import { Calendar, Check, CheckCircle2, Stethoscope, User, Video, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DOCTORS } from '@/data/mock';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState<'checkup' | 'specialist' | 'telehealth' | 'urgent'>('checkup');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  ];

  const handleConfirm = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onClose();
      setStep(1);
      setIsConfirmed(false);
      setAppointmentType('checkup');
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
    }, 2000);
  };

  const getAppointmentTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup': return 'Regular Checkup';
      case 'specialist': return 'Specialist Consultation';
      case 'telehealth': return 'Telehealth Visit';
      case 'urgent': return 'Urgent Care';
      default: return type;
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup': return Stethoscope;
      case 'specialist': return User;
      case 'telehealth': return Video;
      case 'urgent': return Activity;
      default: return Calendar;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return true;
      case 2: return selectedDoctor !== '';
      case 3: return selectedDate !== '' && selectedTime !== '';
      case 4: return true;
      default: return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Book an Appointment</DialogTitle>
          <p className="text-gray-500 text-sm">Schedule your visit in just a few steps</p>
        </DialogHeader>

        {isConfirmed ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Appointment Confirmed!</h3>
            <p className="text-gray-600">Your appointment has been scheduled successfully.</p>
          </div>
        ) : (
          <>
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? 'gradient-blue text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 4 && <div className={`w-12 h-1 ${step > s ? 'bg-primary' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Select Type */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Select Appointment Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: 'checkup', label: 'Regular Checkup', desc: 'Annual physical or routine visit', icon: Stethoscope },
                    { type: 'specialist', label: 'Specialist', desc: 'See a specialist doctor', icon: User },
                    { type: 'telehealth', label: 'Telehealth', desc: 'Virtual video consultation', icon: Video },
                    { type: 'urgent', label: 'Urgent Care', desc: 'Non-emergency urgent issues', icon: Activity },
                  ].map(({ type, label, desc, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => setAppointmentType(type as any)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        appointmentType === type
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-2 ${appointmentType === type ? 'text-primary' : 'text-gray-400'}`} />
                      <p className="font-medium">{label}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Doctor */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Choose Your Doctor</h3>
                <div className="space-y-3">
                  {DOCTORS.filter(d => d.available).map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                        selectedDoctor === doctor.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                        <p className="text-sm text-gray-400">{doctor.experience} experience</p>
                      </div>
                      {selectedDoctor === doctor.id && <Check className="w-5 h-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select Date & Time */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Select Date & Time</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Time</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg border text-sm transition-all ${
                            selectedTime === time
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Confirm Your Appointment</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = getAppointmentTypeIcon(appointmentType);
                      return <Icon className="w-5 h-5 text-primary" />;
                    })()}
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{getAppointmentTypeLabel(appointmentType)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-medium">{DOCTORS.find(d => d.id === selectedDoctor)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-medium">{selectedDate} at {selectedTime}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any symptoms or concerns you'd like to discuss..."
                    className="w-full mt-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              ) : (
                <div />
              )}
              
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="gradient-blue text-white flex items-center gap-2"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleConfirm}
                  className="gradient-blue text-white"
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
