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
        tagName: this.model.get('tagName'),
        amount: this.recordsView().total(),
        width: this.width(),
        stateWidth: this.fullWidth,
        state: this.model.get('records').state()
      }
    },
    recordsView: function() {
      return new app.RecordsView({
        collection: this.model.get('records')
      })
    },
    width: function() {
      var pixels = this.fullWidth * this.model.get('records').percentage();
      return pixels;
    }
  })
})(jQuery);
