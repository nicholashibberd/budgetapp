/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordsSummaryView = Backbone.View.extend({
    render: function() {
      this.$el.text(this.total());
    },
    formatCurrency: function(amount) {
      return "$" + amount.toFixed(2).replace(/./g, function(c, i, a) {
        return i && c !== "." && !((a.length - i) % 3) ? ',' + c : c;
      });
    },
    total: function() {
      return this.formatCurrency(this.collection.total());
    }
  })
})(jQuery);
