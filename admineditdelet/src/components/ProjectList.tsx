import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Edit3, Trash2, CheckCircle, Clock, Calendar, MapPin, Users, DollarSign, ChevronDown, ChevronUp, Save, X } from "lucide-react";

interface Project {
  id?: number;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate?: string;
  completedDate?: string;
  beneficiaries?: string;
  budget?: number;
  fundingSource?: string;
  objectives?: string;
  challenges?: string;
  lessons?: string;
  impact?: string;
  status: 'planning' | 'ongoing' | 'completed' | 'on_hold';
  category: 'child_development' | 'economic_development' | 'education' | 'community_empowerment' | 'governance' | 'healthcare' | 'infrastructure' | 'environment';
  priority?: 'low' | 'medium' | 'high';
  featured?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectListProps {
  refreshTrigger?: number;
}

const ProjectList: React.FC<ProjectListProps> = ({ refreshTrigger }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [impactText, setImpactText] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [toggleProjectId, setToggleProjectId] = useState<number | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());
  const [editFormData, setEditFormData] = useState<Project | null>(null);
  
  const { token } = useAuth();

  const categories = [
    'Child Development',
    'Economic Development', 
    'Education',
    'Community Empowerment',
    'Governance',
    'Healthcare',
    'Water & Sanitation',
    'Agriculture',
    'Environment',
    'Emergency Response'
  ];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects from:', 'http://localhost:5000/api/projects');
      console.log('Token present:', !!token);
      
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Projects fetched successfully:', response.data.length, 'projects');
      setProjects(response.data);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      if (error.response) {
        console.error('Fetch error response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received when fetching projects');
      } else {
        console.error('Request setup error when fetching projects:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token, refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchProjects();
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusToggle = async (project: Project) => {
    if (project.status === 'ongoing') {
      // Show impact modal for completion
      setToggleProjectId(project.id!);
      setShowImpactModal(true);
      setCompletedDate(new Date().toISOString().split('T')[0]);
    } else {
      // Toggle back to ongoing
      try {
        console.log('Attempting to toggle project status...');
        console.log('Project ID:', project.id);
        console.log('Token present:', !!token);
        console.log('API URL:', `http://localhost:5000/api/projects/${project.id}/toggle-status`);
        
        const response = await axios.patch(`http://localhost:5000/api/projects/${project.id}/toggle-status`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Status toggle response:', response.data);
        fetchProjects();
        alert('Project status updated successfully!');
      } catch (error: any) {
        console.error('Full error object:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error config:', error.config);
        
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
          console.error('Error response headers:', error.response.headers);
          alert(`Failed to update project status: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          alert('Failed to update project status: No response from server. Please check if the backend server is running on port 5000.');
        } else {
          console.error('Request setup error:', error.message);
          alert(`Failed to update project status: ${error.message}`);
        }
      }
    }
  };

  const handleImpactSubmit = async () => {
    if (!impactText.trim()) {
      alert('Please enter the project impact.');
      return;
    }

    try {
      console.log('Attempting to mark project as completed...');
      console.log('Project ID:', toggleProjectId);
      console.log('Token present:', !!token);
      console.log('Impact text:', impactText);
      console.log('Completed date:', completedDate);
      console.log('API URL:', `http://localhost:5000/api/projects/${toggleProjectId}/toggle-status`);
      
      const response = await axios.patch(`http://localhost:5000/api/projects/${toggleProjectId}/toggle-status`, {
        impact: impactText,
        completedDate: completedDate
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Impact submit response:', response.data);
      setShowImpactModal(false);
      setImpactText("");
      setCompletedDate("");
      setToggleProjectId(null);
      fetchProjects();
      alert('Project marked as completed successfully!');
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        alert(`Failed to update project status: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('Failed to update project status: No response from server. Please check if the backend server is running on port 5000.');
      } else {
        console.error('Request setup error:', error.message);
        alert(`Failed to update project status: ${error.message}`);
      }
    }
  };

  const toggleDescription = (projectId: number) => {
    const newExpanded = new Set(expandedDescriptions);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedDescriptions(newExpanded);
  };

  const startEdit = (project: Project) => {
    setEditFormData({ ...project });
    setEditingProject(project);
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditFormData(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editFormData) return;
    const { name, value } = e.target;
    setEditFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const saveEdit = async () => {
    if (!editFormData || !editingProject) return;

    try {
      await axios.put(`http://localhost:5000/api/projects/${editingProject.id}`, editFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setEditingProject(null);
      setEditFormData(null);
      fetchProjects();
      alert('Project updated successfully!');
    } catch (error: any) {
      console.error('Error updating project:', error);
      if (error.response) {
        alert(`Failed to update project: ${error.response.data.message || 'Unknown error'}`);
      } else {
        alert('Failed to update project. Please check your connection.');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Child Development': 'bg-pink-100 text-pink-800',
      'Economic Development': 'bg-green-100 text-green-800',
      'Education': 'bg-blue-100 text-blue-800',
      'Community Empowerment': 'bg-purple-100 text-purple-800',
      'Governance': 'bg-indigo-100 text-indigo-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Water & Sanitation': 'bg-cyan-100 text-cyan-800',
      'Agriculture': 'bg-yellow-100 text-yellow-800',
      'Environment': 'bg-emerald-100 text-emerald-800',
      'Emergency Response': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Project Management</h3>
        <p className="text-blue-700">Manage ongoing and completed projects, track impact and beneficiaries.</p>
        <div className="mt-4 text-sm text-blue-600">
          <span className="font-medium">Total Projects:</span> {projects.length} | 
          <span className="font-medium ml-2">Ongoing:</span> {projects.filter(p => p.status === 'ongoing').length} | 
          <span className="font-medium ml-2">Completed:</span> {projects.filter(p => p.status === 'completed').length}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl mb-6">No projects found</p>
          <p className="text-gray-400">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id}>
              {editingProject?.id === project.id ? (
                // Edit Form
                <div className="card border-2 border-primary/30 shadow-2xl bg-gradient-to-br from-white to-blue-50/30">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Edit3 className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold text-foreground">Edit Project</h3>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="btn-primary text-sm px-4 py-2">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </button>
                        <button onClick={cancelEdit} className="btn-secondary text-sm px-4 py-2">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          name="title"
                          value={editFormData?.title || ''}
                          onChange={handleEditInputChange}
                          className="input h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          name="category"
                          value={editFormData?.category || ''}
                          onChange={handleEditInputChange}
                          className="input h-10"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={editFormData?.location || ''}
                          onChange={handleEditInputChange}
                          className="input h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beneficiaries</label>
                        <input
                          type="text"
                          name="beneficiaries"
                          value={editFormData?.beneficiaries || ''}
                          onChange={handleEditInputChange}
                          className="input h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                        <input
                          type="text"
                          name="budget"
                          value={editFormData?.budget || ''}
                          onChange={handleEditInputChange}
                          className="input h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={editFormData?.startDate?.split('T')[0] || ''}
                          onChange={handleEditInputChange}
                          className="input h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        name="description"
                        value={editFormData?.description || ''}
                        onChange={handleEditInputChange}
                        rows={3}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Display Card
                <div className="card hover:shadow-2xl transition-all duration-500 border-muted hover:border-primary/40 hover:scale-[1.03] bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 overflow-hidden">
                  <div className="relative">
                    {/* Status Badge Overlay */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                        project.status === 'ongoing' 
                          ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                      }`}>
                        {project.status === 'ongoing' ? (
                          <><Clock className="w-3 h-3 inline mr-1" />Ongoing</>
                        ) : (
                          <><CheckCircle className="w-3 h-3 inline mr-1" />Completed</>
                        )}
                      </span>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-foreground leading-tight">{project.title}</h3>
                          </div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(project.category)} shadow-sm`}>
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Description with Read More */}
                      <div className="mb-6">
                        <p className="text-muted-foreground leading-relaxed">
                          {expandedDescriptions.has(project.id!) 
                            ? project.description 
                            : `${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}`
                          }
                        </p>
                        {project.description.length > 150 && (
                          <button
                            onClick={() => toggleDescription(project.id!)}
                            className="mt-2 text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                          >
                            {expandedDescriptions.has(project.id!) ? (
                              <>Show Less <ChevronUp className="w-4 h-4" /></>
                            ) : (
                              <>Read More <ChevronDown className="w-4 h-4" /></>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Project Details Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-100">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Location</p>
                            <p className="text-sm font-semibold text-foreground">{project.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-100">
                          <Users className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Beneficiaries</p>
                            <p className="text-sm font-semibold text-foreground">{project.beneficiaries}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-100">
                          <DollarSign className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Budget</p>
                            <p className="text-sm font-semibold text-foreground">{project.budget}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg border border-gray-100">
                          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Start Date</p>
                            <p className="text-sm font-semibold text-foreground">{new Date(project.startDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Impact Section */}
                      {project.impact && (
                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                          <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Project Impact
                          </h4>
                          <p className="text-green-800 text-sm leading-relaxed">{project.impact}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(project)}
                            className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 hover:scale-105 font-medium"
                            title="Edit project details"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id!)}
                            className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 hover:scale-105 font-medium"
                            disabled={deletingId === project.id}
                            title="Delete project"
                          >
                            {deletingId === project.id ? (
                              <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => handleStatusToggle(project)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 font-medium ${
                            project.status === 'ongoing'
                              ? 'text-blue-600 hover:bg-blue-50 border border-blue-200'
                              : 'text-green-600 hover:bg-green-50 border border-green-200'
                          }`}
                          title={`Mark as ${project.status === 'ongoing' ? 'completed' : 'ongoing'}`}
                        >
                          {project.status === 'ongoing' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Mark Complete
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              Mark Ongoing
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Impact Modal */}
      {showImpactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Mark Project as Completed</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Date *
                </label>
                <input
                  type="date"
                  value={completedDate}
                  onChange={(e) => setCompletedDate(e.target.value)}
                  className="input h-10"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Impact *
                </label>
                <textarea
                  value={impactText}
                  onChange={(e) => setImpactText(e.target.value)}
                  placeholder="Describe the impact and outcomes of this project..."
                  rows={4}
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowImpactModal(false);
                  setImpactText("");
                  setCompletedDate("");
                  setToggleProjectId(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleImpactSubmit}
                className="btn-primary"
              >
                Mark as Completed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
