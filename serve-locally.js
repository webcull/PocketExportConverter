import { spawn } from 'child_process';

function run(command, args, name) {
	const proc = spawn(command, args, {
		stdio: 'inherit',
		shell: true
	});

	proc.on('exit', code => {
		console.log(`❌ ${name} exited with code ${code}`);
	});

	return proc;
}

// Get port from command-line args or default to 3026
const port = process.argv[2] || '3026';

console.log(`🚀 Launching dev processes on port ${port}...`);

const webpackProc = run('npx', ['webpack', '--watch'], 'webpack');
const serverProc = run('npx', ['http-server', './dist', '-p', port], 'http-server');

// Graceful shutdown: kill children if parent is interrupted
process.on('SIGINT', () => {
	console.log('\n🛑 Caught SIGINT, terminating processes...');
	webpackProc.kill('SIGINT');
	serverProc.kill('SIGINT');
	process.exit();
});