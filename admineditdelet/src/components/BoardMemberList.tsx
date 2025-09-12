import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Edit3, Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Users, Mail, Linkedin } from 'lucide-react';

interface BoardMember {
  id?: number;
  name: string;
  role?: string;
  education?: string;
  bio?: string;
  profileImage?: string;
  linkedinProfile?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _id?: string; // For compatibility with existing code that uses _id
}

interface BoardMemberListProps {
  refreshTrigger: number;
  onEdit: (member: BoardMember) => void;
}

const BoardMemberList: React.FC<BoardMemberListProps> = ({ refreshTrigger, onEdit }) => {
  const { token } = useAuth();
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState<Set<string>>(new Set());

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/board-members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMembers(response.data);
    } catch (error: any) {
      console.error('Error fetching board members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMembers();
    }
  }, [token, refreshTrigger]);

  const handleDelete = async (id: number | string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/board-members/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchMembers();
      alert('Board member deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting board member:', error);
      alert('Failed to delete board member. Please try again.');
    }
  };


  const handleToggleStatus = async (id: number | string, currentStatus: boolean) => {
    try {
      await axios.patch(`http://localhost:5000/api/board-members/${id}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      fetchMembers();
      alert(`Board member ${currentStatus ? 'deactivated' : 'activated'} successfully!`);
    } catch (error: any) {
      console.error('Error toggling member status:', error);
      alert('Failed to update member status. Please try again.');
    }
  };

  const toggleBio = (memberId: string | number) => {
    setExpandedBios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId.toString())) {
        newSet.delete(memberId.toString());
      } else {
        newSet.add(memberId.toString());
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-muted-foreground">Loading board members...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Board of Members</h2>
        <div className="text-sm text-gray-600">
          {members.length} member{members.length !== 1 ? 's' : ''}
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No board members found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id || member._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2 p-6">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24">
                  {member.profileImage ? (
                    <img
                      src={`http://localhost:5000${member.profileImage}`}
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

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium text-lg">{member.role}</p>
              </div>

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
                        {member.bio.length > 120 ? `${member.bio.substring(0, 120)}...` : member.bio}
                        {member.bio.length > 120 && (
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

              {member.education && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-center">Education</h4>
                  <p className="text-gray-600 text-sm text-center leading-relaxed">{member.education}</p>
                </div>
              )}

              <div className="flex justify-center space-x-4 mb-4">
                {member.linkedinProfile && (
                  <a 
                    href={member.linkedinProfile} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>

              <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onEdit(member)}
                  className="flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300 text-sm"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={() => handleToggleStatus((member.id || member._id)!, member.isActive ?? false)}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 font-medium border text-sm ${member.isActive ? 'text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300' : 'text-green-600 hover:bg-green-50 border-green-200 hover:border-green-300'}`}>
                  {member.isActive ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {member.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete((member.id || member._id)!, member.name)}
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

export default BoardMemberList;
