import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { 
  Car, Home, Building2, TreeDeciduous, Shirt, Leaf, Trash2, Wrench, 
  Recycle, Tractor, Flower2, Bath, Shovel, Hotel, Building, Square, 
  Sofa, BedDouble, Cog, Phone, Mail, MapPin, Clock, CheckCircle2,
  Upload, Camera, X, Menu, ChevronRight, Sparkles, Shield, Zap
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Icon mapping
const iconMap = {
  Car, Home, Building2, TreeDeciduous, Shirt, Leaf, Trash2, Wrench,
  Recycle, Tractor, Flower2, Bath, Shovel, Hotel, Building, Square,
  Sofa, BedDouble, Cog
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090B]/95 backdrop-blur-md border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => navigate('/')}
            data-testid="logo-link"
          >
            <div className="w-10 h-10 bg-[#FFD700] rounded-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <span className="font-heading text-xl md:text-2xl font-bold tracking-tight">
              FREEMAN <span className="text-[#FFD700]">MOBILE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigate('/')}
              className={`font-heading text-sm tracking-wider transition-colors ${location.pathname === '/' ? 'text-[#FFD700]' : 'text-white hover:text-[#FFD700]'}`}
              data-testid="nav-home"
            >
              HOME
            </button>
            <button 
              onClick={() => navigate('/services')}
              className={`font-heading text-sm tracking-wider transition-colors ${location.pathname === '/services' ? 'text-[#FFD700]' : 'text-white hover:text-[#FFD700]'}`}
              data-testid="nav-services"
            >
              SERVICES
            </button>
            <button 
              onClick={() => navigate('/book')}
              className="btn-primary px-6 py-2 rounded-sm"
              data-testid="nav-book-now"
            >
              BOOK NOW
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="mobile-menu-btn"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#27272A] animate-fade-in">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => { navigate('/'); setIsMenuOpen(false); }}
                className="font-heading text-left py-2"
                data-testid="mobile-nav-home"
              >
                HOME
              </button>
              <button 
                onClick={() => { navigate('/services'); setIsMenuOpen(false); }}
                className="font-heading text-left py-2"
                data-testid="mobile-nav-services"
              >
                SERVICES
              </button>
              <button 
                onClick={() => { navigate('/book'); setIsMenuOpen(false); }}
                className="btn-primary w-full py-3 rounded-sm"
                data-testid="mobile-nav-book"
              >
                BOOK NOW
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1638731006970-3a2139643b5c?crop=entropy&cs=srgb&fm=jpg&q=85)',
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 text-center">
        <div className="animate-fade-in">
          <p className="text-[#FFD700] font-heading text-lg md:text-xl tracking-widest mb-4">
            PROFESSIONAL CLEANING SERVICES
          </p>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold leading-none mb-6">
            FREEMAN<br />
            <span className="text-[#FFD700]">MOBILE CLEANING</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Premium cleaning services delivered to your doorstep. 
            From cars to carpets, homes to hotels - we clean it all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/book')}
              className="btn-primary px-10 py-4 text-lg rounded-sm"
              data-testid="hero-book-btn"
            >
              BOOK A SERVICE
            </button>
            <button 
              onClick={() => navigate('/services')}
              className="btn-secondary px-10 py-4 text-lg rounded-sm"
              data-testid="hero-services-btn"
            >
              VIEW SERVICES
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronRight className="w-8 h-8 rotate-90 text-[#FFD700]" />
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    { icon: Zap, title: "FAST SERVICE", desc: "Quick turnaround on all cleaning jobs" },
    { icon: Shield, title: "TRUSTED PROS", desc: "Verified and experienced cleaners" },
    { icon: Sparkles, title: "QUALITY WORK", desc: "100% satisfaction guaranteed" },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#18181B]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="text-center p-8 animate-fade-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto bg-[#FFD700]/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-[#A1A1AA]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Service Card Component
