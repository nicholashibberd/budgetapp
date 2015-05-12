module.exports = {
  displayAmount: function(amount, symbol) {
    // if (amount >= 0) {
    //   return symbol + amount;
    // } else {
    //   return '-' + symbol + Math.abs(amount);
    // }

    var negative = amount < 0 ? "-" : "",
    i = parseInt(amount = Math.abs(+amount || 0).toFixed(2), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
    return negative + symbol + (j ? i.substr(0, j) + ',' : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ',') + ('.' + Math.abs(amount - i).toFixed(2).slice(2));
  }
}
