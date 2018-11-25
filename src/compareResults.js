function getCompareResults(difference, error) {
  if (Math.abs(difference) <= error) {
    return 0;
  }

  return difference;
}

function compareScenarioResults(current, previous) {
  const error = Math.max(current.error, previous.error);
  const difference = ((previous.mean - current.mean) * 100) / previous.mean;

  const compareResult = getCompareResults(difference, error);

  return { result: compareResult, error, difference, previous, current };
}

async function compareResults(previousBenchmarks, currentBenchmarks) {
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
        currentScenarioResults,
        previousScenarioResults,
      );

      comparison.push({ ...scenarioComparison, scenarioName, suitePath });
    });
  });

  return comparison;
}

module.exports = compareResults;
