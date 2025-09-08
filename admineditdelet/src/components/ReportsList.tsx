import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Download } from 'lucide-react';
import axios from 'axios';
import ReadMore from './ReadMore';

interface Report {
  id: number;
  title: string;
  type: 'annual' | 'project' | 'strategic_plan' | 'financial' | 'impact';
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  year: number;
  featured?: boolean;
  downloadCount?: number;
  status?: 'draft' | 'published' | 'archived';
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ReportsListProps {
  refreshTrigger: number;
}

const ReportsList: React.FC<ReportsListProps> = ({ refreshTrigger }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReports();
  }, [refreshTrigger]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(reports.filter(report => report.id !== id));
      setMessage('Report deleted successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error deleting report');
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
  };

  const handleUpdate = async (updatedData: Partial<Report>) => {
    if (!editingReport) return;

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await axios.put(`http://localhost:5000/api/reports/${editingReport.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setReports(reports.map(report => 
        report.id === editingReport.id ? response.data : report
      ));
      setEditingReport(null);
      setMessage('Report updated successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error updating report');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'project': return 'bg-green-100 text-green-800';
      case 'strategic_plan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'annual': return 'Annual Report';
      case 'project': return 'Project Report';
      case 'strategic_plan': return 'Strategic Plan';
      default: return type;
    }
  };

  const handleDownload = async (report: Report) => {
    try {
      if (!report.fileUrl) {
        setMessage('No file available for download');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/reports/download/${report.id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', report.fileName || `report-${report.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage('Download started successfully');
    } catch (error: any) {
      console.error('Download error:', error);
      setMessage('Error downloading file');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-secondary rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reports Management</h2>
            <p className="text-gray-600">{reports.length} reports available</p>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading your first report.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(report.type)}`}>
                      {getTypeLabel(report.type)}
                    </span>
                    {report.featured && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                  <ReadMore 
                    text={report.description || 'No description available'} 
                    maxLength={100}
                    className="text-gray-600 mb-3"
                  />
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📁 {report.fileName}</span>
                    <span>📊 {report.fileSize ? formatFileSize(report.fileSize) : 'Unknown size'}</span>
                    <span>📅 {report.year}</span>
                    <span>⬇️ {report.downloadCount} downloads</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDownload(report)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(report)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit report"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Edit Report</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleUpdate({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                featured: formData.get('featured') === 'on'
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingReport.title}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingReport.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingReport.featured}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Featured</label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsList;
