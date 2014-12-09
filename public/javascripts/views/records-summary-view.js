/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordsSummaryView = Backbone.View.extend({
    el: 'h1#summary',
    initialize: function() {
      this.$el.text(this.formatCurrency(this.collection.total()));
    },
    formatCurrency: function(amount) {
      return "$" + amount.toFixed(2);
    }
  })
})(jQuery);
