const globbby = require('globby');
const { Stats } = require('fast-stats');
const merge = require('lodash/merge');

const NS_PER_SEC = 1e9;
const NS_PER_MS = 1000000;

const DURATION = 5000;
const EXECUTIONS = 1000000;

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

async function runScenario(name, fn) {
  let restTime = DURATION * NS_PER_MS;
  let executions = 0;

  const stats = new Stats();

  while (restTime > (stats.amean() || 0) && executions < EXECUTIONS) {
    executions += 1;

    const execTime = await runScenarioOnce(fn);

    restTime -= execTime;

    stats.push(execTime);
  }

  // Arithmetic Mean
  const mean = stats.amean();

  // Margin of Error value
  const moe = stats.moe();

  const median = stats.median();

  // const distribution = stats.distribution();

  const stddev = stats.stddev();

  const gstddev = stats.gstddev();

  // Compute the error margin
  const error = (moe * 100) / mean;

  return {
    executions,
    error,
    moe,
    mean,
    median,
    stddev,
    gstddev,
  };
}

async function runBenchmarks() {
  const benchmarks = new Map();

  const benchmarkFiles = await globbby('__benchmarks__/**/*.js', {
    absolute: true,
  });

  for (const filePath of benchmarkFiles) {
    const suite = require(filePath);
    const suiteResults = new Map();

    for (const scenarioName of Object.keys(suite)) {
      const scenarioResults = await runScenario(
        scenarioName,
        suite[scenarioName],
      );

      suiteResults.set(scenarioName, scenarioResults);
    }

    benchmarks.set(filePath, suiteResults);
  }

  return benchmarks;
}

module.exports = runBenchmarks;
