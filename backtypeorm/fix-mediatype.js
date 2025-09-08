const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixMediaTypeValues() {
  let connection;
  
  try {
    console.log('Attempting to connect to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USERNAME);
    console.log('Database:', process.env.DB_NAME);
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hfc_database'
    });

    console.log('✅ Connected to database successfully');

    // Check current mediaType values
    console.log('\n--- Current mediaType values ---');
    const [currentValues] = await connection.execute(
      'SELECT DISTINCT mediaType, COUNT(*) as count FROM case_stories GROUP BY mediaType'
    );
    console.table(currentValues);

    // Update invalid values to 'text'
    console.log('\n--- Updating invalid mediaType values ---');
    const [updateResult] = await connection.execute(
      `UPDATE case_stories 
       SET mediaType = 'text' 
       WHERE mediaType NOT IN ('text', 'photo', 'video', 'audio', 'photo_essay')`
    );
    
    console.log(`Updated ${updateResult.affectedRows} rows`);

    // Verify the update
    console.log('\n--- Updated mediaType values ---');
    const [updatedValues] = await connection.execute(
      'SELECT DISTINCT mediaType, COUNT(*) as count FROM case_stories GROUP BY mediaType'
    );
    console.table(updatedValues);

    console.log('\n✅ MediaType values fixed successfully!');
    console.log('You can now restart the server - the schema migration should work.');

  } catch (error) {
    console.error('Error fixing mediaType values:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixMediaTypeValues();
