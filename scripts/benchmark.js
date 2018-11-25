const { spawnSync } = require('child_process');
const runBenchmarks = require('../src/runBenchmarks');
const compareResults = require('../src/compareResults');

async function run() {
  spawnSync('npm', ['install'], { stdio: 'inherit' });

  const currentResults = await runBenchmarks();

  spawnSync('rm', ['-rf', 'node_modules', 'package-lock.json'], {
    stdio: 'inherit',
  });

  spawnSync('git', ['clean', '-df'], { stdio: 'inherit' });
  spawnSync('git', ['checkout', '.'], { stdio: 'inherit' });

  spawnSync('git', ['checkout', 'origin/master'], { stdio: 'inherit' });

  spawnSync('npm', ['install'], { stdio: 'inherit' });

  const previousResults = await runBenchmarks();

  console.log(await compareResults(previousResults, currentResults));
}

run();
