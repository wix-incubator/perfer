
const {spawnSync} = require('child_process');

spawnSync('npm', ['install'], {stdio: 'inherit'});

const {stdout: stdoutDiff} = spawnSync('npx', ['bipbip', '-s', '.cache/benchmarks.json'], {encoding: 'utf-8'});

spawnSync('rm', ['-rf', 'node_modules', 'package-lock.json'], {stdio: 'inherit'});
spawnSync('git', ['clean', '-df'], {stdio: 'inherit'});
spawnSync('git', ['checkout', '.'], {stdio: 'inherit'});

spawnSync('git', ['checkout', 'origin/master'], {stdio: 'inherit'});
spawnSync('npm', ['install'], {stdio: 'inherit'});

const {stdout: stdoutBase} = spawnSync('npx', ['bipbip', '-c', '.cache/benchmarks.json'], {encoding: 'utf-8'});

console.log('stdoutDiff: ', stdoutDiff);
console.log('stdoutBase: ', stdoutBase);