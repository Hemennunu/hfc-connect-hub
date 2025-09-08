import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Project {
  id?: number;
  title: string;
  description: string;
  location: string;
  startDate?: string;
  endDate?: string;
  completedDate?: string;
  beneficiaries: string;
  budget: number | string;
  fundingSource?: string;
  impact?: string;
  objectives?: string;
  challenges?: string;
  lessons?: string;
  status: 'planning' | 'ongoing' | 'completed' | 'suspended' | 'cancelled';
  category: 'Child Development' | 'Economic Development' | 'Education' | 'Community Empowerment' | 'Governance' | 'Healthcare' | 'Community Development';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  featured?: boolean;
  createdBy?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectFormProps {
  onProjectAdded: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onProjectAdded }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const [projectData, setProjectData] = useState<Project>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    beneficiaries: "",
    budget: "",
    status: "planning",
    category: "Child Development",
    priority: "medium",
    featured: false,
  });

  const categories = [
    'Child Development',
    'Economic Development', 
    'Education',
    'Community Empowerment',
    'Governance',
    'Healthcare',
    'Community Development'
  ];

  const statuses = [
    'planning',
    'ongoing',
    'completed',
    'suspended',
    'cancelled'
  ];


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/projects', projectData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Reset form
      setProjectData({
        title: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        beneficiaries: "",
        budget: "",
        status: "planning",
        category: "Child Development",
        priority: "medium",
        featured: false,
      });

      alert('Project created successfully!');
      onProjectAdded();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Create New Project</h3>
        <p className="text-blue-700">Add a new project with timeline, budget, and impact details.</p>
      </div>

      <div className="card">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={projectData.title}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                  placeholder="Enter project title"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Category *</label>
                <select
                  name="category"
                  value={projectData.category}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={projectData.location}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                  placeholder="Project location"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Status *</label>
                <select
                  name="status"
                  value={projectData.status}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={projectData.startDate}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={projectData.endDate}
                  onChange={handleInputChange}
                  className="input h-12"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Beneficiaries *</label>
                <input
                  type="text"
                  name="beneficiaries"
                  value={projectData.beneficiaries}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                  placeholder="Number of beneficiaries"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">Budget *</label>
                <input
                  type="text"
                  name="budget"
                  value={projectData.budget}
                  onChange={handleInputChange}
                  required
                  className="input h-12"
                  placeholder="Project budget"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">Description *</label>
              <textarea
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="input"
                placeholder="Detailed project description"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
