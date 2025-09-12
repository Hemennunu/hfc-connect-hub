/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import NewsAdminForm from "../../components/NewsManagement";
import StaffAdminForm from "../../components/StaffManagement";
import AdminManagement from "../../components/AdminManagement";
import GalleryManagement from "../../components/GalleryManagement";
import GalleryList from "../../components/GalleryList";
import ReportsManagement from "../../components/ReportsManagement";
import ReportsList from "../../components/ReportsList";
import CaseStoriesManagement from "../../components/CaseStoriesManagement";
import CaseStoriesList from "../../components/CaseStoriesList";
import AlumniList from "../../components/AlumniList";
import AlumniForm from "../../components/AlumniForm";
import ProjectForm from '../../components/ProjectForm';
import ProjectList from '../../components/ProjectList';
import BoardDirectorForm from '../../components/BoardDirectorForm';
import BoardDirectorList from '../../components/BoardDirectorList';
import ManagementTeamForm from '../../components/ManagementTeamForm';
import ManagementTeamList from '../../components/ManagementTeamList';
import BoardMemberList from '../../components/BoardMemberList';
import BoardMemberForm from '../../components/BoardMemberForm';
import StatsManagement from '../../components/StatsManagement';
import { getNews, deleteNews, updateNews, getAdmins, deleteAdmin } from "../../services/api";
import axios from "axios";
import {
  Plus,
  FileText,
  Users,
  UserCheck,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Shield,
  UserCog,
  Image,
  GraduationCap,
  FolderOpen,
  BarChart3,
} from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  type: string;
  content: string;
  date: string;
  eventDate?: string;
  location?: string;
  mediaUrl?: string;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  location: string;
  contact: string;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const { token } = useAuth();

  type Tab = "addNews" | "newsList" | "addStaff" | "staffList" | "addAdmin" | "adminList" | "addGallery" | "galleryList" | "addReport" | "reportsList" | "addCaseStory" | "caseStoriesList" | "addAlumni" | "alumniList" | "addProject" | "projectList" | "addBoardDirector" | "boardDirectorList" | "addBoardMember" | "boardMemberList" | "addManagementTeam" | "managementTeamList" | "statistics";
  const [activeTab, setActiveTab] = useState<Tab>("newsList");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // News states
  const [newsList, setNewsList] = useState<NewsArticle[]>([]);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [deletingNewsId, setDeletingNewsId] = useState<number | null>(null);

  // Staff states
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<number | null>(null);

  // Admin states
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null);

  // Gallery states
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [editingGalleryItem, setEditingGalleryItem] = useState<any | null>(null);
  

  // Reports states
  const [reportsRefreshKey, setReportsRefreshKey] = useState(0);
  const [reportsList, setReportsList] = useState<any[]>([]);

  // Case Stories states
  const [caseStoriesRefreshKey, setCaseStoriesRefreshKey] = useState(0);
  const [caseStoriesList, setCaseStoriesList] = useState<any[]>([]);
  const [editingCaseStory, setEditingCaseStory] = useState<any | null>(null);

  // Alumni states
  const [alumniRefreshKey, setAlumniRefreshKey] = useState(0);
  const [alumniList, setAlumniList] = useState<any[]>([]);
  const [editingAlumni, setEditingAlumni] = useState<any>(null);
  const [showAlumniForm, setShowAlumniForm] = useState(false);
  const [alumniFormLoading, setAlumniFormLoading] = useState(false);

  // Project states
  const [projectRefreshKey, setProjectRefreshKey] = useState(0);
  const [projectsList, setProjectsList] = useState<any[]>([]);

  // Board Director states
  const [boardDirectorRefreshKey, setBoardDirectorRefreshKey] = useState(0);
  const [editingBoardDirector, setEditingBoardDirector] = useState<any | null>(null);

  // Management Team states
  const [managementTeamRefreshKey, setManagementTeamRefreshKey] = useState(0);
  const [editingBoardMember, setEditingBoardMember] = useState<any | null>(null);
  const [boardMemberRefreshKey, setBoardMemberRefreshKey] = useState(0);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize fetch functions to prevent unnecessary re-renders
  const fetchNews = React.useCallback(async () => {
    try {
      const response = await getNews(token!);
      setNewsList(response.data);
    } catch (error) {
      console.error("Failed to fetch news", error);
    }
  }, [token]);

  const fetchAlumni = React.useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alumni', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setAlumniList(response.data);
      }
    } catch (error) {
      console.error('Error fetching alumni:', error);
    }
  }, [token]);

  const fetchProjects = React.useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setProjectsList(response.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [token]);

  const fetchStaff = React.useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(response.data);
    } catch (error) {
      console.error("Failed to fetch staff", error);
    }
  }, [token]);

  const fetchAdmins = React.useCallback(async () => {
    if (!token) {
      console.log("No token available for fetching admins");
      return;
    }
    try {
      console.log("Fetching admins with token:", token);
      const response = await getAdmins(token);
      console.log("Admin fetch response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);
      
      if (response.data && Array.isArray(response.data)) {
        setAdminList(response.data);
        console.log("Set admin list to:", response.data);
      } else {
        console.log("Invalid response data format:", response.data);
        setAdminList([]);
      }
    } catch (error) {
      console.error("Failed to fetch admins - full error:", error);
      console.error("Error response:", (error as any).response);
      setAdminList([]);
    }
  }, [token]);

  // Fetch functions for new lists
  const fetchGallery = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/gallery');
      const data = await response.json();
      setGalleryList(data);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
    }
  }, []);

  const fetchReports = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reports');
      const data = await response.json();
      setReportsList(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  }, []);

  const fetchCaseStories = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/case-stories');
      const data = await response.json();
      setCaseStoriesList(data);
    } catch (error) {
      console.error('Failed to fetch case stories:', error);
    }
  }, []);


  useEffect(() => {
    if (token) {
      fetchNews();
      fetchStaff();
      fetchAdmins();
      fetchGallery();
      fetchReports();
      fetchCaseStories();
      fetchAlumni();
      fetchProjects();
    }
  }, [token, fetchNews, fetchStaff, fetchAdmins, fetchGallery, fetchReports, fetchCaseStories, fetchAlumni, fetchProjects]);

  const handleNewsAdded = () => {
    fetchNews();
    setActiveTab("newsList");
  };

  const handleStaffAdded = () => {
    fetchStaff();
    setActiveTab("staffList");
    setEditingStaff(null); // Ensure we're not in edit mode
  };

  const handleAdminAdded = () => {
    fetchAdmins();
    setActiveTab("adminList");
  };

  const handleGalleryAdded = () => {
    setGalleryRefreshKey(prev => prev + 1);
    fetchGallery();
    setActiveTab("galleryList");
    setEditingGalleryItem(null);
  };

  const handleEditGalleryItem = (item: any) => {
    setEditingGalleryItem(item);
    setActiveTab("addGallery");
  };

  const handleUpdateGalleryItem = async (id: number, data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/gallery/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      handleGalleryAdded();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating gallery item');
    }
  };

  

  const handleReportAdded = () => {
    setReportsRefreshKey(prev => prev + 1);
    fetchReports();
    setActiveTab("reportsList");
  };

  const handleCaseStoryAdded = () => {
    setCaseStoriesRefreshKey(prev => prev + 1);
    fetchCaseStories();
    setActiveTab("caseStoriesList");
    setEditingCaseStory(null);
  };

  const handleEditCaseStory = (story: any) => {
    setEditingCaseStory(story);
    setActiveTab("addCaseStory");
  };

  const handleUpdateCaseStory = async (id: number, data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/case-stories/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      handleCaseStoryAdded();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating case story');
    }
  };

  const handleProjectAdded = () => {
    setProjectRefreshKey(prev => prev + 1);
    setActiveTab("projectList");
  };

  const handleBoardDirectorAdded = () => {
    setBoardDirectorRefreshKey(prev => prev + 1);
    setActiveTab("boardDirectorList");
    setEditingBoardDirector(null);
  };

  const handleEditBoardDirector = (director: any) => {
    setEditingBoardDirector(director);
    setActiveTab("addBoardDirector");
  };

  const handleUpdateBoardDirector = async (id: number, data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/board-directors/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      handleBoardDirectorAdded();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating board director');
    }
  };

  const handleManagementTeamAdded = () => {
    setManagementTeamRefreshKey(prev => prev + 1);
    setActiveTab("managementTeamList");
  };

  const handleEditBoardMember = (member: any) => {
    setEditingBoardMember(member);
    setActiveTab("addBoardMember");
  };

  const handleUpdateBoardMember = async (id: number, data: FormData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/board-members/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      handleBoardMemberAdded();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error updating board member');
    }
  };

  const handleBoardMemberAdded = () => {
    setBoardMemberRefreshKey(prev => prev + 1);
    setActiveTab("boardMemberList");
    setEditingBoardMember(null);
  };

  const handleDeleteNews = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    setDeletingNewsId(id);
    try {
      await deleteNews(id, token!);
      fetchNews();
    } catch {
      alert("Failed to delete news.");
    } finally {
      setDeletingNewsId(null);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    setDeletingStaffId(id);
    try {
      await axios.delete(`http://localhost:5000/api/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStaff();
    } catch {
      alert("Failed to delete staff member.");
    } finally {
      setDeletingStaffId(null);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setDeletingAdminId(id);
    try {
      await deleteAdmin(id, token!);
      fetchAdmins();
      alert("Admin deleted successfully.");
    } catch {
      alert("Failed to delete admin.");
    } finally {
      setDeletingAdminId(null);
    }
  };

  // Alumni handlers
  const handleAlumniAdded = () => {
    setAlumniRefreshKey(prev => prev + 1);
    setActiveTab("alumniList");
    setShowAlumniForm(false);
    setEditingAlumni(null);
  };

  const handleEditAlumni = (alumni: any) => {
    console.log('Edit alumni clicked:', alumni);
    setEditingAlumni(alumni);
    setShowAlumniForm(true);
  };

  const handleDeleteAlumni = async (id: number) => {
    console.log('Delete alumni clicked:', id);
    if (!window.confirm("Are you sure you want to delete this alumni profile?")) return;
    
    try {
      console.log('Sending delete request for alumni:', id);
      const response = await fetch(`http://localhost:5000/api/alumni/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Delete response:', response.status);
      if (response.ok) {
        setAlumniRefreshKey(prev => prev + 1);
        alert("Alumni profile deleted successfully.");
      } else {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        alert("Failed to delete alumni profile.");
      }
    } catch (error) {
      console.error('Error deleting alumni:', error);
      alert("Failed to delete alumni profile.");
    }
  };

  const handleApproveAlumni = async (id: number) => {
    console.log('Approve alumni clicked:', id);
    try {
      const response = await fetch(`http://localhost:5000/api/alumni/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Approve response:', response.status);
      if (response.ok) {
        fetchAlumni();
        alert("Alumni profile approved successfully.");
      } else {
        const errorText = await response.text();
        console.error('Approve failed:', errorText);
        alert("Failed to approve alumni profile.");
      }
    } catch (error) {
      console.error('Error approving alumni:', error);
      alert("Failed to approve alumni profile.");
    }
  };

  const handleAlumniFormSubmit = async (formData: FormData) => {
    setAlumniFormLoading(true);
    try {
      const url = editingAlumni 
        ? `http://localhost:5000/api/alumni/${editingAlumni.id}`
        : 'http://localhost:5000/api/alumni';
      
      const method = editingAlumni ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        handleAlumniAdded();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save alumni profile.");
      }
    } catch (error) {
      console.error('Error saving alumni:', error);
      alert("Failed to save alumni profile. Error: " + error.message);
    } finally {
      setAlumniFormLoading(false);
    }
  };

  const startEditNews = (news: NewsArticle) => setEditingNews(news);

  const saveEditNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingNews) return;

    const formData = new FormData(e.currentTarget);
    try {
      await updateNews(
        editingNews.id,
        {
          title: formData.get("title") as string,
          type: formData.get("type") as string,
          content: formData.get("content") as string,
        },
        token!
      );
      fetchNews();
      setEditingNews(null);
      alert("News updated successfully.");
    } catch {
      alert("Failed to update news.");
    }
  };

  const startEditStaff = (staff: StaffMember) => setEditingStaff(staff);

  const saveEditStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStaff) return;

    const formData = new FormData(e.currentTarget);
    try {
      await axios.put(
        `http://localhost:5000/api/staff/${editingStaff.id}`,
        {
          name: formData.get("name") as string,
          role: formData.get("role") as string,
          department: formData.get("department") as string,
          location: formData.get("location") as string,
          email: formData.get("contact") as string,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStaff();
      setEditingStaff(null);
      alert("Staff updated successfully.");
    } catch {
      alert("Failed to update staff.");
    }
  };

  // Template helper functions
  const filteredNews = newsList.filter(
    (news) =>
      (news.title && news.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (news.content && news.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStaff = staffList.filter(
    (staff) =>
      (staff.name && staff.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.role && staff.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const navigationItems = [
    { key: "newsList", label: "News Feed", icon: FileText },
    { key: "addNews", label: "Add News", icon: Plus },
    { key: "reportsList", label: "Reports", icon: FileText },
    { key: "addReport", label: "Add Report", icon: Plus },
    { key: "caseStoriesList", label: "Case Stories", icon: FileText },
    { key: "addCaseStory", label: "Add Story", icon: Plus },
    { key: "staffList", label: "Staff Directory", icon: Users },
    { key: "addStaff", label: "Add Staff", icon: Plus },
    { key: "galleryList", label: "Gallery Items", icon: Image },
    { key: "addGallery", label: "Add Gallery", icon: Plus },
    { key: "alumniList", label: "Alumni Directory", icon: GraduationCap },
    { key: "addAlumni", label: "Add Alumni", icon: Plus },
    { key: "projectList", label: "Project Directory", icon: FolderOpen },
    { key: "addProject", label: "Add Project", icon: Plus },
    { key: "boardDirectorList", label: "Board Directors", icon: UserCheck },
    { key: "addBoardDirector", label: "Add Board Director", icon: Plus },
    { key: "boardMemberList", label: "Board Members", icon: UserCheck },
    { key: "addBoardMember", label: "Add Board Member", icon: Plus },
    { key: "managementTeamList", label: "Management Team", icon: UserCheck },
    { key: "addManagementTeam", label: "Add Team Member", icon: Plus },
    { key: "adminList", label: "Admin Users", icon: Shield },
    { key: "addAdmin", label: "Add Admin", icon: UserCog },
    { key: "statistics", label: "Statistics", icon: BarChart3 },
  ];

  const getTabTitle = () => {
    switch (activeTab) {
      case "addNews": return "Create News Article";
      case "newsList": return "News Management";
      case "addReport": return "Upload Report";
      case "reportsList": return "Reports Management";
      case "addCaseStory": return "Create Case Story";
      case "caseStoriesList": return "Case Stories Management";
      case "addStaff": return "Add Staff Member";
      case "staffList": return "Staff Directory";
      case "addGallery": return "Add Gallery Item";
      case "galleryList": return "Gallery Management";
      case "addAlumni": return "Add Alumni Profile";
      case "alumniList": return "Alumni Management";
      case "addProject": return "Create Project";
      case "projectList": return "Project Management";
      case "addBoardDirector": return "Add Board Director";
      case "boardDirectorList": return "Board Directors Management";
      case "addBoardMember": return "Add Board Member";
      case "boardMemberList": return "Board Members Management";
      case "addManagementTeam": return "Add Management Team Member";
      case "managementTeamList": return "Management Team";
      case "addAdmin": return "Create Admin User";
      case "adminList": return "Admin Management";
      default: return "Dashboard";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "addNews": return "Share important updates and announcements with your team";
      case "newsList": return "Manage your news articles and company announcements";
      case "addReport": return "Upload annual reports, project reports, and strategic plans";
      case "reportsList": return "Manage organizational reports and documents";
      case "addCaseStory": return "Create impactful stories showcasing community transformation";
      case "caseStoriesList": return "Manage case stories and impact narratives";
      case "addStaff": return "Add new team members to the company directory";
      case "staffList": return "View and manage staff information and contacts";
      case "addGallery": return "Add new photos and videos to the gallery";
      case "galleryList": return "Manage gallery items and organize media content";
      case "addAlumni": return "Create profiles for former beneficiaries and showcase success stories";
      case "alumniList": return "Manage alumni profiles and approve consent for public display";
      case "addProject": return "Create new projects with details, timeline, and budget information";
      case "projectList": return "Manage ongoing and completed projects, track impact and beneficiaries";
      case "addBoardDirector": return "Add new members to the board of directors with their roles and expertise";
      case "boardDirectorList": return "Manage board of directors members, their profiles and contact information";
      case "addBoardMember": return "Add new members to the board with their roles and expertise";
      case "boardMemberList": return "Manage board members, their profiles and contact information";
      case "addManagementTeam": return "Add new members to the management team with department and role details";
      case "managementTeamList": return "Manage organizational leadership and staff members across all departments";
      case "addAdmin": return "Create new administrator accounts with full system access";
      case "adminList": return "Manage administrator accounts and permissions";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-secondary" />
              </div>
              <span className="font-semibold">Admin Portal</span>
            </div>
          </div>
          {(activeTab === "newsList" || activeTab === "staffList" || activeTab === "adminList") && (
            <div className="relative w-40">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 h-9 input w-full"
              />
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <nav className="hidden md:block w-80 bg-gradient-brand shadow-2xl fixed h-full z-20 border-r border-blue-800/20">
        <div className="h-full flex flex-col">
        <div className="p-6 flex-shrink-0">
          {/* Logo/Header */}
          <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/20">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-accent-glow">
              <FileText className="w-7 h-7 text-secondary" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Admin Portal
              </h1>
              <p className="text-blue-100 text-sm font-medium">
                Management Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          <div className="space-y-1">
            {navigationItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                className={`w-full justify-start h-12 flex items-center px-3 rounded-lg transition-all duration-200 text-sm ${
                  activeTab === key
                    ? "bg-gradient-accent text-secondary font-bold shadow-lg"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => {
                  setActiveTab(key as Tab);
                  if (key === "staffList") {
                    setEditingStaff(null);
                  }
                  if (key === "newsList") {
                    setEditingNews(null);
                  }
                  if (key === "adminList") {
                    // Reset any admin-related states if needed
                  }
                }}
              >
                <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Card - Fixed position at bottom */}
        <div className="flex-shrink-0 p-6 pt-0">
          <div className="bg-white/10 border border-white/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="w-4 h-4 text-accent" />
              <span className="text-white font-semibold text-sm">Quick Stats</span>
            </div>
            <div className="text-white space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">News Articles:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {newsList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Staff Members:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {staffList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Gallery Items:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {galleryList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Reports:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {reportsList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Case Stories:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {caseStoriesList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Alumni:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {alumniList.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Projects:</span>
                <span className="bg-accent text-secondary px-2 py-1 rounded text-xs font-bold">
                  {projectsList.length}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </nav>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative h-full w-72 bg-gradient-brand shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center shadow-accent-glow">
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-white font-bold">Admin Portal</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`w-full justify-start h-12 flex items-center px-4 rounded-lg transition-all duration-200 ${
                    activeTab === key
                      ? "bg-gradient-accent text-secondary font-bold shadow-lg"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => {
                    setActiveTab(key as Tab);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {label}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full md:flex-1 md:ml-80 px-2 py-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
                {getTabTitle()}
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                {getTabDescription()}
              </p>
            </div>

            {(activeTab === "newsList" || activeTab === "staffList" || activeTab === "adminList") && (
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 w-full sm:w-80 h-12 input"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="card shadow-xl border border-gray-200/50 p-6 md:p-8 bg-white/80 backdrop-blur-sm">
          {activeTab === "addNews" && (
            <NewsAdminForm onNewsAdded={handleNewsAdded} />
          )}

          {activeTab === "newsList" && (
            <>
              {editingNews ? (
                <div className="card border-accent/50 bg-accent-glow/10">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center text-foreground">
                        <Edit3 className="w-6 h-6 mr-3 text-accent" />
                        <h3 className="text-xl font-bold">Edit Article</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <form onSubmit={saveEditNews} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-foreground">Title</label>
                            <input
                              name="title"
                              defaultValue={editingNews.title}
                              required
                              className="input h-12"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-foreground">Type</label>
                            <select name="type" defaultValue={editingNews.type} required className="input h-12">
                              <option value="Announcement">Announcement</option>
                              <option value="Update">Update</option>
                              <option value="Reminder">Reminder</option>
                              <option value="News">News</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-foreground">Content</label>
                          <textarea
                            name="content"
                            defaultValue={editingNews.content}
                            required
                            rows={6}
                            className="input min-h-[120px]"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button type="submit" className="btn-primary flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="btn-secondary flex items-center"
                            onClick={() => setEditingNews(null)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
                    <p className="text-muted-foreground text-xl mb-6">
                      No news articles found
                    </p>
                    <button
                      onClick={() => setActiveTab("addNews")}
                      className="btn-primary"
                    >
                      Create First Article
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredNews.map((news) => (
                      <div
                        key={news.id}
                        className="card hover:shadow-xl transition-all duration-300 border-muted hover:border-primary/40 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50/50"
                      >
                        <div className="p-8">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-4">
                                <h3 className="text-2xl font-bold text-foreground">
                                  {news.title}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  news.type === "Announcement" ? "bg-primary/20 text-primary" :
                                  news.type === "Update" ? "bg-accent/20 text-accent" :
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {news.type}
                                </span>
                              </div>
                              <p className="text-muted-foreground mb-4 leading-relaxed text-lg">
                                {news.content}
                              </p>
                            </div>
                            <div className="flex space-x-3 sm:ml-6">
                              <button
                                onClick={() => startEditNews(news)}
                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                disabled={deletingNewsId === news.id}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteNews(news.id)}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                disabled={deletingNewsId === news.id}
                              >
                                {deletingNewsId === news.id ? (
                                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "addStaff" && (
              <StaffAdminForm onStaffAdded={handleStaffAdded} />
            )}

            {activeTab === "addGallery" && (
              <GalleryManagement onGalleryAdded={handleGalleryAdded} gallery={editingGalleryItem} onGalleryUpdated={handleUpdateGalleryItem} />
            )}

            {activeTab === "galleryList" && (
              <GalleryList refresh={galleryRefreshKey} onEdit={handleEditGalleryItem} />
            )}

            {activeTab === "addReport" && (
              <ReportsManagement onReportAdded={handleReportAdded} />
            )}

            {activeTab === "reportsList" && (
              <ReportsList refreshTrigger={reportsRefreshKey} />
            )}

            {activeTab === "addCaseStory" && (
              <CaseStoriesManagement onStoryAdded={handleCaseStoryAdded} story={editingCaseStory} onStoryUpdated={handleUpdateCaseStory} />
            )}

            {activeTab === "caseStoriesList" && (
              <CaseStoriesList refreshTrigger={caseStoriesRefreshKey} onEdit={handleEditCaseStory} />
            )}

            {activeTab === "addAlumni" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Add Alumni Profile</h3>
                  <p className="text-blue-700">Create a new alumni profile to showcase success stories and achievements.</p>
                </div>
                <button
                  onClick={() => setShowAlumniForm(true)}
                  className="btn-primary flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alumni Profile
                </button>
              </div>
            )}

            {activeTab === "alumniList" && (
              <div>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">Debug Info:</p>
                  <p className="text-sm text-blue-600">Alumni List Length: {alumniList.length}</p>
                  <p className="text-sm text-blue-600">Token: {token ? 'Present' : 'Missing'}</p>
                  <p className="text-sm text-blue-600">Refresh Key: {alumniRefreshKey}</p>
                </div>
                <AlumniList
                  onEdit={handleEditAlumni}
                  onDelete={handleDeleteAlumni}
                  onApprove={handleApproveAlumni}
                  refreshTrigger={alumniRefreshKey}
                />
              </div>
            )}

            {activeTab === "addAdmin" && (
              <AdminManagement onAdminAdded={handleAdminAdded} />
            )}

            {activeTab === "addProject" && (
              <ProjectForm onProjectAdded={handleProjectAdded} />
            )}

            {activeTab === "projectList" && (
              <ProjectList key={projectRefreshKey} />
            )}

            {activeTab === "addBoardDirector" && (
              <BoardDirectorForm onDirectorAdded={handleBoardDirectorAdded} director={editingBoardDirector} onDirectorUpdated={handleUpdateBoardDirector} />
            )}

            {activeTab === "boardDirectorList" && (
              <BoardDirectorList key={boardDirectorRefreshKey} refreshTrigger={boardDirectorRefreshKey} onEdit={handleEditBoardDirector} />
            )}

            {activeTab === "addBoardMember" && (
              <BoardMemberForm onMemberAdded={handleBoardMemberAdded} member={editingBoardMember} onMemberUpdated={handleUpdateBoardMember} />
            )}

            {activeTab === "boardMemberList" && (
              <BoardMemberList key={boardMemberRefreshKey} refreshTrigger={boardMemberRefreshKey} onEdit={handleEditBoardMember} />
            )}

            {activeTab === "addManagementTeam" && (
              <ManagementTeamForm onMemberAdded={handleManagementTeamAdded} />
            )}

            {activeTab === "managementTeamList" && (
              <ManagementTeamList key={managementTeamRefreshKey} />
            )}

            {activeTab === "statistics" && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Statistics Management</h3>
                  <p className="text-blue-700">Manage the statistics displayed on the website. Add, edit, or remove statistics as needed.</p>
                </div>
                <StatsManagement refreshTrigger={0} />
              </div>
            )}

            {activeTab === "adminList" && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">Debug Info:</p>
                  <p className="text-sm text-blue-600">Admin List Length: {adminList.length}</p>
                  <p className="text-sm text-blue-600">Token: {token ? 'Present' : 'Missing'}</p>
                  <button 
                    onClick={fetchAdmins}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Refresh Admins
                  </button>
                </div>
                {adminList.length === 0 ? (
                  <div className="text-center py-16">
                    <Shield className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
                    <p className="text-muted-foreground text-xl mb-6">
                      No admin users found
                    </p>
                    <button
                      onClick={() => setActiveTab("addAdmin")}
                      className="btn-primary"
                    >
                      Add First Admin
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminList.map((admin) => (
                      <div
                        key={admin.id}
                        className="card hover:shadow-xl transition-all duration-300 border-muted hover:border-accent/40 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30"
                      >
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-glow ring-2 ring-primary/20 ring-offset-2">
                              {admin.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="p-2 text-destructive hover:bg-destructive/15 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md"
                                disabled={deletingAdminId === admin.id}
                              >
                                {deletingAdminId === admin.id ? (
                                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-3">
                            {admin.name || 'Unknown Admin'}
                          </h3>
                          <p className="text-primary font-bold text-lg mb-2">
                            {admin.role || 'admin'}
                          </p>
                          <p className="text-muted-foreground mb-3">{admin.email || 'No email'}</p>
                          <p className="text-muted-foreground text-sm">
                            Created: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "staffList" && (
              <>
                {editingStaff ? (
                  <div className="card border-accent/50 bg-accent-glow/10">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center text-foreground">
                        <Edit3 className="w-6 h-6 mr-3 text-accent" />
                        <h3 className="text-xl font-bold">Edit Staff Member</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <form onSubmit={saveEditStaff} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-foreground">Name</label>
                            <input
                              name="name"
                              defaultValue={editingStaff.name}
                              required
                              className="input h-12"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-foreground">Role</label>
                            <input
                              name="role"
                              defaultValue={editingStaff.role}
                              required
                              className="input h-12"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-foreground">Department</label>
                            <input
                              name="department"
                              defaultValue={editingStaff.department}
                              required
                              className="input h-12"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-sm font-bold text-foreground">Location</label>
                            <input
                              name="location"
                              defaultValue={editingStaff.location}
                              required
                              className="input h-12"
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-foreground">Contact</label>
                          <input
                            name="contact"
                            defaultValue={editingStaff.contact}
                            required
                            className="input h-12"
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button type="submit" className="btn-primary flex items-center">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="btn-secondary flex items-center"
                            onClick={() => setEditingStaff(null)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : filteredStaff.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-20 h-20 text-muted-foreground/50 mx-auto mb-6" />
                    <p className="text-muted-foreground text-xl mb-6">
                      No staff members found
                    </p>
                    <button
                      onClick={() => setActiveTab("addStaff")}
                      className="btn-primary"
                    >
                      Add First Staff Member
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className="card hover:shadow-xl transition-all duration-300 border-muted hover:border-accent/40 hover:scale-[1.02] bg-gradient-to-br from-white to-blue-50/30"
                      >
                        <div className="p-8">
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-glow ring-2 ring-primary/20 ring-offset-2">
                              {staff.name.charAt(0)}
                            </div>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => startEditStaff(staff)}
                                className="p-2 text-primary hover:bg-primary/15 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md"
                                disabled={deletingStaffId === staff.id}
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStaff(staff.id)}
                                className="p-2 text-destructive hover:bg-destructive/15 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-md"
                                disabled={deletingStaffId === staff.id}
                              >
                                {deletingStaffId === staff.id ? (
                                  <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-3">
                            {staff.name}
                          </h3>
                          <p className="text-primary font-bold text-lg mb-2">
                            {staff.role}
                          </p>
                          <p className="text-muted-foreground font-semibold mb-2">
                            {staff.department}
                          </p>
                          <p className="text-muted-foreground mb-3">{staff.location}</p>
                          <p className="text-foreground font-medium">
                            {staff.contact}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
        </div>
      </main>

      {/* Alumni Form Modal */}
      {showAlumniForm && (
        <AlumniForm
          alumni={editingAlumni}
          onSubmit={handleAlumniFormSubmit}
          onClose={() => {
            setShowAlumniForm(false);
            setEditingAlumni(null);
          }}
          isLoading={alumniFormLoading}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
