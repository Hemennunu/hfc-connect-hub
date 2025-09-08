import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Project {
  id?: number;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate?: string;
  completedDate?: string;
  beneficiaries?: string;
  budget?: string;
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

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [impactText, setImpactText] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  
  const { token } = useAuth();

  const [projectData, setProjectData] = useState<Project>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    beneficiaries: "",
    budget: "",
    status: "ongoing",
    category: "child_development",
  });

  const categories = [
    'child_development',
    'economic_development', 
    'education',
    'community_empowerment',
    'governance',
    'healthcare',
    'infrastructure',
    'environment'
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setProjectData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingProject) {
        await axios.put(
          `http://localhost:5000/api/projects/${editingProject.id}`,
          projectData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Project updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/projects", projectData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Project added successfully!");
      }
      
      resetForm();
      fetchProjects();
    } catch (err) {
      alert("Failed to save project.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setProjectData(project);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Project deleted successfully!");
        fetchProjects();
      } catch (err) {
        alert("Failed to delete project.");
        console.error(err);
      }
    }
  };

  const handleToggleStatus = async (project: Project) => {
    const newStatus = project.status === 'ongoing' ? 'completed' : 'ongoing';
    
    if (newStatus === 'completed') {
      const impact = prompt("Enter the impact achieved by this project:");
      const completedDate = prompt("Enter completion date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
      
      if (!impact || !completedDate) return;
      
      try {
        await axios.patch(
          `http://localhost:5000/api/projects/${project.id}/toggle-status`,
          { impact, completedDate },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Project marked as completed!");
        fetchProjects();
      } catch (err) {
        alert("Failed to update project status.");
        console.error(err);
      }
    } else {
      try {
        await axios.patch(
          `http://localhost:5000/api/projects/${project.id}/toggle-status`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Project marked as ongoing!");
        fetchProjects();
      } catch (err) {
        alert("Failed to update project status.");
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setProjectData({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      beneficiaries: "",
      budget: "",
      status: "ongoing",
      category: "child_development",
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'healthcare': 'bg-red-100 text-red-800',
      'education': 'bg-blue-100 text-blue-800',
      'child_development': 'bg-purple-100 text-purple-800',
      'governance': 'bg-indigo-100 text-indigo-800',
      'economic_development': 'bg-green-100 text-green-800',
      'infrastructure': 'bg-orange-100 text-orange-800',
      'community_empowerment': 'bg-yellow-100 text-yellow-800',
      'environment': 'bg-emerald-100 text-emerald-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Project Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-primary hover:bg-gradient-hero text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
        >
          {showForm ? "Cancel" : "Add New Project"}
        </button>
      </div>

      {showForm && (
        <div className="bg-card p-8 rounded-lg shadow-medium border">
          <h3 className="text-2xl font-bold mb-6 text-foreground">
            {editingProject ? "Edit Project" : "Add New Project"}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter project title..."
                  value={projectData.title}
                  onChange={handleChange}
                  required
                  className="input h-12"
                />
              </div>
              
              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Category
                </label>
                <select
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  required
                  className="input h-12"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter project description..."
                value={projectData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter project location..."
                  value={projectData.location}
                  onChange={handleChange}
                  required
                  className="input h-12"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Beneficiaries
                </label>
                <input
                  type="text"
                  name="beneficiaries"
                  placeholder="Enter number/description of beneficiaries..."
                  value={projectData.beneficiaries}
                  onChange={handleChange}
                  required
                  className="input h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  Start Date
                </label>
                <input
                  type="text"
                  name="startDate"
                  placeholder="e.g., 2020, January 2020, etc."
                  value={projectData.startDate}
                  onChange={handleChange}
                  required
                  className="input h-12"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-foreground">
                  End Date (Optional)
                </label>
                <input
                  type="text"
                  name="endDate"
                  placeholder="e.g., Ongoing, December 2023, etc."
                  value={projectData.endDate}
                  onChange={handleChange}
                  className="input h-12"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Budget/Funding Source
              </label>
              <input
                type="text"
                name="budget"
                placeholder="Enter budget or funding source..."
                value={projectData.budget}
                onChange={handleChange}
                required
                className="input h-12"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground">
                Status
              </label>
              <select
                name="status"
                value={projectData.status}
                onChange={handleChange}
                className="input h-12"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary hover:bg-gradient-hero text-primary-foreground px-8 py-4 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : editingProject ? "Update Project" : "Add Project"}
            </button>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-foreground">All Projects</h3>
        
        {projects.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No projects found. Add your first project above.
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-card p-6 rounded-lg shadow-medium border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-foreground">{project.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(project.category)}`}>
                        {project.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === 'ongoing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {project.status === 'ongoing' ? 'Ongoing' : 'Completed'}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Location:</span> {project.location}
                      </div>
                      <div>
                        <span className="font-medium">Start:</span> {project.startDate}
                      </div>
                      <div>
                        <span className="font-medium">Beneficiaries:</span> {project.beneficiaries}
                      </div>
                      <div>
                        <span className="font-medium">Budget:</span> {project.budget}
                      </div>
                    </div>
                    {project.impact && (
                      <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                        <span className="font-medium">Impact:</span> {project.impact}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(project)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(project)}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      project.status === 'ongoing'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    Mark as {project.status === 'ongoing' ? 'Completed' : 'Ongoing'}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id!)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
