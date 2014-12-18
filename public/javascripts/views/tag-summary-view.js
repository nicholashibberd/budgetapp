/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagSummaryView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#tag-summary-template').html()),
    initialize: function(options) {
      this.fullWidth = options.fullWidth;
      this.allRecords = options.allRecords;
    },
    render: function() {
      this.$el.html(this.template(this.presenter()))
      return this;
    },
    presenter: function() {
      return {
        tagName: this.model.tagName,
        amount: this.recordsView().total(),
        width: this.width(),
        stateWidth: this.fullWidth,
        state: this.model.records.state()
      }
    },
    recordsView: function() {
      return new app.RecordsSummaryView({ collection: this.model.records })
    },
    width: function() {
      var percentage = this.model.records.total() / this.allRecords.total();
      var pixels = this.fullWidth * percentage;
      return pixels;
    }
  })
})(jQuery);
