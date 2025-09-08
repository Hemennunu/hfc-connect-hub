const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanupInvalidDates() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hfc_database'
  });

  try {
    console.log('Checking for invalid dates in projects table...');
    
    // Check for rows with invalid dates
    const [rows] = await connection.execute(
      "SELECT id, title, startDate FROM projects WHERE startDate = '0000-00-00' OR startDate IS NULL"
    );
    
    console.log(`Found ${rows.length} projects with invalid start dates:`);
    rows.forEach(row => {
      console.log(`- ID: ${row.id}, Title: ${row.title}, StartDate: ${row.startDate}`);
    });

    if (rows.length > 0) {
      console.log('\nOptions to fix:');
      console.log('1. Set all invalid dates to NULL (recommended for now)');
      console.log('2. Set all invalid dates to a default date (e.g., 2024-01-01)');
      console.log('3. Delete rows with invalid dates');
      
      // For now, let's set them to NULL
      const [result] = await connection.execute(
        "UPDATE projects SET startDate = NULL WHERE startDate = '0000-00-00'"
      );
      
      console.log(`\nUpdated ${result.affectedRows} rows - set invalid dates to NULL`);
    } else {
      console.log('No invalid dates found!');
    }

  } catch (error) {
    console.error('Error cleaning up dates:', error);
  } finally {
    await connection.end();
  }
}

cleanupInvalidDates();
