import React, { useState, useEffect } from 'react';
import { User, Award, MapPin, Calendar, Mail, Phone, ExternalLink, CheckCircle, XCircle, Edit, Trash2, Search } from 'lucide-react';
import ReadMore from './ReadMore';

interface Alumni {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  currentOccupation?: string;
  company?: string;
  location?: string;
  yearsInProgram?: string;
  graduationYear?: number;
  successStory?: string;
  achievements?: string[] | string;
  linkedinProfile?: string;
  websiteUrl?: string;
  consented?: boolean;
  isPublic?: boolean;
  testimonial?: string;
  impactStatement?: string;
  mentorshipAvailable?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  createdBy?: number;
  createdByAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AlumniListProps {
  onEdit: (alumni: Alumni) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  refreshTrigger: number;
}

const AlumniList: React.FC<AlumniListProps> = ({ onEdit, onDelete, onApprove, refreshTrigger }) => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchAlumni = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching alumni with token:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:5000/api/alumni', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Alumni fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Alumni data received:', data.length, 'records');
        setAlumni(data);
      } else {
        const errorText = await response.text();
        console.error('Alumni fetch failed:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [refreshTrigger]);

  const handleApprove = async (id: string) => {
    try {
      onApprove(id);
    } catch (error) {
      console.error('Error approving alumni:', error);
    }
  };

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (person.currentOccupation && person.currentOccupation.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (person.company && person.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'pending' && !person.consented && !person.createdByAdmin) ||
                         (filterStatus === 'approved' && person.consented);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search alumni by name, occupation, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Alumni</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <div key={person.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
            {/* Header with Status */}
            <div className={`px-6 py-4 ${person.consented ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {person.profileImage ? (
                    <img
                                            src={`http://localhost:5000/uploads/alumni/${person.profileImage}?t=${person.updatedAt ? new Date(person.updatedAt).getTime() : new Date().getTime()}`}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-600">{person.currentOccupation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {person.consented ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-3">
              {/* Basic Info */}
              <div className="space-y-2 text-sm">
                {person.company && (
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>{person.company}</span>
                  </div>
                )}
                {person.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{person.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Class of {person.graduationYear} • {person.yearsInProgram}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{person.email}</span>
                </div>
                {person.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{person.phone}</span>
                  </div>
                )}
              </div>

              {/* Success Story */}
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Success Story</h4>
                <ReadMore text={person.successStory || 'No success story available'} maxLength={120} />
              </div>

              {/* Achievements */}
              {(() => {
                let achievements: string[] = [];
                
                if (Array.isArray(person.achievements)) {
                  achievements = person.achievements;
                } else if (typeof person.achievements === 'string' && person.achievements) {
                  try {
                    achievements = JSON.parse(person.achievements);
                  } catch (e) {
                    achievements = [];
                  }
                }
                
                return achievements && achievements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Key Achievements</h4>
                    <div className="flex flex-wrap gap-1">
                      {achievements.slice(0, 3).map((achievement, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {achievement}
                        </span>
                      ))}
                      {achievements.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{achievements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* External Links */}
              <div className="flex space-x-2">
                {person.linkedinProfile && (
                  <a
                    href={person.linkedinProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="LinkedIn Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {person.websiteUrl && (
                  <a
                    href={person.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                    title="Personal Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Mentorship Badge */}
              {person.mentorshipAvailable && (
                <div className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  Available for Mentorship
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    console.log('Edit button clicked for:', person.name);
                    onEdit(person);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    console.log('Delete button clicked for:', person.name, person.id);
                    onDelete(person.id.toString());
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {!person.consented && !person.createdByAdmin && (
                <button
                  onClick={() => handleApprove(person.id.toString())}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No alumni found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding the first alumni profile.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlumniList;
