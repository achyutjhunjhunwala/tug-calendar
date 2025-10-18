#!/usr/bin/env node

/**
 * Local test script for Calendar notification service
 * Run with: node test-local.js [daily|weekly|monthly|all]
 */

require('dotenv').config();

const { handler: dailyHandler } = require('./dist/src/handlers/daily.handler');
const { handler: weeklyHandler } = require('./dist/src/handlers/weekly.handler');
const { handler: monthlyHandler } = require('./dist/src/handlers/monthly.handler');

// Minimal context for local testing
const context = {
  awsRequestId: `local-test-${Date.now()}`,
};

async function testDaily() {
  console.log('\n========================================');
  console.log('  Testing Daily Handler');
  console.log('========================================\n');
  
  try {
    await dailyHandler({}, context);
    console.log('\n✅ Daily handler completed successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Daily handler failed');
    console.error('Error:', error.message);
    return false;
  }
}

async function testWeekly() {
  console.log('\n========================================');
  console.log('  Testing Weekly Handler');
  console.log('========================================\n');
  
  try {
    await weeklyHandler({}, context);
    console.log('\n✅ Weekly handler completed successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Weekly handler failed');
    console.error('Error:', error.message);
    return false;
  }
}

async function testMonthly() {
  console.log('\n========================================');
  console.log('  Testing Monthly Handler');
  console.log('========================================\n');
  
  try {
    await monthlyHandler({}, context);
    console.log('\n✅ Monthly handler completed successfully');
    return true;
  } catch (error) {
    console.error('\n❌ Monthly handler failed');
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests(testType = 'all') {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Tug Calendar - Local Test Runner    ║');
  console.log('╚════════════════════════════════════════╝');
  
  const results = [];
  
  if (testType === 'daily' || testType === 'all') {
    results.push(await testDaily());
  }
  
  if (testType === 'weekly' || testType === 'all') {
    results.push(await testWeekly());
  }
  
  if (testType === 'monthly' || testType === 'all') {
    results.push(await testMonthly());
  }
  
  console.log('\n========================================');
  console.log('  Test Summary');
  console.log('========================================\n');
  
  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;
  
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${results.length}`);
  
  console.log('\n========================================\n');
  
  if (failed === 0) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.error('❌ Some tests failed');
    process.exit(1);
  }
}

// Parse command line arguments
const testType = process.argv[2] || 'all';
const validTypes = ['daily', 'weekly', 'monthly', 'all'];

if (!validTypes.includes(testType)) {
  console.error(`Invalid test type: ${testType}`);
  console.error(`Valid options: ${validTypes.join(', ')}`);
  process.exit(1);
}

runTests(testType).catch((error) => {
  console.error('\n========================================');
  console.error('  Fatal Error');
  console.error('========================================\n');
  console.error(error);
  console.error('\n========================================\n');
  process.exit(1);
});
