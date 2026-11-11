const app = require('./server');
const http = require('http');

async function runTests() {
  console.log('🧪 Starting API Integration Tests...\n');

  // Let server spin up on port 5000 (already started by server.js require)
  await new Promise((r) => setTimeout(r, 1000));

  const makeRequest = (path, method = 'GET', body = null, token = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
      }

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  };

  try {
    // 1. Health Check
    console.log('1️⃣ Testing GET /api/health...');
    const health = await makeRequest('/api/health');
    console.log('   Response:', health.status, health.data.status);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Login with seeded account
    console.log('\n2️⃣ Testing POST /api/auth/login with demo account...');
    const login = await makeRequest('/api/auth/login', 'POST', {
      email: 'alex.rivera@example.com',
      password: 'Password123!',
    });
    console.log('   Status:', login.status, 'Message:', login.data.message);
    if (!login.data.token) throw new Error('Login failed to return token');
    const token = login.data.token;
    console.log('   Received JWT Token:', token.slice(0, 25) + '...');

    // 3. Verify /me endpoint
    console.log('\n3️⃣ Testing GET /api/auth/me (Protected Route)...');
    const me = await makeRequest('/api/auth/me', 'GET', null, token);
    console.log('   Status:', me.status, 'User Name:', me.data.user?.name);
    if (me.data.user?.email !== 'alex.rivera@example.com') throw new Error('/me verification failed');

    // 4. Update Profile
    console.log('\n4️⃣ Testing PUT /api/auth/profile (Update Profile in Database)...');
    const update = await makeRequest(
      '/api/auth/profile',
      'PUT',
      {
        name: 'Alex Rivera (Updated)',
        bio: 'Updated bio testing SQLite database persistence!',
        phone: '+1 555-999-8888',
        location: 'Silicon Valley, CA',
      },
      token
    );
    console.log('   Status:', update.status, 'Updated Name:', update.data.user?.name);
    console.log('   Updated Bio:', update.data.user?.bio);
    if (update.data.user?.name !== 'Alex Rivera (Updated)') throw new Error('Profile update failed');

    // 5. Register a new user
    console.log('\n5️⃣ Testing POST /api/auth/register (New User Registration)...');
    const newEmail = `user_${Date.now()}@example.com`;
    const register = await makeRequest('/api/auth/register', 'POST', {
      name: 'Sarah Connor',
      email: newEmail,
      password: 'NewSecurePassword123!',
      phone: '+1 555-432-1098',
      location: 'Los Angeles, CA',
    });
    console.log('   Status:', register.status, 'Registered User:', register.data.user?.email);
    if (!register.data.token) throw new Error('Registration failed to return token');

    // 6. List users in SQLite
    console.log('\n6️⃣ Testing GET /api/auth/users (SQLite User Count)...');
    const users = await makeRequest('/api/auth/users');
    console.log('   Status:', users.status, 'Total Registered Users in DB:', users.data.count);

    console.log('\n🎉 ALL BACKEND & DATABASE TESTS PASSED SUCCESSFULLY! 🎉\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
