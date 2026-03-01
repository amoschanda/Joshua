import { useState, useEffect } from 'react';
import { 
  Phone, Calendar, MapPin, Clock, ChevronRight, Star, 
  Heart, Activity, Brain, Stethoscope, ArrowRight, CheckCircle2,
  Shield, Microscope, HeadphonesIcon, Quote, Facebook, Twitter, 
  Instagram, Linkedin, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AuthProvider } from '@/context/AuthContext';
import { Navigation } from '@/components/Navigation';
import { LoginModal } from '@/components/LoginModal';
import { RegisterModal } from '@/components/RegisterModal';
import { AppointmentModal } from '@/components/AppointmentModal';
import { PatientDashboard } from '@/components/PatientDashboard';
import { ChatWidget } from '@/components/ChatWidget';
import { DOCTORS, BLOG_POSTS, TESTIMONIALS } from '@/data/mock';
import './App.css';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (showDashboard) {
    return (
      <AuthProvider>
        <PatientDashboard onClose={() => setShowDashboard(false)} />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <Navigation
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
          onBookAppointment={() => setIsAppointmentOpen(true)}
          onDashboardClick={() => setShowDashboard(true)}
        />

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src="/hero-doctor.jpg" 
              alt="Healthcare" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <Shield className="w-3 h-3 mr-1" /> Trusted Healthcare Since 1995
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your Health Is Our <span className="text-primary">Top Priority</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience world-class healthcare with our team of expert physicians. 
                Book appointments online, access your medical records, and get the care you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="gradient-blue text-white"
                  onClick={() => setIsAppointmentOpen(true)}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-gray-500">Expert Doctors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">100k+</p>
                  <p className="text-sm text-gray-500">Patients Served</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">25+</p>
                  <p className="text-sm text-gray-500">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4">Our Services</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Healthcare Services
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer a wide range of medical services to meet all your healthcare needs under one roof.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Heart, title: 'Cardiology', desc: 'Comprehensive heart care including diagnostics, treatment, and prevention.' },
                { icon: Brain, title: 'Neurology', desc: 'Expert care for neurological conditions, strokes, and brain disorders.' },
                { icon: Stethoscope, title: 'Primary Care', desc: 'Your first point of contact for all health concerns and checkups.' },
                { icon: Activity, title: 'Emergency Care', desc: '24/7 emergency services with rapid response and expert care.' },
                { icon: Microscope, title: 'Laboratory', desc: 'State-of-the-art diagnostic testing and accurate results.' },
                { icon: HeadphonesIcon, title: 'Telehealth', desc: 'Virtual consultations from the comfort of your home.' },
              ].map((service, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <a href="#" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section id="doctors" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4">Our Doctors</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Expert Physicians
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our team of highly qualified doctors is dedicated to providing you with the best care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {DOCTORS.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img src={doctor.image} alt={doctor.name} className="w-full h-64 object-cover" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-primary text-sm mb-2">{doctor.specialty}</p>
                    <p className="text-gray-500 text-sm mb-4">{doctor.experience} experience</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsAppointmentOpen(true)}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4">About Us</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Providing Quality Healthcare for Over 25 Years
                </h2>
                <p className="text-gray-600 mb-6">
                  MetroHealth has been at the forefront of medical excellence since 1995. Our state-of-the-art 
                  facilities combined with our compassionate approach to care have made us the preferred 
                  healthcare provider for thousands of families.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    'Board-certified physicians across all specialties',
                    'Advanced diagnostic and treatment technology',
                    'Patient-centered care approach',
                    'Convenient online appointment booking',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                <Button className="gradient-blue text-white">
                  Learn More About Us
                </Button>
              </div>
              <div className="relative">
                <img 
                  src="/about-doctors.jpg" 
                  alt="Our Team" 
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-lg">
                  <p className="text-4xl font-bold text-primary">25+</p>
                  <p className="text-gray-600">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Patients Say
              </h2>
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="bg-primary rounded-2xl p-8 md:p-12 text-white text-center">
                <Quote className="w-12 h-12 mx-auto mb-6 opacity-50" />
                <p className="text-xl md:text-2xl mb-8">
                  "{TESTIMONIALS[currentTestimonial].text}"
                </p>
                <div className="flex items-center justify-center gap-4">
                  <img 
                    src={TESTIMONIALS[currentTestimonial].image} 
                    alt={TESTIMONIALS[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold">{TESTIMONIALS[currentTestimonial].name}</p>
                    <p className="text-white/80">{TESTIMONIALS[currentTestimonial].treatment}</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentTestimonial === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="mb-4">Health Blog</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest Health Tips & News
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <a href="#" className="text-primary font-medium flex items-center gap-2 hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="gradient-blue rounded-3xl p-8 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Prioritize Your Health?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Book an appointment today and take the first step towards better health. 
                Our team is ready to provide you with exceptional care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => setIsAppointmentOpen(true)}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <span className="font-bold text-xl">
                    Metro<span className="text-primary">Health</span>
                  </span>
                </div>
                <p className="text-gray-400 mb-6">
                  Providing exceptional healthcare services with compassion and excellence since 1995.
                </p>
                <div className="flex gap-4">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                    <a key={index} href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {['About Us', 'Our Doctors', 'Services', 'Appointments', 'Patient Portal'].map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-semibold text-lg mb-6">Our Services</h4>
                <ul className="space-y-3">
                  {['Cardiology', 'Neurology', 'Primary Care', 'Emergency Care', 'Laboratory'].map((service) => (
                    <li key={service}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">{service}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">123 Healthcare Avenue, Medical District, NY 10001</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">(555) 123-4567</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">info@metrohealth.com</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-400">Open 24/7 for emergencies</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2026 MetroHealth. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">HIPAA Compliance</a>
              </div>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
        <AppointmentModal
          isOpen={isAppointmentOpen}
          onClose={() => setIsAppointmentOpen(false)}
        />

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </AuthProvider>
  );
}

export default App;
