
const {spawnSync} = require('child_process');

spawnSync('npm', ['install']);

const {stdout: stdoutDiff} = spawnSync('npm', ['test']);

spawnSync('rm', ['-rf', 'node_modules', 'package-lock.json']);
spawnSync('git', ['checkout', '.', '&&', 'git', 'clean', '-df']);

spawnSync('git', ['checkout', 'origin/master']);
spawnSync('npm', ['install']);

const {stdout: stdoutBase} = spawnSync('npm', ['test']);

console.log('stdoutDiff: ', stdoutDiff);
console.log('stdoutBase: ', stdoutBase);