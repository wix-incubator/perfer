function loop(input) {
  let num = input;
  let a = 1;
  let b = 0;
  let temp;

  while (num >= 0) {
    temp = a;
    a += b;
    b = temp;
    num -= 1;
  }

  return b;
}

function recursive(num) {
  if (num <= 1) return 1;

  return recursive(num - 1) + recursive(num - 2);
}

function recursiveWithMemoization(num, memo = {}) {
  if (memo[num]) return memo[num];
  if (num <= 1) return 1;

  memo[num] =
    recursiveWithMemoization(num - 1, memo) +
    recursiveWithMemoization(num - 2, memo);

  return memo[num];
}

const INPUT = 20;

module.exports = {
  loop: () => {
    loop(INPUT);
  },
  recursive: () => {
    recursive(INPUT);
  },
  recursiveWithMemoization: () => {
    recursiveWithMemoization(INPUT);
  },
};
