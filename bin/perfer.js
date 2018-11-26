#! /usr/bin/env node
const program = require('commander');
const renderGraphs = require('../src/renderGraphs');
const runBenchmarks = require('../src/runBenchmarks');

program
  .version('0.1.0')
  .option('-t, --times [amount]', 'the number of times to run', 100)
  .parse(process.argv);

showGraph(program.times);

async function showGraph(times) {
  const result = await runBenchmarks(times);
  const graphs = [];

  result.forEach(suite =>
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
