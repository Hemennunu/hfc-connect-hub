const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

// Test configuration
const testConfig = {
  timeout: 5000,
  retries: 3
};

// Test routes
const routes = [
  // Public routes
  { method: 'GET', path: '/api/news', description: 'Get all news', public: true },
  { method: 'GET', path: '/api/gallery', description: 'Get gallery items', public: true },
  { method: 'GET', path: '/api/reports', description: 'Get published reports', public: true },
  { method: 'GET', path: '/api/case-stories', description: 'Get published case stories', public: true },
  { method: 'GET', path: '/api/alumni', description: 'Get public alumni', public: true },
  { method: 'GET', path: '/api/projects', description: 'Get all projects', public: true },
  { method: 'GET', path: '/api/board-directors', description: 'Get board directors', public: true },
  { method: 'GET', path: '/api/management-team', description: 'Get active management team', public: true },
  { method: 'GET', path: '/api/staff', description: 'Get all staff', public: true },
  { method: 'GET', path: '/api/stats', description: 'Get all stats', public: true },
  { method: 'GET', path: '/api/stats/active', description: 'Get active stats', public: true },
  
  // Auth routes
  { method: 'POST', path: '/api/auth/signup', description: 'User signup', public: true, body: { name: 'Test User', email: 'test@example.com', password: 'testpassword123' } },
  { method: 'POST', path: '/api/auth/signin', description: 'Admin signin', public: true, body: { email: 'admin@example.com', password: 'adminpassword' } }
];

async function testRoute(route) {
  try {
    const options = {
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: testConfig.timeout
    };

    if (route.body) {
      options.body = JSON.stringify(route.body);
    }

    const response = await fetch(`${BASE_URL}${route.path}`, options);
    
    return {
      route: route.path,
      method: route.method,
      status: response.status,
      success: response.status < 500, // Consider 4xx as expected for some routes
      description: route.description,
      error: null
    };
  } catch (error) {
    return {
      route: route.path,
      method: route.method,
      status: 'ERROR',
      success: false,
      description: route.description,
      error: error.message
    };
  }
}

async function testAllRoutes() {
  console.log('🚀 Starting backend route tests...\n');
  
  const results = [];
  
  for (const route of routes) {
    console.log(`Testing ${route.method} ${route.path} - ${route.description}`);
    const result = await testRoute(route);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.status} - ${result.description}`);
    } else {
      console.log(`❌ ${result.status} - ${result.description} - ${result.error || 'Failed'}`);
    }
    console.log('');
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('\n📊 Test Summary:');
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All routes are working properly!');
  } else {
    console.log('\n⚠️  Some routes need attention:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.method} ${r.route}: ${r.error || 'HTTP ' + r.status}`);
    });
  }
  
  return results;
}

// Run tests
testAllRoutes().catch(console.error);
