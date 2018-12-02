function roundTo(number, decimalPlace = 0) {
  const scale = Math.pow(10, decimalPlace);

  return Math.round(number * scale) / scale;
}

module.exports = {
  roundTo,
};
