const runBenchmarks = require('../src/runBenchmarks');
const _ = require('lodash');
const express = require('express');
const openBrowser = require('react-dev-utils/openBrowser');

function prepareDataForGraph(data) {
  return _.chain(data)
    .groupBy()
    .mapValues((results, duration) => [duration, results.length])
    .values()
    .value();
}

async function run() {
  const result = await runBenchmarks(10000);
  const graphs = [];

  result.forEach((suite, suitePath) =>
    suite.forEach((scenario, scenarioName) => {
      graphs.push({
        name: scenarioName,
        data: prepareDataForGraph(scenario.data),
        median: scenario.median,
        mean: scenario.mean,
      });
    }),
  );

  const app = express();

  app.set('view engine', 'ejs');

  app.get('/', (req, res) => {
    res.render('./chart.ejs', { graphs: JSON.stringify(graphs) });
  });

  app.listen(4000, () => {
    openBrowser('http://localhost:4000');
  });
}

run();
