const { Stats } = require('fast-stats');
const { roundTo } = require('./utils');

// nano seconds per second
const NS_PER_SEC = 1e9;
// nano seconds per milisecond
const NS_PER_MS = 1000000;

const nanoToMili = durationInNS => parseInt(durationInNS, 10) / NS_PER_MS;

const defaultRuns = 100;
const defaultSetSize = 1;

// return the running time of a function in nanoseconds
// https://nodejs.org/api/process.html#process_process_hrtime_time
async function runScenarioOnce(fn) {
  const start = process.hrtime();
  const result = fn();

  if (result instanceof Promise) {
    await result;
  }

  const diff = process.hrtime(start);
  return diff[0] * NS_PER_SEC + diff[1];
}

async function runScenario({ fn, runs, decimalPlace }) {
  console.log(decimalPlace);
  const stats = new Stats();

  // The first scenario is usually bigger than the rest,
  // let's run it for the first time and ignore the result
  await runScenarioOnce(fn);

  for (let i = 0; i < runs; i++) {
    const execTime = await runScenarioOnce(fn);
    stats.push(execTime);
  }

  // apply IQR Filtering and sort the stats data
  // https://github.com/bluesmoon/node-faststats#iqr-filtering
  stats.iqr();

  function normalizeTime(duration) {
    const timeInMS = nanoToMili(duration);
    return roundTo(timeInMS, decimalPlace);
  }

  // go to https://github.com/bluesmoon/node-faststats#summaries--averages
  // for more information regarding the summaries & averages
  const mean = normalizeTime(stats.amean());
  const moe = normalizeTime(stats.moe());
  const median = normalizeTime(stats.median());
  const stddev = normalizeTime(stats.stddev());
  const max = normalizeTime(stats.max);
  const min = normalizeTime(stats.min);
  const data = stats.data.map(normalizeTime);

  return {
    data,
    runs,
    max,
    min,
    mean,
    median,
    moe,
    stddev,
  };
}

async function runBenchmarks({
  benchmarkFiles,
  runs = defaultRuns,
  setSize = defaultSetSize,
  decimalPlace,
}) {
  const benchmarks = new Map();

  for (const filePath of benchmarkFiles) {
    const suite = require(filePath);

    const suiteResults = new Map();

    for (const scenarioName of Object.keys(suite)) {
      const scenarioResults = await runScenario({
        scenarioName,
        fn: suite[scenarioName],
        runs,
        decimalPlace,
      });

      suiteResults.set(scenarioName, scenarioResults);
    }

    benchmarks.set(filePath, suiteResults);
  }

  return benchmarks;
}

module.exports = runBenchmarks;
