// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Authentication
export const login = (data: { email: string; password: string }) => api.post('/auth/signin', data);

// Generic API functions with auth headers
const withAuth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

// Alumni APIs
export const getAlumni = (token: string) => api.get('/alumni/all', withAuth(token));
export const createAlumni = (data: unknown, token: string) => api.post('/alumni', data, withAuth(token));
export const updateAlumni = (id: number, data: unknown, token: string) => api.put(`/alumni/${id}`, data, withAuth(token));
export const deleteAlumni = (id: number, token: string) => api.delete(`/alumni/${id}`, withAuth(token));

// Board Directors APIs
export const getBoardDirectors = (token: string) => api.get('/board-directors/all', withAuth(token));
export const createBoardDirector = (data: unknown, token: string) => api.post('/board-directors', data, withAuth(token));
export const updateBoardDirector = (id: number, data: unknown, token: string) => api.put(`/board-directors/${id}`, data, withAuth(token));
export const deleteBoardDirector = (id: number, token: string) => api.delete(`/board-directors/${id}`, withAuth(token));

// Board Members APIs
export const getBoardMembers = (token: string) => api.get('/board-members/all', withAuth(token));
export const createBoardMember = (data: unknown, token: string) => api.post('/board-members', data, withAuth(token));
export const updateBoardMember = (id: number, data: unknown, token: string) => api.put(`/board-members/${id}`, data, withAuth(token));
export const deleteBoardMember = (id: number, token: string) => api.delete(`/board-members/${id}`, withAuth(token));

// Case Stories APIs
export const getCaseStories = (token: string) => api.get('/case-stories?status=all', withAuth(token));
export const createCaseStory = (data: FormData, token: string) => api.post('/case-stories', data, withAuth(token));
export const updateCaseStory = (id: number, data: FormData, token: string) => api.put(`/case-stories/${id}`, data, withAuth(token));
export const deleteCaseStory = (id: number, token: string) => api.delete(`/case-stories/${id}`, withAuth(token));

// Contact APIs
export const getContact = (token: string) => api.get('/contact', withAuth(token));
export const updateContact = (id: number, data: unknown, token: string) => api.put(`/contact/${id}`, data, withAuth(token));

// Donations APIs
export const getDonations = (token: string) => api.get('/donations', withAuth(token));
export const createDonation = (data: unknown, token: string) => api.post('/donations', data, withAuth(token));
export const updateDonation = (id: number, data: unknown, token: string) => api.put(`/donations/${id}`, data, withAuth(token));
export const deleteDonation = (id: number, token: string) => api.delete(`/donations/${id}`, withAuth(token));

// Founders APIs
export const getFounders = () => api.get('/founders');
export const createFounder = (founder: unknown, token: string) => api.post('/founders', founder, withAuth(token));
export const updateFounder = (id: number, founder: unknown, token: string) => api.put(`/founders/${id}`, founder, withAuth(token));
export const deleteFounder = (id: number, token: string) => api.delete(`/founders/${id}`, withAuth(token));

// Gallery APIs
export const getGallery = (token: string) => api.get('/gallery/all', withAuth(token));
export const createGalleryItem = (data: FormData, token: string) => api.post('/gallery', data, withAuth(token));
export const updateGalleryItem = (id: number, data: FormData, token: string) => api.put(`/gallery/${id}`, data, withAuth(token));
export const deleteGalleryItem = (id: number, token: string) => api.delete(`/gallery/${id}`, withAuth(token));

// Management Team APIs
export const getManagementTeam = (token: string) => api.get('/management-team', withAuth(token));
export const createManagementTeam = (data: unknown, token: string) => api.post('/management-team', data, withAuth(token));
export const updateManagementTeam = (id: number, data: unknown, token: string) => api.put(`/management-team/${id}`, data, withAuth(token));
export const deleteManagementTeam = (id: number, token: string) => api.delete(`/management-team/${id}`, withAuth(token));

