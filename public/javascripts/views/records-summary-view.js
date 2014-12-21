/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordsSummaryView = Backbone.View.extend({
    render: function() {
      this.$el.text(this.total());
    },
    formatMoney: function(number, places, symbol, thousand, decimal) {
      number = number || 0;
      places = !isNaN(places = Math.abs(places)) ? places : 2;
      symbol = symbol !== undefined ? symbol : "$";
      thousand = thousand || ",";
      decimal = decimal || ".";
      var negative = number < 0 ? "-" : "",
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = (j = i.length) > 3 ? j % 3 : 0;
      return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    },
    total: function() {
      return this.formatMoney(this.collection.total());
    }
  })
})(jQuery);
