const { spawn } = require('child_process');
const path = require('path');

console.log('=====================================================');
console.log('🚀 Starting Fullstack Authentication System');
console.log('   - Backend API:  http://localhost:5000');
console.log('   - Frontend UI:  http://localhost:3000');
console.log('   - Database:     SQLite3 (server/auth.db)');
console.log('=====================================================\n');

// Determine command runner based on OS (use npm.cmd on Windows)
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// Spawn backend server
const server = spawn(npmCmd, ['start'], {
  cwd: path.resolve(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// Spawn frontend client
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\nShutting down dev servers...');
  server.kill('SIGINT');
  client.kill('SIGINT');
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