// Mission Vision APIs
export const getMissionVision = () => api.get('/mission-vision');
export const createMissionVision = (data: unknown, token: string) => api.post('/mission-vision', data, withAuth(token));
export const updateMissionVision = (id: number, data: unknown, token: string) => api.put(`/mission-vision/${id}`, data, withAuth(token));
export const deleteMissionVision = (id: number, token: string) => api.delete(`/mission-vision/${id}`, withAuth(token));

// News APIs
export const getNews = (token: string) => api.get('/news', withAuth(token));
export const createNews = (news: unknown, token: string) => api.post('/news', news, withAuth(token));
export const updateNews = (id: number, news: unknown, token: string) => api.put(`/news/${id}`, news, withAuth(token));
export const deleteNews = (id: number, token: string) => api.delete(`/news/${id}`, withAuth(token));

// Organizational Profile APIs
export const getOrgProfile = () => api.get('/org-profile');
export const createOrgProfile = (data: unknown, token: string) => api.post('/org-profile', data, withAuth(token));
export const updateOrgProfile = (id: number, data: unknown, token: string) => api.put(`/org-profile/${id}`, data, withAuth(token));
export const deleteOrgProfile = (id: number, token: string) => api.delete(`/org-profile/${id}`, withAuth(token));

// Partners APIs
export const getPartners = (token: string) => api.get('/partners', withAuth(token));
export const createPartner = (data: unknown, token: string) => api.post('/partners', data, withAuth(token));
export const updatePartner = (id: number, data: unknown, token: string) => api.put(`/partners/${id}`, data, withAuth(token));
export const deletePartner = (id: number, token: string) => api.delete(`/partners/${id}`, withAuth(token));

// Projects APIs
export const getProjects = (token: string) => api.get('/projects', withAuth(token));
export const createProject = (data: unknown, token: string) => api.post('/projects', data, withAuth(token));
export const updateProject = (id: number, data: unknown, token: string) => api.put(`/projects/${id}`, data, withAuth(token));
export const deleteProject = (id: number, token: string) => api.delete(`/projects/${id}`, withAuth(token));

// Reports APIs
export const getReports = (token: string) => api.get('/reports', withAuth(token));
export const createReport = (data: FormData, token: string) => api.post('/reports', data, withAuth(token));
export const updateReport = (id: number, data: FormData, token: string) => api.put(`/reports/${id}`, data, withAuth(token));
export const deleteReport = (id: number, token: string) => api.delete(`/reports/${id}`, withAuth(token));

// Staff APIs
export const getStaff = (token: string) => api.get('/staff', withAuth(token));
export const createStaff = (staff: unknown, token: string) => api.post('/staff', staff, withAuth(token));
export const updateStaff = (id: number, staff: unknown, token: string) => api.put(`/staff/${id}`, staff, withAuth(token));
export const deleteStaff = (id: number, token: string) => api.delete(`/staff/${id}`, withAuth(token));

// Stats APIs
export const getStats = (token: string) => api.get('/stats', withAuth(token));
export const updateStats = (id: number, data: unknown, token: string) => api.put(`/stats/${id}`, data, withAuth(token));

// Thematic Areas APIs
export const getThematicAreas = () => api.get('/thematic-areas');
export const getAllThematicAreas = (token: string) => api.get('/thematic-areas/all', withAuth(token));
export const createThematicArea = (data: unknown, token: string) => api.post('/thematic-areas', data, withAuth(token));
export const updateThematicArea = (id: number, data: unknown, token: string) => api.put(`/thematic-areas/${id}`, data, withAuth(token));
export const deleteThematicArea = (id: number, token: string) => api.delete(`/thematic-areas/${id}`, withAuth(token));
export const toggleThematicAreaStatus = (id: number, token: string) => api.patch(`/thematic-areas/${id}/toggle-status`, {}, withAuth(token));


// Admin Management APIs
export const getAdmins = (token: string) => api.get('/auth/admins', withAuth(token));
export const createAdmin = (admin: { name: string; email: string; password: string }, token: string) => api.post('/auth/create-admin', admin, withAuth(token));
export const deleteAdmin = (id: number, token: string) => api.delete(`/auth/admin/${id}`, withAuth(token));
