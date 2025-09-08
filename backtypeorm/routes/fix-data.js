const express = require('express');
const router = express.Router();
const { AppDataSource } = require('../config/database');

// Fix mediaType values in case_stories
router.post('/fix-mediatype', async (req, res) => {
  try {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Check current values
    const currentValues = await queryRunner.query(
      'SELECT DISTINCT mediaType, COUNT(*) as count FROM case_stories GROUP BY mediaType'
    );
    console.log('Current mediaType values:', currentValues);

    // Update invalid values to 'text'
    const updateResult = await queryRunner.query(
      `UPDATE case_stories 
       SET mediaType = 'text' 
       WHERE mediaType NOT IN ('text', 'photo', 'video', 'audio', 'photo_essay')`
    );

    // Check updated values
    const updatedValues = await queryRunner.query(
      'SELECT DISTINCT mediaType, COUNT(*) as count FROM case_stories GROUP BY mediaType'
    );

    await queryRunner.release();

    res.json({
      success: true,
      message: 'MediaType values fixed successfully',
      rowsUpdated: updateResult.affectedRows,
      currentValues: currentValues,
      updatedValues: updatedValues
    });

  } catch (error) {
    console.error('Error fixing mediaType values:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing mediaType values',
      error: error.message
    });
  }
});

module.exports = router;
