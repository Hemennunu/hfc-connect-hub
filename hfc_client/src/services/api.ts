// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Public APIs (no authentication required)

// Alumni APIs
export const getAlumni = () => api.get('/alumni');
export const getAlumniById = (id: string) => api.get(`/alumni/${id}`);
export const getFeaturedAlumni = () => api.get('/alumni/featured');
export const getAlumniByCategory = (category: string) => api.get(`/alumni/category/${category}`);

// Board Directors APIs
export const getBoardDirectors = () => api.get('/board-directors');
export const getBoardDirectorById = (id: string) => api.get(`/board-directors/${id}`);

// Board Members APIs
export const getBoardMembers = () => api.get('/board-members');
export const getBoardMemberById = (id: string) => api.get(`/board-members/${id}`);

// Case Stories APIs
export const getCaseStories = () => api.get('/case-stories');
export const getCaseStoryById = (id: string) => api.get(`/case-stories/${id}`);
export const getFeaturedCaseStories = () => api.get('/case-stories/featured');
export const getCaseStoriesByCategory = (category: string) => api.get(`/case-stories/category/${category}`);

// Contact APIs
export const getContact = () => api.get('/contact');
export const submitContactForm = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => api.post('/contact/submit', data);

// Donations APIs
export const getDonations = () => api.get('/donations');
export const submitDonation = (data: unknown) => api.post('/donations/submit', data);

// Founders APIs
export const getFounders = () => api.get('/founders');
export const getFounderById = (id: string) => api.get(`/founders/${id}`);

// Gallery APIs
export const getGallery = () => api.get('/gallery');
export const getGalleryById = (id: string) => api.get(`/gallery/${id}`);
export const getFeaturedGallery = () => api.get('/gallery/featured');
export const getGalleryByCategory = (category: string) => api.get(`/gallery/category/${category}`);

// Management Team APIs
export const getManagementTeam = () => api.get('/management-team');
export const getManagementTeamById = (id: string) => api.get(`/management-team/${id}`);

// Mission Vision APIs
export const getMissionVision = () => api.get('/mission-vision');

// News APIs
export const getNews = () => api.get('/news');
export const getNewsById = (id: string) => api.get(`/news/${id}`);
export const getFeaturedNews = () => api.get('/news/featured');
export const getNewsByCategory = (category: string) => api.get(`/news/category/${category}`);

// Organizational Profile APIs
export const getOrgProfile = () => api.get('/org-profile');

// Partners APIs
export const getPartners = () => api.get('/partners');
export const getPartnerById = (id: string) => api.get(`/partners/${id}`);
export const getPartnersByType = (type: string) => api.get(`/partners/type/${type}`);

// Projects APIs
export const getProjects = () => api.get('/projects');
export const getProjectById = (id: string) => api.get(`/projects/${id}`);
export const getFeaturedProjects = () => api.get('/projects/featured');
export const getProjectsByCategory = (category: string) => api.get(`/projects/category/${category}`);
export const getProjectsByStatus = (status: string) => api.get(`/projects?status=${status}`);

// Reports APIs
export const getReports = () => api.get('/reports');
export const getReportById = (id: string) => api.get(`/reports/${id}`);
export const getFeaturedReports = () => api.get('/reports/featured');
export const getReportsByType = (type: string) => api.get(`/reports/type/${type}`);
export const downloadReport = (id: string) => api.get(`/reports/${id}/download`);

// Staff APIs
export const getStaff = () => api.get('/staff');
export const getStaffById = (id: string) => api.get(`/staff/${id}`);

// Stats APIs
export const getStats = () => api.get('/stats');

// Thematic Areas APIs
export const getThematicAreas = () => api.get('/thematic-areas');
export const getThematicAreaById = (id: string) => api.get(`/thematic-areas/${id}`);

// Newsletter subscription
export const subscribeNewsletter = (email: string) => api.post('/newsletter/subscribe', { email });

// Search functionality
export const searchContent = (query: string, type?: string) => {
  const params = new URLSearchParams({ q: query });
  if (type) params.append('type', type);
  return api.get(`/search?${params.toString()}`);
};

export default api;
