import { FileText, Download, Share2, Printer, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { MedicalReport } from '@/types';

interface ReportDetailModalProps {
  report: MedicalReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportDetailModal({ report, isOpen, onClose }: ReportDetailModalProps) {
  if (!report) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>;
      case 'imaging':
        return <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-purple-600" /></div>;
      case 'pathology':
        return <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-orange-600" /></div>;
      default:
        return <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center"><FileText className="w-6 h-6 text-gray-600" /></div>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lab': return 'Laboratory';
      case 'imaging': return 'Imaging';
      case 'pathology': return 'Pathology';
      default: return 'Other';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {getTypeIcon(report.type)}
              <div>
                <DialogTitle className="text-xl">{report.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                    {report.status === 'completed' ? (
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>
                    ) : (
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
                    )}
                  </Badge>
                  <span className="text-sm text-gray-500">{getTypeLabel(report.type)}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Report Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(report.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ordered By</p>
              <p className="font-medium">{report.doctor}</p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2">Summary</h4>
            <p className="text-gray-700 bg-blue-50 p-4 rounded-xl">{report.summary}</p>
          </div>

          {/* Details */}
          {report.details && (
            <div>
              <h4 className="font-semibold mb-2">Detailed Results</h4>
              <div className="bg-gray-50 p-4 rounded-xl">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{report.details}</pre>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button className="flex-1 gradient-blue text-white flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
