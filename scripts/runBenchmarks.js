const globbby = require('globby');
const { Stats } = require('fast-stats');

const NS_PER_SEC = 1e9;
const NS_PER_MS = 1000000;

const DURATION = 5000;
const EXECUTIONS = 1000000;

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

  // Compute the error margin
  const error = (moe * 100) / mean;

  return {
    name,
    executions,
    time: mean,
    error,
  };
}

async function runBenchmarks() {
  const benchmarks = await globbby('__benchmarks__/**/*.js', {
    absolute: true,
  });

  const results = await Promise.all(
    benchmarks.map(async filePath => {
      const testCases = require(filePath);

      return Promise.all(
        Object.keys(testCases).map(name => {
          return runScenario(name, testCases[name]);
        }),
      );
    }),
  );

  console.log(results);
}

module.exports = { runBenchmarks };
