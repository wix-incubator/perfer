#! /usr/bin/env node
process.on('unhandledRejection', err => {
  throw err;
});

const program = require('commander');
const globby = require('globby');

const packageJson = require('../package.json');
const renderGraphs = require('../src/renderGraphs');
const runBenchmarks = require('../src/runBenchmarks');
const { NotFoundBenchmarks } = require('../src/errors');

const defaultGlob = '__benchmarks__/**/*.perf.js';

program
  .version(packageJson.version)
  .option('-r, --runs [amount]', 'the number of runs', 100)
  .option(
    '-d, --decimalPlace [decimalPlace]',
    'round values to this decimal place',
    2,
  )
  .option('-s, --setSize [amount]', 'the number of runs in a set', 10)
  .option('-g, --graph', 'render a graph', false)
  .parse(process.argv);

(async function() {
  const benchmarkFiles = await globby(defaultGlob, {
    absolute: true,
  });

  if (benchmarkFiles.length === 0) {
    throw new NotFoundBenchmarks(defaultGlob);
  }

  const results = await runBenchmarks({
    benchmarkFiles,
    runs: parseInt(program.runs, 10),
    setSize: parseInt(program.setSize, 10),
    decimalPlace: parseInt(program.decimalPlace, 10),
  });

  if (program.graph) {
    const graphs = [];

    results.forEach(suite =>
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
  } else {
    console.log(results);
  }
})();
