const axios = require('axios');

// Replace with your actual admin token
const ADMIN_TOKEN = 'your_admin_token_here';
const API_URL = 'http://localhost:5000/api/stats';

const statsToAdd = [
  {
    number: '37000+ 18000+ 34000+ 86871+ 10000+',
    label: 'Reached (OVC, PLWHA, Other Beneficiaries, Total, Indirect)',
    isActive: true,
    order: 2
  },
  {
    number: '1,635+',
    label: 'Volunteer Providers',
    isActive: true,
    order: 3
  },
  {
    number: '41+',
    label: 'CSOs Strengthened',
    isActive: true,
    order: 4
  },
  {
    number: '78+',
    label: 'CBOs Strengthened',
    isActive: true,
    order: 5
  }
];

async function addStats() {
  try {
    for (const stat of statsToAdd) {
      const response = await axios.post(API_URL, stat, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`Added: ${response.data.label}`);
    }
    console.log('All statistics added successfully!');
  } catch (error) {
    console.error('Error adding statistics:', error.response?.data || error.message);
  }
}

addStats();
