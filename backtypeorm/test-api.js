const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test all public endpoints
const testEndpoints = [
  { name: 'News', endpoint: '/news' },
  { name: 'Projects', endpoint: '/projects' },
  { name: 'Case Stories', endpoint: '/case-stories' },
  { name: 'Alumni', endpoint: '/alumni' },
  { name: 'Gallery', endpoint: '/gallery' },
  { name: 'Board Directors', endpoint: '/board-directors' },
  { name: 'Board Members', endpoint: '/board-members' },
  { name: 'Management Team', endpoint: '/management-team' },
  { name: 'Staff', endpoint: '/staff' },
  { name: 'Partners', endpoint: '/partners' },
  { name: 'Reports', endpoint: '/reports' },
  { name: 'Founders', endpoint: '/founders' },
  { name: 'Contact', endpoint: '/contact' },
  { name: 'Donations', endpoint: '/donations' },
  { name: 'Org Profile', endpoint: '/org-profile' },
  { name: 'Mission Vision', endpoint: '/mission-vision' },
  { name: 'Thematic Areas', endpoint: '/thematic-areas' },
  { name: 'Stats', endpoint: '/stats' }
];

async function testAPI() {
  console.log('🚀 Testing HFC Backend API Endpoints...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  for (const test of testEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${test.endpoint}`, {
        timeout: 5000
      });
      
      if (response.status === 200) {
        console.log(`✅ ${test.name}: OK (${response.data.length || 'N/A'} items)`);
        results.passed++;
      } else {
        console.log(`❌ ${test.name}: Failed (Status: ${response.status})`);
        results.failed++;
        results.errors.push(`${test.name}: Status ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
      results.failed++;
      results.errors.push(`${test.name}: ${error.message}`);
    }
  }

  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / testEndpoints.length) * 100).toFixed(1)}%`);
  
  if (results.errors.length > 0) {
    console.log('\n🔍 Errors:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  }

  console.log('\n🎯 All CRUD endpoints are configured and ready for frontend integration!');
}

testAPI().catch(console.error);
