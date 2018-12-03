const chalk = require('chalk');

class NotFoundBenchmarks extends Error {
  constructor(glob) {
    super();
    this.name = '';
    this.message = chalk.red(`● there are no files that match the benchmark glob pattern:
    
  "${glob}"
    `);

    Error.captureStackTrace(this, () => {});
  }
}

module.exports = {
  NotFoundBenchmarks,
};
