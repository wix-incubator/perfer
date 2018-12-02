const { roundTo } = require('./utils');

// function getCompareResults(difference, error) {
//   if (Math.abs(difference) <= error) {
//     return 0;
//   }

//   return difference;
// }

function compareScenarioResults(previous, current) {
  // const error = Math.max(current.error, previous.error);
  // const difference = ((previous.mean - current.mean) * 100) / previous.mean;

  // const compareResult = getCompareResults(difference, error);

  const medianDiffValue = current.median - previous.median;
  const medianDiffPrecentage = roundTo(
    (medianDiffValue * 100) / previous.median,
    2,
  );

  const meanDiffValue = current.mean - previous.mean;
  const meanDiffPrecentage = roundTo((meanDiffValue * 100) / previous.mean, 2);

  const difference = {
    median: medianDiffPrecentage,
    mean: meanDiffPrecentage,
  };

  return { previous, current, difference };
}

async function compareResults(previousBenchmarks, currentBenchmarks) {
  // a list of scenario comparision results
  const comparison = [];

  currentBenchmarks.forEach((currentSuiteResults, suitePath) => {
    if (!previousBenchmarks.has(suitePath)) {
      throw new Error(
        `The suite "${suitePath}" was not exist in the previous benchmark, cannot compare`,
      );
    }

    const previousSuiteResults = previousBenchmarks.get(suitePath);

    currentSuiteResults.forEach((currentScenarioResults, scenarioName) => {
      if (!previousSuiteResults.has(scenarioName)) {
        throw new Error(
          `The scenraio "${scenarioName}" was not exist in the previous benchmark, cannot compare`,
        );
      }

      const previousScenarioResults = previousSuiteResults.get(scenarioName);

      const scenarioComparison = compareScenarioResults(
        previousScenarioResults,
        currentScenarioResults,
      );

      comparison.push({ ...scenarioComparison, scenarioName, suitePath });
    });
  });

  return comparison;
}

module.exports = compareResults;
