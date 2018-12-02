const _ = require('lodash');
const path = require('path');
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

  app.get('/', (req, res) => {
    const templatePath = path.join(__dirname, '..', 'views', 'chart.ejs');
    const html = res.render(templatePath, { graphs: JSON.stringify(prepared) });
    res.send(html);
  });

  app.listen(4000, () => {
    openBrowser('http://localhost:4000');
  });
}

module.exports = renderGraphs;
