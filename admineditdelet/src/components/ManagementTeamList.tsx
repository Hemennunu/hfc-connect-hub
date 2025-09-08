import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trash2, X, Eye, EyeOff, ChevronDown, ChevronUp, Users, Mail, Linkedin } from 'lucide-react';
import ManagementTeamForm from './ManagementTeamForm';

interface ManagementTeamMember {
  id?: number;
  _id?: string; // For compatibility with backend
  name: string;
  position: string;
  bio?: string;
  expertise?: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  linkedin?: string;
  department?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ManagementTeamListProps {
  refreshTrigger?: number;
  onMemberAdded?: () => void;
}

const ManagementTeamList: React.FC<ManagementTeamListProps> = ({ refreshTrigger }) => {
  const { token } = useAuth();
  const [members, setMembers] = useState<ManagementTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<ManagementTeamMember | null>(null);
  const [expandedBios, setExpandedBios] = useState<Set<string>>(new Set());

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/management-team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMembers(response.data || []);
    } catch (error: any) {
      console.error('Error fetching management team:', error);
      setMembers([]); // Set empty array on error to prevent white screen
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMembers();
    }
  }, [token, refreshTrigger]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember?.id || isUploading) return;
    
    setIsUploading(true);
    
    const formData = new FormData(e.currentTarget);
    const imageFile = (e.currentTarget.elements.namedItem('profileImage') as HTMLInputElement)?.files?.[0];
    const imageUrl = formData.get('imageUrl') as string;
    
    const submitData = new FormData();
    submitData.append('name', formData.get('name') as string);
    submitData.append('position', formData.get('position') as string);
    submitData.append('expertise', formData.get('expertise') as string);
    
    // Handle file upload or image URL
    if (imageFile) {
      submitData.append('profileImage', imageFile);
    } else if (imageUrl && imageUrl.trim()) {
      submitData.append('profileImageUrl', imageUrl);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/management-team/${editingMember.id}`,
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      setEditingMember(null);
      setImagePreview(null);
      fetchMembers();
      alert('Management team member updated successfully!');
    } catch (error: any) {
      console.error('Error updating management team member:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update management team member. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (memberId: string | number, memberName: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/management-team/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the member from the local state
      setMembers(members.filter(m => m.id !== memberId && m._id !== memberId));
      alert('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member');
    }
  };

  const handleToggleStatus = async (id: string | number) => {
    if (!token) return;

    try {
      const response = await axios.patch(
        `http://localhost:5000/api/management-team/${id}/toggle-status`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update the member's status in the local state
      setMembers(members.map(member => 
        (member.id === id || member._id === id) 
          ? { ...member, isActive: response.data.isActive } 
          : member
      ));
      
      alert(`Member ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling member status:', error);
      alert('Failed to update member status');
    }
  };

  const toggleBio = (memberId: string) => {
    setExpandedBios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const getDepartmentColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Finance & Administration': 'bg-blue-100 text-blue-800',
      'Programs & Development': 'bg-green-100 text-green-800',
      'Communications & Development': 'bg-orange-100 text-orange-800',
      'Branch Management': 'bg-indigo-100 text-indigo-800',
      'Psychosocial Support & Education': 'bg-pink-100 text-pink-800',
      'Human Resources': 'bg-yellow-100 text-yellow-800',
      'Operations': 'bg-gray-100 text-gray-800',
      'Other': 'bg-slate-100 text-slate-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-muted-foreground">Loading management team...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Management Team</h2>
        <div className="text-sm text-gray-600">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No management team members found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2 p-6">
              {editingMember && editingMember.id === member.id ? (
                // Edit Mode - Simplified Form
                <form onSubmit={handleSaveEdit} className="space-y-4">
                  {/* Profile Image Preview */}
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover rounded-full shadow-medium"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <input
                    name="name"
                    defaultValue={member.name}
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-md text-center font-semibold"
                    required
                  />
                  <input
                    name="position"
                    defaultValue={member.position}
                    placeholder="Position"
                    className="w-full p-3 border rounded-md text-center"
                    required
                  />
                  <textarea
                    name="expertise"
                    defaultValue={member.expertise || ''}
                    placeholder="Expertise Description"
                    className="w-full p-3 border rounded-md h-32 resize-none"
                    rows={4}
                    required
                  />
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                        <input
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-500">OR</div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        name="imageUrl"
                        defaultValue={member.image || ''}
                        placeholder="https://example.com/image.jpg"
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    {(imagePreview || member.image) && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                        <img 
                          src={imagePreview || member.image} 
                          alt="Preview" 
                          className="h-24 w-24 object-cover rounded-md mx-auto"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className={`flex items-center justify-center px-4 py-2 rounded-md flex-1 ${
                        isUploading 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white`}
                    >
                      {isUploading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S16.627 6 12 6z"></path>
                          </svg>
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                // Normal View
                <div>
                  {/* Name and Position */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-blue-600 font-medium text-lg">{member.position}</p>
                    {member.department && (
                      <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <div className="mb-4">
                      <div className="text-gray-600 text-sm leading-relaxed text-center">
                        {expandedBios.has((member.id || member._id)?.toString() || '') ? (
                          <>
                            {member.bio}
                            <button
                              type="button"
                              onClick={() => toggleBio((member.id || member._id)?.toString() || '')}
                              className="text-blue-600 hover:text-blue-800 ml-2 font-medium inline-flex items-center"
                            >
                              Show Less <ChevronUp className="w-4 h-4 ml-1" />
                            </button>
                          </>
                        ) : (
                          <>
                            {member.bio.length > 100 ? `${member.bio.substring(0, 100)}...` : member.bio}
                            {member.bio.length > 100 && (
                              <button
                                type="button"
                                onClick={() => toggleBio((member.id || member._id)?.toString() || '')}
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
                  {member.expertise && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-center">Areas of Expertise</h4>
                      <p className="text-gray-600 text-sm text-center leading-relaxed">{member.expertise}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  {(member.email || member.phone || member.linkedinUrl || member.linkedin) && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-center">Contact</h4>
                      <div className="flex justify-center space-x-4">
                        {member.email && (
                          <a 
                            href={`mailto:${member.email}`}
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            title="Email"
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                        )}
                        {(member.linkedinUrl || member.linkedin) && (
                          <a 
                            href={member.linkedinUrl || member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300 text-sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const memberId = member.id || member._id;
                        if (memberId !== undefined) {
                          handleToggleStatus(memberId);
                        }
                      }}
                      className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 font-medium border text-sm ${
                        member.isActive 
                          ? 'text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300' 
                          : 'text-green-600 hover:bg-green-50 border-green-200 hover:border-green-300'
                      }`}
                    >
                      {member.isActive ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        const memberId = member.id || member._id;
                        if (memberId !== undefined) {
                          handleDelete(memberId, member.name);
                        }
                      }}
                      className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium border border-red-200 hover:border-red-300 text-sm"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Edit Team Member</h3>
                <button 
                  onClick={() => setEditingMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ManagementTeamForm 
                member={editingMember}
                onSuccess={() => {
                  setEditingMember(null);
                  fetchMembers();
                }}
                onCancel={() => setEditingMember(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementTeamList;
