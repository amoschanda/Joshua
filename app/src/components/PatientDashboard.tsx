import { useState } from 'react';
import { 
  CalendarDays, FileText, Pill, Activity, User, LogOut, 
  Download, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { MOCK_APPOINTMENTS, MOCK_REPORTS, MOCK_PRESCRIPTIONS, MOCK_CHECKUPS } from '@/data/mock';
import { ReportDetailModal } from './ReportDetailModal';
import type { MedicalReport } from '@/types';

interface PatientDashboardProps {
  onClose: () => void;
}

export function PatientDashboard({ onClose }: PatientDashboardProps) {
  const { user, logout } = useAuth();
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onClose();
  };

  const openReportDetail = (report: MedicalReport) => {
    setSelectedReport(report);
    setIsReportModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      scheduled: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      active: 'bg-green-100 text-green-700',
      expired: 'bg-gray-100 text-gray-700',
      overdue: 'bg-red-100 text-red-700',
      discontinued: 'bg-gray-100 text-gray-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  const pendingReportsCount = MOCK_REPORTS.filter(r => r.status === 'pending').length;
  const activePrescriptionsCount = MOCK_PRESCRIPTIONS.filter(p => p.status === 'active').length;
  const upcomingAppointmentsCount = MOCK_APPOINTMENTS.filter(a => a.status === 'scheduled').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="gradient-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
                <p className="text-white/80">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={onClose}>
                Back to Home
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointmentsCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReportsCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{activePrescriptionsCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Pill className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Checkups Due</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" /> <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="checkups" className="flex items-center gap-2">
              <Activity className="w-4 h-4" /> <span className="hidden sm:inline">Checkups</span>
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <Pill className="w-4 h-4" /> <span className="hidden sm:inline">Prescriptions</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" /> <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="mt-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">My Appointments</h2>
                <p className="text-gray-500">View and manage your scheduled appointments</p>
              </div>
              <div className="divide-y">
                {MOCK_APPOINTMENTS.map((appointment) => (
                  <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <CalendarDays className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                          <p className="text-sm text-gray-400">{appointment.notes}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{new Date(appointment.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{appointment.time}</p>
                        </div>
                        <Badge className={getStatusBadge(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Medical Reports Tab */}
          <TabsContent value="records" className="mt-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Medical Reports</h2>
                <p className="text-gray-500">View your lab results, imaging, and other medical reports</p>
              </div>
              <div className="divide-y">
                {MOCK_REPORTS.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          report.type === 'lab' ? 'bg-blue-100' : 
                          report.type === 'imaging' ? 'bg-purple-100' : 'bg-orange-100'
                        }`}>
                          <FileText className={`w-6 h-6 ${
                            report.type === 'lab' ? 'text-blue-600' : 
                            report.type === 'imaging' ? 'text-purple-600' : 'text-orange-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-gray-500">{report.doctor}</p>
                          <p className="text-sm text-gray-400 mt-1">{report.summary.substring(0, 80)}...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{new Date(report.date).toLocaleDateString()}</p>
                          <Badge className={getStatusBadge(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        {report.status === 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => openReportDetail(report)}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Checkups Tab */}
          <TabsContent value="checkups" className="mt-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Health Checkups</h2>
                <p className="text-gray-500">Track your checkup history and upcoming screenings</p>
              </div>
              <div className="divide-y">
                {MOCK_CHECKUPS.map((checkup) => (
                  <div key={checkup.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          checkup.status === 'completed' ? 'bg-green-100' : 
                          checkup.status === 'scheduled' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          <Activity className={`w-6 h-6 ${
                            checkup.status === 'completed' ? 'text-green-600' : 
                            checkup.status === 'scheduled' ? 'text-blue-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{checkup.type}</p>
                          <p className="text-sm text-gray-500">{checkup.doctor}</p>
                          <p className="text-sm text-gray-400 mt-1">{checkup.findings}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{new Date(checkup.date).toLocaleDateString()}</p>
                          {checkup.nextDue && (
                            <p className="text-sm text-gray-500">Next due: {new Date(checkup.nextDue).toLocaleDateString()}</p>
                          )}
                        </div>
                        <Badge className={getStatusBadge(checkup.status)}>
                          {checkup.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="mt-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">My Prescriptions</h2>
                <p className="text-gray-500">View and manage your medications</p>
              </div>
              <div className="divide-y">
                {MOCK_PRESCRIPTIONS.map((prescription) => (
                  <div key={prescription.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          prescription.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Pill className={`w-6 h-6 ${
                            prescription.status === 'active' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium">{prescription.medication} {prescription.dosage}</p>
                          <p className="text-sm text-gray-500">{prescription.frequency}</p>
                          <p className="text-sm text-gray-400 mt-1">{prescription.instructions}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{prescription.prescribedBy}</p>
                          <p className="text-sm text-gray-500">Refills: {prescription.refillsRemaining}</p>
                        </div>
                        <Badge className={getStatusBadge(prescription.status)}>
                          {prescription.status}
                        </Badge>
                        {prescription.status === 'active' && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" /> Refill
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">First Name</label>
                  <p className="font-medium text-lg">{user?.firstName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Name</label>
                  <p className="font-medium text-lg">{user?.lastName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium text-lg">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium text-lg">{user?.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date of Birth</label>
                  <p className="font-medium text-lg">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Patient ID</label>
                  <p className="font-medium text-lg">MH-{user?.id?.padStart(6, '0')}</p>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="outline">Change Password</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
