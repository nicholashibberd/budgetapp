module.exports = {
  displayAmount: function(amount, symbol) {
    if (amount >= 0) {
      return symbol + amount;
    } else {
      return '-' + symbol + Math.abs(amount);
    }
  }
}
