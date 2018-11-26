const globbby = require('globby');
const { Stats } = require('fast-stats');

const NS_PER_SEC = 1e9;
const NS_PER_MS = 1000000;

const DURATION = 5000;
const EXECUTIONS = 1000;

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

async function runScenario(name, fn, maxExecutions) {
  let restTime = DURATION * NS_PER_MS;
  let executions = 0;

  const stats = new Stats();

  // The first scenario is usually bigger than the rest,
  // let's run it for the first time and ignore the result
  await runScenarioOnce(fn);

  while (restTime > (stats.amean() || 0) && executions < maxExecutions) {
    executions += 1;

    const execTime = await runScenarioOnce(fn);

    restTime -= execTime;

    stats.push(execTime);
  }

  // apply IQR Filtering and sort the stats data
  stats.iqr();

  // Arithmetic Mean
  const mean = stats.amean();

  // Margin of Error value
  const moe = stats.moe();

  const median = stats.median();

  // const distribution = stats.distribution();

  const stddev = stats.stddev();

  const gstddev = stats.gstddev();

  const max = stats.max;
  const min = stats.min;
  const data = stats.data;
  // Compute the error margin
  const error = (moe * 100) / mean;

  return {
    executions,
    error,
    moe,
    max,
    min,
    mean,
    median,
    stddev,
    gstddev,
    data,
  };
}

async function runBenchmarks(maxExecutions = EXECUTIONS) {
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
        maxExecutions,
      );

      suiteResults.set(scenarioName, scenarioResults);
    }

    benchmarks.set(filePath, suiteResults);
  }

  return benchmarks;
}

module.exports = runBenchmarks;
