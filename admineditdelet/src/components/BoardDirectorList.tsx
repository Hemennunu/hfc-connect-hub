import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trash2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp, Users, Mail, Linkedin, Twitter } from 'lucide-react';

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
  const [editingDirector, setEditingDirector] = useState<BoardDirector | null>(null);
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

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDirector?.id && !editingDirector?._id) return;

    const formData = new FormData(e.currentTarget);
    const updateData = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      expertise: formData.get('expertise') as string,
      profileImage: formData.get('profileImage') as string,
    };

    const directorId = editingDirector.id || editingDirector._id;

    try {
      await axios.put(`http://localhost:5000/api/board-directors/${directorId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setEditingDirector(null);
      fetchDirectors();
      alert('Board director updated successfully!');
    } catch (error: any) {
      console.error('Error updating board director:', error);
      alert('Failed to update board director. Please try again.');
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

  const toggleExpertise = (directorId: string) => {
    setExpandedBios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(directorId + '_expertise')) {
        newSet.delete(directorId + '_expertise');
      } else {
        newSet.add(directorId + '_expertise');
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
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {directors.map((director) => (
            <div key={director._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2 p-6">
              {editingDirector?._id === director._id ? (
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  {/* Profile Image Preview */}
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
                  
                  <input
                    name="name"
                    defaultValue={director.name}
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-md text-center font-semibold"
                    required
                  />
                  <input
                    name="position"
                    defaultValue={director.position || director.role}
                    placeholder="Position"
                    className="w-full p-3 border rounded-md text-center"
                    required
                  />
                  <textarea
                    name="expertise"
                    defaultValue={director.expertise}
                    placeholder="Expertise Description"
                    className="w-full p-3 border rounded-md h-32 resize-none"
                    rows={4}
                    required
                  />
                  <input
                    name="profileImage"
                    defaultValue={director.profileImage || director.image || ''}
                    placeholder="Profile Image URL"
                    className="w-full p-3 border rounded-md"
                  />
                  <div className="flex space-x-2 mt-4">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDirector(null)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="mb-4">
                    {director.profileImage || director.image ? (
                      <img
                        src={director.profileImage || director.image}
                        alt={director.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {director.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name and Position */}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{director.name}</h3>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-2">
                    {director.position || director.role}
                  </div>
                  
                  {/* Expertise */}
                  {director.expertise && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {expandedBios.has(director._id! + '_expertise') || director.expertise.length <= 100
                          ? director.expertise
                          : `${director.expertise.substring(0, 100)}...`
                        }
                      </p>
                      {director.expertise.length > 100 && (
                        <button
                          onClick={() => toggleExpertise(director._id!)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
                        >
                          {expandedBios.has(director._id! + '_expertise') ? (
                            <>
                              Read Less
                              <ChevronUp className="w-4 h-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Read More
                              <ChevronDown className="w-4 h-4 ml-1" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {/* Contact Links */}
                  {(director.email || director.linkedin || director.phone) && (
                    <div className="flex justify-center space-x-4 mb-4">
                      {director.email && (
                        <a href={`mailto:${director.email}`} className="text-blue-600 hover:text-blue-800">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {director.linkedin && (
                        <a href={director.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {director.phone && (
                        <a href={`tel:${director.phone}`} className="text-blue-600 hover:text-blue-800">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                  
                  {/* Status and Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingDirector(director)}
                        className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(director._id!, director.isActive ?? false)}
                        className={`flex items-center px-3 py-1 rounded-md transition-colors ${
                          director.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {director.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {director.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(director._id!, director.name)}
                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      director.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {director.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardDirectorList;
