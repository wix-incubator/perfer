const runBenchmarks = require('../src/runBenchmarks');
const compareResults = require('../src/compareResults');

async function run() {
  const result1 = await runBenchmarks();
  const result2 = await runBenchmarks();

  console.log(await compareResults(result1, result2));
}

(async function() {
  for (let i = 0; i < 1; i++) {
    await run();
  }
})();
