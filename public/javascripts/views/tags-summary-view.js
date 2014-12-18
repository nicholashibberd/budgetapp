/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagsSummaryView = Backbone.View.extend({
    initialize: function() {
      this.fullWidth = this.$el.width();
      this.$summary = this.$el.find('h2 span')
      this.addAll();
      new app.RecordsSummaryView({
        collection: this.collection,
        el: this.$summary
      }).render()
    },
    addOne: function(tagSummary) {
      var view = new app.TagSummaryView({
        model: tagSummary,
        fullWidth: this.fullWidth,
        allRecords: this.collection
      });
      this.$el.append(view.render().el);
    },
    addAll: function() {
      var view = this;
      _.each(this.collection.tagsCollection(), function(records, tagName) {
        var tagSummary = {tagName: tagName, records: records}
        view.addOne(tagSummary);
      })
    },
  })
})(jQuery);
