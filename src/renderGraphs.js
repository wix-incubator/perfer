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

function renderGraphs(graphs) {
  const prepared = graphs.map(({ data, name, median, mean }) => {
    return {
      name,
      data: prepareDataForGraph(data),
      median,
      mean,
    };
  });

  const app = express();

  app.set('view engine', 'ejs');

  app.get('/', (req, res) => {
    res.render('./chart.ejs', { graphs: JSON.stringify(prepared) });
  });

  app.listen(4000, () => {
    openBrowser('http://localhost:4000');
  });
}

module.exports = renderGraphs;
