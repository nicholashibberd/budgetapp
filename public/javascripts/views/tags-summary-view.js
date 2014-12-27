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
      this.listenTo(app.Records, 'change', this.setup)
    },
    addOne: function(tagGroup) {
      var view = new app.TagSummaryView({
        model: tagGroup,
        fullWidth: this.fullWidth,
        allRecords: new app.RecordCollection(this.collection.records())
      });
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.html('')
      var view = this;
      _.each(this.collection.models, function(tagGroup) {
        view.addOne(tagGroup);
      })
    },
    rebuildCollection: function() {
      this.collection = app.Records.tagsCollection();
    },
    setup: function() {
      this.rebuildCollection();
      app.positiveTags = this.collection.positiveTags();
      app.negativeTags = this.collection.negativeTags();
      app.positiveRecords = this.collection.positiveRecords();
      app.negativeRecords = this.collection.negativeRecords();
      this.addAll();
      new app.RecordsSummaryView({
        collection: this.collection.records(),
        el: this.$summary
      }).render()
    }
  })
})(jQuery);
