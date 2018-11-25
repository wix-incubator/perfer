const execa = require('execa');

(async function() {
  await execa.shell('npm install');

  const {stdout: stdoutDiff} = await execa.shell('npm test');

  await execa.shell('rm -rf node_modules package-lock.json');
  await execa.shell('git checkout . && git clean -df');

  await execa.shell('git checkout origin/master');
  await execa.shell('npm install');

  const {stdout: stdoutBase} = await execa.shell('npm test');


  console.log('stdoutDiff: ', stdoutDiff);
  console.log('stdoutBase: ', stdoutBase);
})();