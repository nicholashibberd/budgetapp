/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagsSummaryView = Backbone.View.extend({
    initialize: function() {
      this.fullWidth = this.$el.find('.tag-summary-column').width();
      this.$summary = this.$el.find('h2 span');
      this.$table = this.$el.find('.tag-summary-table')
      this.setup();
      this.listenTo(this.collection, 'change', this.setup)
    },
    addOne: function(tagSummary) {
      var view = new app.TagSummaryView({
        model: tagSummary,
        fullWidth: this.fullWidth,
        allRecords: this.collection
      });
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.html('')
      var view = this;
      _.each(this.collection.tagsCollection(), function(tagsArray) {
        var tagSummary = {tagName: tagsArray[0], records: tagsArray[1]}
        view.addOne(tagSummary);
      })
    },
    setup: function() {
      this.addAll();
      new app.RecordsSummaryView({
        collection: this.collection,
        el: this.$summary
      }).render()
    }
  })
})(jQuery);
