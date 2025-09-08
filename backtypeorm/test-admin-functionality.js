const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test admin credentials
const adminCredentials = {
  email: 'hello@gmail.com',
  password: '123456'
};

let authToken = null;

async function testAdminLogin() {
  console.log('🔐 Testing admin login...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, adminCredentials);
    authToken = response.data.token;
    console.log('✅ Admin login successful');
    return true;
  } catch (error) {
    console.log('❌ Admin login failed:', error.response?.data?.msg || error.message);
    return false;
  }
}

async function testNewsOperations() {
  console.log('\n📰 Testing News CRUD operations...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  let newsId = null;
  
  try {
    // Test CREATE
    console.log('Creating news article...');
    const createResponse = await axios.post(`${BASE_URL}/news`, {
      title: 'Test News Article',
      type: 'announcement',
      content: 'This is a test news article content.',
      date: new Date().toISOString()
    }, { headers });
    
    newsId = createResponse.data.id;
    console.log('✅ News created successfully, ID:', newsId);
    
    // Test READ
    console.log('Reading news articles...');
    const readResponse = await axios.get(`${BASE_URL}/news`, { headers });
    console.log('✅ News read successfully, count:', readResponse.data.length);
    
    // Test UPDATE
    console.log('Updating news article...');
    await axios.put(`${BASE_URL}/news/${newsId}`, {
      title: 'Updated Test News Article',
      content: 'This is updated content.'
    }, { headers });
    console.log('✅ News updated successfully');
    
    // Test DELETE
    console.log('Deleting news article...');
    await axios.delete(`${BASE_URL}/news/${newsId}`, { headers });
    console.log('✅ News deleted successfully');
    
    return true;
  } catch (error) {
    console.log('❌ News operations failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testStaffOperations() {
  console.log('\n👥 Testing Staff CRUD operations...');
  
  const headers = { Authorization: `Bearer ${authToken}` };
  let staffId = null;
  
  try {
    // Test CREATE
    console.log('Creating staff member...');
    const createResponse = await axios.post(`${BASE_URL}/staff`, {
      name: 'Test Staff Member',
      role: 'Test Role',
      department: 'Test Department',
      location: 'Test Location',
      contact: 'test@example.com'
    }, { headers });
    
    staffId = createResponse.data.id;
    console.log('✅ Staff created successfully, ID:', staffId);
    
    // Test READ
    console.log('Reading staff members...');
    const readResponse = await axios.get(`${BASE_URL}/staff`);
    console.log('✅ Staff read successfully, count:', readResponse.data.length);
    
    // Test UPDATE
    console.log('Updating staff member...');
    await axios.put(`${BASE_URL}/staff/${staffId}`, {
      name: 'Updated Test Staff Member',
      role: 'Updated Role'
    }, { headers });
    console.log('✅ Staff updated successfully');
    
    // Test DELETE
    console.log('Deleting staff member...');
    await axios.delete(`${BASE_URL}/staff/${staffId}`, { headers });
    console.log('✅ Staff deleted successfully');
    
    return true;
  } catch (error) {
    console.log('❌ Staff operations failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function testOtherRoutes() {
  console.log('\n🔍 Testing other routes...');
  
  const routes = [
    { method: 'GET', path: '/gallery', description: 'Gallery items' },
    { method: 'GET', path: '/reports', description: 'Reports' },
    { method: 'GET', path: '/case-stories', description: 'Case stories' },
    { method: 'GET', path: '/alumni', description: 'Alumni' },
    { method: 'GET', path: '/projects', description: 'Projects' },
    { method: 'GET', path: '/board-directors', description: 'Board directors' },
    { method: 'GET', path: '/management-team', description: 'Management team' },
    { method: 'GET', path: '/stats', description: 'Statistics' },
    { method: 'GET', path: '/stats/active', description: 'Active statistics' }
  ];
  
  let successCount = 0;
  
  for (const route of routes) {
    try {
      const response = await axios.get(`${BASE_URL}${route.path}`);
      console.log(`✅ ${route.description}: ${response.status}`);
      successCount++;
    } catch (error) {
      console.log(`❌ ${route.description}: ${error.response?.status || 'ERROR'}`);
    }
  }
  
  console.log(`\n📊 Route test summary: ${successCount}/${routes.length} routes working`);
  return successCount === routes.length;
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive admin functionality tests...\n');
  
  const results = {
    login: false,
    news: false,
    staff: false,
    routes: false
  };
  
  // Test admin login
  results.login = await testAdminLogin();
  
  if (!results.login) {
    console.log('\n❌ Cannot proceed without admin authentication');
    return results;
  }
  
  // Test CRUD operations
  results.news = await testNewsOperations();
  results.staff = await testStaffOperations();
  results.routes = await testOtherRoutes();
  
  // Summary
  console.log('\n📋 Test Results Summary:');
  console.log('='.repeat(40));
  console.log(`🔐 Admin Login: ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📰 News CRUD: ${results.news ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`👥 Staff CRUD: ${results.staff ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🔍 Other Routes: ${results.routes ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 All backend functionality is working correctly!');
    console.log('✨ The admin portal should now work seamlessly with the backend.');
  } else {
    console.log('\n⚠️  Some functionality needs attention. Check the logs above for details.');
  }
  
  return results;
}

// Run tests
runAllTests().catch(console.error);