const ServiceCard = ({ service, onClick }) => {
  const IconComponent = iconMap[service.icon] || Sparkles;
  
  return (
    <div 
      className="service-card bg-[#18181B] border border-[#27272A] rounded-md p-6 cursor-pointer group"
      onClick={onClick}
      data-testid={`service-card-${service.id}`}
    >
      <div className="service-icon w-12 h-12 bg-[#27272A] rounded-md flex items-center justify-center mb-4 transition-all">
        <IconComponent className="w-6 h-6 text-[#A1A1AA] group-hover:text-[#FFD700]" />
      </div>
      <h3 className="font-heading text-xl font-bold mb-2">{service.name}</h3>
      <p className="text-[#A1A1AA] text-sm mb-4">{service.description}</p>
      <div className="flex items-center text-[#FFD700] font-heading text-sm">
        BOOK NOW <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
};

// Services Grid Section
const ServicesGrid = ({ services, limit, showTitle = true }) => {
  const navigate = useNavigate();
  const displayServices = limit ? services.slice(0, limit) : services;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {showTitle && (
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
              OUR <span className="text-[#FFD700]">SERVICES</span>
            </h2>
            <p className="text-[#A1A1AA] max-w-2xl mx-auto">
              From residential to commercial, we offer comprehensive cleaning solutions
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayServices.map((service, idx) => (
            <div key={service.id} style={{ animationDelay: `${idx * 0.05}s` }} className="animate-fade-in">
              <ServiceCard 
                service={service} 
                onClick={() => navigate(`/book/${service.id}`)}
              />
            </div>
          ))}
        </div>

        {limit && services.length > limit && (
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/services')}
              className="btn-secondary px-8 py-3 rounded-sm"
              data-testid="view-all-services-btn"
            >
              VIEW ALL SERVICES
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// CTA Section
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FFD700] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-black mb-4">
          READY TO GET STARTED?
        </h2>
        <p className="text-black/70 text-lg mb-8 max-w-xl mx-auto">
          Book your cleaning service today and experience the Freeman difference
        </p>
        <button 
          onClick={() => navigate('/book')}
          className="bg-black text-white font-heading font-bold text-lg px-10 py-4 rounded-sm hover:bg-[#18181B] transition-colors"
          data-testid="cta-book-btn"
        >
          BOOK NOW
        </button>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#09090B] border-t border-[#27272A] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#FFD700] rounded-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="font-heading text-xl font-bold">
                FREEMAN <span className="text-[#FFD700]">MOBILE</span>
              </span>
            </div>
            <p className="text-[#A1A1AA] text-sm">
              Professional cleaning services for homes, offices, and vehicles.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">CONTACT</h4>
            <div className="space-y-2 text-[#A1A1AA] text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFD700]" /> +1 (555) 123-4567
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFD700]" /> info@freemanmobile.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFD700]" /> 123 Clean Street, City
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-4">HOURS</h4>
            <div className="space-y-2 text-[#A1A1AA] text-sm">
              <p>Monday - Friday: 8AM - 6PM</p>
              <p>Saturday: 9AM - 5PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-[#27272A] mt-8 pt-8 text-center text-[#A1A1AA] text-sm">
          © 2026 Freeman Mobile Cleaning. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

// Home Page
const HomePage = ({ services }) => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <ServicesGrid services={services} limit={8} />
      <CTASection />
    </div>
  );
};

// Services Page
const ServicesPage = ({ services }) => {
  return (
    <div className="pt-20">
      <div className="bg-[#18181B] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-4">
            ALL <span className="text-[#FFD700]">SERVICES</span>
          </h1>
          <p className="text-[#A1A1AA] max-w-2xl mx-auto">
            Choose from our wide range of professional cleaning services
          </p>
        </div>
      </div>
      <ServicesGrid services={services} showTitle={false} />
    </div>
  );
};

// Booking Page
const BookingPage = ({ services }) => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(serviceId ? 2 : 1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Load service from URL param
  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
        setStep(2);
      }
    }
  }, [serviceId, services]);

  // Fetch time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTimeSlots = async (date) => {
    setLoadingSlots(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await axios.get(`${API}/time-slots?date=${dateStr}`);
      setTimeSlots(response.data);
    } catch (error) {
      toast.error("Failed to load time slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      
      // Upload immediately
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await axios.post(`${API}/upload-photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setUploadedFilename(response.data.filename);
        toast.success("Photo uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload photo");
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingData = {
        service_id: selectedService.id,
        service_name: selectedService.name,
        date: selectedDate.toISOString().split('T')[0],
        time_slot: selectedTime,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || null,
        customer_address: formData.address,
        notes: formData.notes || null,
        photo_filename: uploadedFilename || null
      };

      const response = await axios.post(`${API}/bookings`, bookingData);
      setBookingConfirmed(response.data);
      setStep(5);
      toast.success("Booking confirmed!");
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <h2 className="font-heading text-3xl font-bold mb-6">SELECT A SERVICE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <ServiceCard 
                  key={service.id}
                  service={service}
                  onClick={() => {
                    setSelectedService(service);
                    setStep(2);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in">
            <h2 className="font-heading text-3xl font-bold mb-2">SELECT DATE & TIME</h2>
            <p className="text-[#A1A1AA] mb-6">
              Booking: <span className="text-[#FFD700]">{selectedService?.name}</span>
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calendar */}
              <div className="bg-white rounded-md p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="mx-auto"
                  data-testid="booking-calendar"
                />
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="font-heading text-xl font-bold mb-4">
                  {selectedDate ? `TIME SLOTS FOR ${selectedDate.toLocaleDateString()}` : 'SELECT A DATE FIRST'}
                </h3>
                
                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner w-8 h-8" />
                  </div>
                ) : selectedDate ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot.time}
                        className={`time-slot p-3 border border-[#27272A] rounded-md text-center font-medium transition-all
                          ${!slot.available ? 'unavailable' : ''}
                          ${selectedTime === slot.time ? 'selected' : ''}`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        data-testid={`time-slot-${slot.time.replace(/\s/g, '-')}`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#A1A1AA]">Please select a date to see available time slots</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setStep(1)} 
                className="btn-secondary px-6 py-3 rounded-sm"
                data-testid="back-to-services-btn"
              >
                BACK
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="btn-primary px-8 py-3 rounded-sm disabled:opacity-50"
                data-testid="continue-to-photo-btn"
              >
                CONTINUE
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in">
            <h2 className="font-heading text-3xl font-bold mb-2">UPLOAD PHOTO</h2>
            <p className="text-[#A1A1AA] mb-6">
              Upload a photo of the item to be cleaned (optional)
            </p>

            <div className="max-w-xl">
              {!photoPreview ? (
                <label 
                  className="upload-area block rounded-md p-12 text-center cursor-pointer"
                  data-testid="photo-upload-area"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                    data-testid="photo-input"
                  />
                  <Camera className="w-16 h-16 mx-auto mb-4 text-[#A1A1AA]" />
                  <p className="font-heading text-xl mb-2">CLICK TO UPLOAD OR TAKE PHOTO</p>
                  <p className="text-[#A1A1AA] text-sm">Supports: JPG, PNG, WEBP</p>
                </label>
              ) : (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full rounded-md"
                    data-testid="photo-preview"
                  />
                  <button 
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                      setUploadedFilename(null);
                    }}
                    className="absolute top-2 right-2 bg-black/80 p-2 rounded-full"
                    data-testid="remove-photo-btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setStep(2)} 
                className="btn-secondary px-6 py-3 rounded-sm"
                data-testid="back-to-datetime-btn"
              >
                BACK
              </button>
              <button 
                onClick={() => setStep(4)}
                className="btn-primary px-8 py-3 rounded-sm"
                data-testid="continue-to-details-btn"
              >
                {photoPreview ? 'CONTINUE' : 'SKIP & CONTINUE'}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fade-in">
            <h2 className="font-heading text-3xl font-bold mb-2">YOUR DETAILS</h2>
            <p className="text-[#A1A1AA] mb-6">
              Please provide your contact information
            </p>

            <div className="max-w-xl bg-white rounded-md p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-black font-medium mb-2">Name *</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input-field w-full px-4 py-3 rounded-md"
                    placeholder="Your full name"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Phone *</label>
                  <input 
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="input-field w-full px-4 py-3 rounded-md"
                    placeholder="Your phone number"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Email</label>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input-field w-full px-4 py-3 rounded-md"
                    placeholder="Your email (optional)"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Service Address *</label>
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="input-field w-full px-4 py-3 rounded-md"
                    placeholder="Where should we provide the service?"
                    data-testid="input-address"
                  />
                </div>

                <div>
                  <label className="block text-black font-medium mb-2">Notes</label>
                  <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="input-field w-full px-4 py-3 rounded-md resize-none"
                    rows={3}
                    placeholder="Any special instructions?"
                    data-testid="input-notes"
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="mt-6 p-4 bg-[#F4F4F5] rounded-md">
                <h4 className="font-bold text-black mb-2">Booking Summary</h4>
                <div className="text-sm text-black/70 space-y-1">
                  <p><strong>Service:</strong> {selectedService?.name}</p>
                  <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  {uploadedFilename && <p><strong>Photo:</strong> Uploaded ✓</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setStep(3)} 
                className="btn-secondary px-6 py-3 rounded-sm"
                data-testid="back-to-photo-btn"
              >
                BACK
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.phone || !formData.address}
                className="btn-primary px-8 py-3 rounded-sm disabled:opacity-50 flex items-center gap-2"
                data-testid="submit-booking-btn"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner w-5 h-5 border-black" />
                    BOOKING...
                  </>
                ) : (
                  'CONFIRM BOOKING'
                )}
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-fade-in text-center max-w-xl mx-auto">
            <div className="w-20 h-20 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-heading text-4xl font-bold mb-4">BOOKING CONFIRMED!</h2>
            <p className="text-[#A1A1AA] mb-8">
              Thank you for booking with Freeman Mobile Cleaning. We'll contact you shortly to confirm.
            </p>

            <div className="bg-[#18181B] rounded-md p-6 text-left mb-8">
              <h3 className="font-heading text-xl font-bold mb-4 text-[#FFD700]">BOOKING DETAILS</h3>
              <div className="space-y-3">
                <p><strong className="text-[#A1A1AA]">Booking ID:</strong> {bookingConfirmed?.id}</p>
                <p><strong className="text-[#A1A1AA]">Service:</strong> {bookingConfirmed?.service_name}</p>
                <p><strong className="text-[#A1A1AA]">Date:</strong> {bookingConfirmed?.date}</p>
                <p><strong className="text-[#A1A1AA]">Time:</strong> {bookingConfirmed?.time_slot}</p>
                <p><strong className="text-[#A1A1AA]">Address:</strong> {bookingConfirmed?.customer_address}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-3 rounded-sm"
              data-testid="back-to-home-btn"
            >
              BACK TO HOME
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Progress Steps */}
        {step < 5 && (
          <div className="flex items-center justify-center gap-2 mb-12">
            {['Service', 'Date & Time', 'Photo', 'Details'].map((label, idx) => (
              <div key={idx} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${step > idx + 1 ? 'bg-[#22C55E] text-white' : step === idx + 1 ? 'bg-[#FFD700] text-black' : 'bg-[#27272A] text-[#A1A1AA]'}`}>
                  {step > idx + 1 ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`hidden sm:block ml-2 text-sm ${step === idx + 1 ? 'text-white' : 'text-[#A1A1AA]'}`}>
                  {label}
                </span>
                {idx < 3 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > idx + 1 ? 'bg-[#22C55E]' : 'bg-[#27272A]'}`} />}
              </div>
            ))}
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090B]">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4" />
          <p className="text-[#A1A1AA]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-[#09090B]">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage services={services} />} />
          <Route path="/services" element={<ServicesPage services={services} />} />
          <Route path="/book" element={<BookingPage services={services} />} />
          <Route path="/book/:serviceId" element={<BookingPage services={services} />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#18181B',
            color: '#FFFFFF',
            border: '1px solid #27272A'
          }
        }}
      />
    </div>
  );
}

export default App;
