/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordsSummaryView = Backbone.View.extend({
    render: function() {
      this.$el.text(this.total());
    },
    formatCurrency: function(amount) {
      return "$" + amount.toFixed(2);
    },
    total: function() {
      return this.formatCurrency(this.collection.total());
    }
  })
})(jQuery);
