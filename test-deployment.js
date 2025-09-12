// Test script for Heroku deployment
// Replace 'your-app-name' with your actual Heroku app name

const HEROKU_URL = 'https://your-app-name.herokuapp.com';

async function testEndpoints() {
  console.log('🚀 Testing Heroku Deployment...\n');
  
  const endpoints = [
    { method: 'GET', path: '/', description: 'Root endpoint' },
    { method: 'GET', path: '/api/auth', description: 'Auth routes' },
    { method: 'GET', path: '/api/inventory', description: 'Inventory routes' },
    { method: 'GET', path: '/api/orders', description: 'Order routes' },
    { method: 'GET', path: '/api/usage', description: 'Usage routes' },
    { method: 'GET', path: '/api/wastage', description: 'Wastage routes' },
    { method: 'GET', path: '/api/reports', description: 'Report routes' },
    { method: 'GET', path: '/api/stock-levels', description: 'Stock level routes' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.description}: ${endpoint.method} ${endpoint.path}`);
      
      const response = await fetch(`${HEROKU_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const status = response.status;
      const statusText = response.statusText;
      
      if (status < 500) {
        console.log(`✅ ${endpoint.description}: ${status} ${statusText}`);
      } else {
        console.log(`❌ ${endpoint.description}: ${status} ${statusText}`);
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.description}: Error - ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('🗄️  Testing Database Connection...\n');
  
  try {
    // This would typically be a health check endpoint
    const response = await fetch(`${HEROKU_URL}/api/auth/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 404) {
      console.log('ℹ️  No health endpoint found (this is normal)');
    } else {
      console.log(`Database connection test: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`Database connection test failed: ${error.message}`);
  }
}

// Run tests
async function runTests() {
  console.log('='.repeat(50));
  console.log('    HEROKU DEPLOYMENT TEST');
  console.log('='.repeat(50));
  console.log(`Target URL: ${HEROKU_URL}\n`);
  
  await testEndpoints();
  await testDatabaseConnection();
  
  console.log('='.repeat(50));
  console.log('✨ Testing Complete!');
  console.log('='.repeat(50));
  console.log('\n📝 Next Steps:');
  console.log('1. Replace "your-app-name" with your actual Heroku app name');
  console.log('2. Check Heroku logs if any endpoints return 500 errors');
  console.log('3. Verify environment variables are set correctly');
  console.log('4. Test with a tool like Postman for detailed API testing');
}

// Check if this is being run directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}