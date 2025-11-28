import { spawn } from 'child_process';

console.log('[Server] Starting Next.js application...');

const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  shell: true,
});

nextProcess.on('error', (error) => {
  console.error('[Server] Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code) => {
  console.log(`[Server] Next.js exited with code ${code}`);
  process.exit(code || 0);
});
