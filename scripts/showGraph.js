const runBenchmarks = require('../src/runBenchmarks');
const renderGraphs = require('../src/renderGraphs');

async function showGraph(times) {
  const result = await runBenchmarks(times);
  const graphs = [];

  result.forEach((suite, suitePath) =>
    suite.forEach((scenario, scenarioName) => {
      graphs.push({
        name: scenarioName,
        data: scenario.data,
        median: scenario.median,
        mean: scenario.mean,
      });
    }),
  );

  renderGraphs(graphs);
}

async function showGraphMultipleBenchmarks(times = 5) {
  const graphs = [];
  const results = [];

  for (let i = 0; i < times; i++) {
    results.push(await runBenchmarks(10000));
  }

  results.forEach((result, index) => {
    const suite = result.get(
      '/Users/rany/Projects/performance-degradation-testing/__benchmarks__/fibonacci.js',
    );

    const scenarioName = 'recursiveWithMemoization';
    const scenario = suite.get(scenarioName);

    graphs.push({
      name: scenarioName + index,
      data: scenario.data,
      median: scenario.median,
      mean: scenario.mean,
    });
  });

  renderGraphs(graphs);
}

showGraph(100000);
// showGraphMultipleBenchmarks(20);
