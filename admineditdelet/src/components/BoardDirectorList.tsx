import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Users, Mail, Linkedin } from 'lucide-react';

interface BoardDirector {
  id?: number;
  name: string;
  position: string;
  role?: string;
  bio?: string;
  expertise?: string;
  image?: string;
  profileImage?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  linkedin?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _id?: string; // For compatibility with existing code that uses _id
}

interface BoardDirectorListProps {
  refreshTrigger: number;
}

const BoardDirectorList: React.FC<BoardDirectorListProps> = ({ refreshTrigger }) => {
  const { token } = useAuth();
  const [directors, setDirectors] = useState<BoardDirector[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState<Set<string>>(new Set());

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      console.log('Fetching board directors from:', 'http://localhost:5000/api/board-directors');
      
      const response = await axios.get('http://localhost:5000/api/board-directors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Board directors fetched successfully:', response.data.length, 'directors');
      setDirectors(response.data);
    } catch (error: any) {
      console.error('Error fetching board directors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDirectors();
    }
  }, [token, refreshTrigger]);

  const handleDelete = async (id: number | string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/board-directors/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchDirectors();
      alert('Board director deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting board director:', error);
      alert('Failed to delete board director. Please try again.');
    }
  };


  const handleToggleStatus = async (id: number | string, currentStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:5000/api/board-directors/${id}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchDirectors();
      alert(`Board director ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error: any) {
      console.error('Error toggling director status:', error);
      alert('Failed to update director status. Please try again.');
    }
  };

  const toggleBio = (directorId: string | number) => {
    setExpandedBios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(directorId.toString())) {
        newSet.delete(directorId.toString());
      } else {
        newSet.add(directorId.toString());
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-muted-foreground">Loading board directors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Board of Directors</h2>
        <div className="text-sm text-gray-600">
          {directors.length} director{directors.length !== 1 ? 's' : ''}
        </div>
      </div>

      {directors.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No board directors found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directors.map((director) => (
            <div key={director.id || director._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2 p-6">
              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24">
                  {director.profileImage || director.image ? (
                    <img
                      src={director.profileImage || director.image}
                      alt={director.name}
                      className="w-full h-full object-cover rounded-full shadow-medium"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-medium">
                      {director.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Position */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{director.name}</h3>
                <p className="text-blue-600 font-medium text-lg">{director.position}</p>
              </div>

              {/* Bio */}
              {director.bio && (
                <div className="mb-4">
                  <div className="text-gray-600 text-sm leading-relaxed text-center">
                    {expandedBios.has((director.id || director._id)?.toString() || '') ? (
                      <>
                        {director.bio}
                        <button
                          type="button"
                          onClick={() => toggleBio((director.id || director._id)?.toString() || '')}
                          className="text-blue-600 hover:text-blue-800 ml-2 font-medium inline-flex items-center"
                        >
                          Show Less <ChevronUp className="w-4 h-4 ml-1" />
                        </button>
                      </>
                    ) : (
                      <>
                        {director.bio.length > 120 ? `${director.bio.substring(0, 120)}...` : director.bio}
                        {director.bio.length > 120 && (
                          <button
                            type="button"
                            onClick={() => toggleBio((director.id || director._id)?.toString() || '')}
                            className="text-blue-600 hover:text-blue-800 ml-2 font-medium inline-flex items-center"
                          >
                            Read More <ChevronDown className="w-4 h-4 ml-1" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Expertise */}
              {director.expertise && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-center">Areas of Expertise</h4>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">{director.expertise}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="flex justify-center space-x-4 mb-4">
                {director.email && (
                  <a 
                    href={`mailto:${director.email}`} 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Send Email"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                )}
                {(director.linkedinUrl || director.linkedin) && (
                  <a 
                    href={director.linkedinUrl || director.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  director.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {director.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => alert('Edit functionality will be implemented in a separate form')}
                  className="flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300 text-sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => handleToggleStatus((director.id || director._id)!, director.isActive ?? false)}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 font-medium border text-sm ${
                    director.isActive 
                      ? 'text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300' 
                      : 'text-green-600 hover:bg-green-50 border-green-200 hover:border-green-300'
                  }`}
                >
                  {director.isActive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {director.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete((director.id || director._id)!, director.name)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-red-200 hover:border-red-300 text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardDirectorList;
