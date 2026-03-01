import { useState, useRef, useEffect } from 'react';
import { Menu, X, Phone, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface NavigationProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onBookAppointment: () => void;
  onDashboardClick: () => void;
}

export function Navigation({ onLoginClick, onRegisterClick, onBookAppointment, onDashboardClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Doctors', href: '#doctors' },
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        {/* Top Bar */}
        <div className={`hidden lg:block transition-all duration-300 ${isScrolled ? 'h-0 overflow-hidden' : 'h-10'}`}>
          <div className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <a href="tel:+15551234567" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Emergency: (555) 123-4567</span>
                </a>
                <span className="text-white/60">|</span>
                <span>Open 24/7 for emergencies</span>
              </div>
              <div className="flex items-center gap-4">
                <span>123 Healthcare Ave, NY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className={`transition-all duration-300 ${isScrolled ? '' : 'bg-white/80 backdrop-blur-sm'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <a href="#home" onClick={() => scrollToSection('#home')} className="flex items-center gap-2">
                <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className={`font-bold text-xl transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                  Metro<span className="text-primary">Health</span>
                </span>
              </a>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isScrolled ? 'text-gray-700' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-4">
                {isLoggedIn ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={onDashboardClick}
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {user?.firstName}
                    </Button>
                    <Button
                      onClick={onBookAppointment}
                      className="gradient-blue text-white flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={onLoginClick}>
                      Sign In
                    </Button>
                    <Button onClick={onRegisterClick} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      Sign Up
                    </Button>
                    <Button
                      onClick={onBookAppointment}
                      className="gradient-blue text-white flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Now
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl">
                Metro<span className="text-primary">Health</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Mobile Nav Links */}
          <div className="space-y-2 mb-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Actions */}
          <div className="space-y-3">
            {isLoggedIn ? (
              <>
                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Button
                  onClick={() => {
                    onDashboardClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full gradient-blue text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  My Dashboard
                </Button>
                <Button
                  onClick={() => {
                    onBookAppointment();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
                <Button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    onLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    onRegisterClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full gradient-blue text-white"
                >
                  Create Account
                </Button>
                <Button
                  onClick={() => {
                    onBookAppointment();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-primary text-primary"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 p-4 bg-red-50 rounded-xl">
            <p className="text-sm text-red-600 font-medium mb-1">Emergency?</p>
            <a href="tel:+15551234567" className="text-red-700 font-bold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
