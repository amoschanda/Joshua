// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

// Appointment Types
export interface Appointment {
  id: string;
  type: 'checkup' | 'specialist' | 'telehealth' | 'urgent';
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

// Medical Report Types
export interface MedicalReport {
  id: string;
  title: string;
  type: 'lab' | 'imaging' | 'pathology' | 'other';
  date: string;
  doctor: string;
  status: 'completed' | 'pending';
  summary: string;
  details?: string;
  fileUrl?: string;
}

// Prescription Types
export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  prescribedDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'discontinued';
  instructions: string;
  refillsRemaining: number;
}

// Checkup Types
export interface Checkup {
  id: string;
  type: string;
  date: string;
  doctor: string;
  findings: string;
  recommendations: string;
  nextDue?: string;
  status: 'completed' | 'scheduled' | 'overdue';
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

// Doctor Types
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviews: number;
  experience: string;
  education: string;
  about: string;
  available: boolean;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  text: string;
  treatment: string;
}
