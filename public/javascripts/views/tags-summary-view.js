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
    addOne: function(tagGroup) {
      var view = new app.TagSummaryView({
        model: tagGroup,
        fullWidth: this.fullWidth,
        allRecords: this.collection
      });
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.html('')
      var view = this;
      _.each(this.collection.tagsCollection().models, function(tagGroup) {
        // var tagSummary = {tagName: tagsArray.get('0'), records: tagsArray.get('1')}
        view.addOne(tagGroup);
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
