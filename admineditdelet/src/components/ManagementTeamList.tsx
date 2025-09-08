import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trash2, Save, X, Eye, EyeOff, ChevronDown, ChevronUp, Users, Mail, Linkedin, Twitter } from 'lucide-react';

interface ManagementTeamMember {
  id?: number;
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
      setMembers(response.data);
    } catch (error: any) {
      console.error('Error fetching management team:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMembers();
    }
  }, [token, refreshTrigger]);

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMember?.id) return;

    const formData = new FormData(e.currentTarget);
    const updateData = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      expertise: formData.get('expertise') as string,
      image: formData.get('image') as string,
    };

    try {
      await axios.put(
        `http://localhost:5000/api/management-team/${editingMember.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setEditingMember(null);
      fetchMembers();
      alert('Management team member updated successfully!');
    } catch (error: any) {
      console.error('Error updating management team member:', error);
      alert('Failed to update management team member. Please try again.');
    }
  };

  const handleDelete = async (memberId: number, memberName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/management-team/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      fetchMembers();
      alert('Management team member deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting management team member:', error);
      alert('Failed to delete management team member. Please try again.');
    }
  };

  const handleToggleStatus = async (memberId: number, currentStatus: boolean) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/management-team/${memberId}/toggle-status`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, isActive: !currentStatus }
            : member
        )
      );
      fetchMembers();
      alert(`Management team member ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error: any) {
      console.error('Error toggling management team member status:', error);
      alert('Failed to update management team member status. Please try again.');
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
                  <input
                    name="image"
                    defaultValue={member.image || ''}
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
                      onClick={() => setEditingMember(null)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode - Circular Profile Design
                <div className="text-center">
                  {/* Profile Image */}
                  <div className="mb-4">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 object-cover rounded-full mx-auto shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Name and Position */}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{member.name}</h3>
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm mb-2">
                    {member.position}
                  </div>
                  
                  {/* Department Badge */}
                  {member.department && (
                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </span>
                    </div>
                  )}
                  
                  {/* Expertise with Read More */}
                  {member.expertise && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {expandedBios.has((member.id?.toString() || '') + '_expertise') || member.expertise.length <= 100
                          ? member.expertise
                          : `${member.expertise.substring(0, 100)}...`
                        }
                      </p>
                      {member.expertise.length > 100 && (
                        <button
                          onClick={() => toggleBio((member.id?.toString() || '') + '_expertise')}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
                        >
                          {expandedBios.has((member.id?.toString() || '') + '_expertise') ? (
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
                  {(member.email || member.linkedin || member.phone) && (
                    <div className="flex justify-center space-x-4 mb-4">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:text-blue-800">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="text-blue-600 hover:text-blue-800">
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                  
                  {/* Status and Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(member.id!, member.isActive ?? false)}
                        className={`flex items-center px-3 py-1 rounded-md transition-colors ${
                          member.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {member.isActive ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(member.id!, member.name)}
                        className="flex items-center px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.isActive ? 'Active' : 'Inactive'}
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

export default ManagementTeamList;
