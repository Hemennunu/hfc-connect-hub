const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test configuration
const testConfig = {
  adminCredentials: {
    email: 'admin@hfc.org',
    password: 'admin123'
  }
};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Authorization': authToken ? `Bearer ${authToken}` : '',
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
};

// Test functions
const testAuth = async () => {
  console.log('\n🔐 Testing Authentication...');
  
  const loginResult = await makeRequest('POST', '/auth/login', testConfig.adminCredentials);
  
  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    console.log('✅ Admin login successful');
    return true;
  } else {
    console.log('❌ Admin login failed:', loginResult.error);
    return false;
  }
};

const testReports = async () => {
  console.log('\n📊 Testing Reports...');
  
  // Test GET all reports
  const getResult = await makeRequest('GET', '/reports');
  console.log(getResult.success ? '✅ GET reports successful' : '❌ GET reports failed:', getResult.error);
  
  // Test POST new report
  const newReport = {
    title: 'Test Annual Report 2024',
    type: 'annual',
    description: 'Test report for migration verification',
    year: 2024,
    featured: true
  };
  
  const postResult = await makeRequest('POST', '/reports', newReport);
  console.log(postResult.success ? '✅ POST report successful' : '❌ POST report failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testCaseStories = async () => {
  console.log('\n📖 Testing Case Stories...');
  
  // Test GET all case stories
  const getResult = await makeRequest('GET', '/case-stories');
  console.log(getResult.success ? '✅ GET case stories successful' : '❌ GET case stories failed:', getResult.error);
  
  // Test POST new case story
  const newStory = {
    title: 'Test Success Story',
    content: 'This is a test case story for migration verification.',
    summary: 'Test story summary',
    category: 'education',
    status: 'published',
    featured: true
  };
  
  const postResult = await makeRequest('POST', '/case-stories', newStory);
  console.log(postResult.success ? '✅ POST case story successful' : '❌ POST case story failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testStaff = async () => {
  console.log('\n👥 Testing Staff...');
  
  // Test GET all staff
  const getResult = await makeRequest('GET', '/staff');
  console.log(getResult.success ? '✅ GET staff successful' : '❌ GET staff failed:', getResult.error);
  
  // Test POST new staff member
  const newStaff = {
    name: 'Test Staff Member',
    position: 'Test Position',
    email: 'test@hfc.org',
    phone: '+1234567890',
    department: 'IT',
    isActive: true
  };
  
  const postResult = await makeRequest('POST', '/staff', newStaff);
  console.log(postResult.success ? '✅ POST staff successful' : '❌ POST staff failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testGallery = async () => {
  console.log('\n🖼️ Testing Gallery...');
  
  // Test GET all gallery items
  const getResult = await makeRequest('GET', '/gallery');
  console.log(getResult.success ? '✅ GET gallery successful' : '❌ GET gallery failed:', getResult.error);
  
  // Test POST new gallery item
  const newGalleryItem = {
    title: 'Test Gallery Item',
    description: 'Test gallery item for migration verification',
    category: 'events',
    status: 'published',
    featured: true
  };
  
  const postResult = await makeRequest('POST', '/gallery', newGalleryItem);
  console.log(postResult.success ? '✅ POST gallery item successful' : '❌ POST gallery item failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testAlumni = async () => {
  console.log('\n🎓 Testing Alumni...');
  
  // Test GET all alumni
  const getResult = await makeRequest('GET', '/alumni');
  console.log(getResult.success ? '✅ GET alumni successful' : '❌ GET alumni failed:', getResult.error);
  
  // Test POST new alumni
  const newAlumni = {
    name: 'Test Alumni',
    email: 'alumni@test.com',
    graduationYear: 2020,
    program: 'Computer Science',
    currentPosition: 'Software Developer',
    company: 'Tech Corp',
    consentGiven: true,
    isPublic: true
  };
  
  const postResult = await makeRequest('POST', '/alumni', newAlumni);
  console.log(postResult.success ? '✅ POST alumni successful' : '❌ POST alumni failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testProjects = async () => {
  console.log('\n🚀 Testing Projects...');
  
  // Test GET all projects
  const getResult = await makeRequest('GET', '/projects');
  console.log(getResult.success ? '✅ GET projects successful' : '❌ GET projects failed:', getResult.error);
  
  // Test POST new project
  const newProject = {
    title: 'Test Project',
    description: 'Test project for migration verification',
    category: 'education',
    status: 'active',
    priority: 'high',
    budget: 10000.00,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    featured: true
  };
  
  const postResult = await makeRequest('POST', '/projects', newProject);
  console.log(postResult.success ? '✅ POST project successful' : '❌ POST project failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testBoardMembers = async () => {
  console.log('\n👔 Testing Board Members...');
  
  // Test GET all board members
  const getResult = await makeRequest('GET', '/board-members');
  console.log(getResult.success ? '✅ GET board members successful' : '❌ GET board members failed:', getResult.error);
  
  // Test POST new board member
  const newBoardMember = {
    name: 'Test Board Member',
    position: 'Board Chair',
    bio: 'Test bio for board member',
    email: 'board@test.com',
    phone: '+1234567890',
    isActive: true,
    order: 1
  };
  
  const postResult = await makeRequest('POST', '/board-members', newBoardMember);
  console.log(postResult.success ? '✅ POST board member successful' : '❌ POST board member failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testPartners = async () => {
  console.log('\n🤝 Testing Partners...');
  
  // Test GET all partners
  const getResult = await makeRequest('GET', '/partners');
  console.log(getResult.success ? '✅ GET partners successful' : '❌ GET partners failed:', getResult.error);
  
  // Test POST new partner
  const newPartner = {
    name: 'Test Partner Organization',
    website: 'https://testpartner.com',
    description: 'Test partner for migration verification',
    partnershipType: 'funding',
    contactPerson: 'John Doe',
    contactEmail: 'contact@testpartner.com',
    isActive: true,
    order: 1
  };
  
  const postResult = await makeRequest('POST', '/partners', newPartner);
  console.log(postResult.success ? '✅ POST partner successful' : '❌ POST partner failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testDonations = async () => {
  console.log('\n💰 Testing Donations...');
  
  // Test GET all donations (admin only)
  const getResult = await makeRequest('GET', '/donations');
  console.log(getResult.success ? '✅ GET donations successful' : '❌ GET donations failed:', getResult.error);
  
  // Test POST new donation (public route)
  const newDonation = {
    donorName: 'Test Donor',
    email: 'donor@test.com',
    amount: 100.00,
    message: 'Test donation for migration verification',
    isAnonymous: false
  };
  
  // Remove auth token for public donation
  const tempToken = authToken;
  authToken = '';
  const postResult = await makeRequest('POST', '/donations', newDonation);
  authToken = tempToken;
  
  console.log(postResult.success ? '✅ POST donation successful' : '❌ POST donation failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testFounders = async () => {
  console.log('\n👨‍💼 Testing Founders...');
  
  // Test GET all founders
  const getResult = await makeRequest('GET', '/founders');
  console.log(getResult.success ? '✅ GET founders successful' : '❌ GET founders failed:', getResult.error);
  
  // Test POST new founder
  const newFounder = {
    name: 'Test Founder',
    bio: 'Test founder bio for migration verification',
    position: 'Founder & CEO',
    achievements: '["Achievement 1", "Achievement 2"]',
    socialLinks: '{"linkedin": "https://linkedin.com/testfounder", "twitter": "https://twitter.com/testfounder"}',
    isActive: true
  };
  
  const postResult = await makeRequest('POST', '/founders', newFounder);
  console.log(postResult.success ? '✅ POST founder successful' : '❌ POST founder failed:', postResult.error);
  
  return postResult.success ? postResult.data.id : null;
};

const testOrgProfile = async () => {
  console.log('\n🏢 Testing Organizational Profile...');
  
  // Test GET organizational profile
  const getResult = await makeRequest('GET', '/org-profile');
  console.log(getResult.success ? '✅ GET org profile successful' : '❌ GET org profile failed:', getResult.error);
  
  // Test GET mission vision
  const getMissionResult = await makeRequest('GET', '/org-profile/mission-vision');
  console.log(getMissionResult.success ? '✅ GET mission vision successful' : '❌ GET mission vision failed:', getMissionResult.error);
  
  // Test GET thematic areas
  const getThematicResult = await makeRequest('GET', '/org-profile/thematic-areas');
  console.log(getThematicResult.success ? '✅ GET thematic areas successful' : '❌ GET thematic areas failed:', getThematicResult.error);
  
  return true;
};

// Main test runner
const runMigrationTests = async () => {
  console.log('🚀 Starting TypeORM Migration Tests...');
  console.log('=====================================');
  
  // Test authentication first
  const authSuccess = await testAuth();
  if (!authSuccess) {
    console.log('\n❌ Authentication failed. Cannot proceed with protected route tests.');
    return;
  }
  
  // Run all tests
  const testResults = {
    reports: await testReports(),
    caseStories: await testCaseStories(),
    staff: await testStaff(),
    gallery: await testGallery(),
    alumni: await testAlumni(),
    projects: await testProjects(),
    boardMembers: await testBoardMembers(),
    partners: await testPartners(),
    donations: await testDonations(),
    founders: await testFounders(),
    orgProfile: await testOrgProfile()
  };
  
  console.log('\n📋 Test Summary:');
  console.log('================');
  Object.entries(testResults).forEach(([test, result]) => {
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASSED' : 'FAILED'}`);
  });
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  console.log(`\n🎯 Overall Result: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All migration tests passed! TypeORM backend is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.');
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runMigrationTests().catch(console.error);
}

module.exports = { runMigrationTests };
