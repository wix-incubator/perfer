const runBenchmarks = require('../src/runBenchmarks');
const compareResults = require('../src/compareResults');
const renderGraphs = require('../src/renderGraphs');
const { Stats } = require('fast-stats');

// run two benchmarks and return the diff
async function diffTwoBenchmarks(times = 1) {
  const result1 = await runBenchmarks(times);
  const result2 = await runBenchmarks(times);

  return await compareResults(result1, result2);
}

async function runMultipleDiffs(diffRuns) {
  const scenarioName = 'recursiveWithMemoization';
  const medians = [];
  const means = [];

  for (let i = 0; i < diffRuns; i++) {
    const diff = await diffTwoBenchmarks(10000);

    const { median, mean } = diff.find(
      el => el.scenarioName === scenarioName,
    ).difference;

    medians.push(median);
    means.push(mean);
  }

  const meansStats = new Stats().push(means);
  meansStats.iqr();

  const mediansStats = new Stats().push(medians);
  mediansStats.iqr();

  // console.log(medians, means);
  const graphs = [
    {
      name: `median of ${scenarioName}`,
      data: mediansStats.data.sort((a, b) => a > b),
      mean: mediansStats.amean(),
      median: mediansStats.median(),
    },
    {
      name: `means of ${scenarioName}`,
      data: meansStats.data.sort((a, b) => a > b),
      mean: meansStats.amean(),
      median: meansStats.median(),
    },
  ];

  renderGraphs(graphs);
}

runMultipleDiffs(10);
