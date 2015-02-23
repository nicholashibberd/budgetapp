/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagsSummaryView = Backbone.View.extend({
    initialize: function() {
      this.fullWidth = this.$el.find('.tag-summary-column').width();
      this.$table = this.$el.find('.tag-summary-table')
      this.$show_all_tags = this.$el.find('#show-all-tags');
      this.render();
      this.$show_all_tags.hide();
      this.listenTo(app.Tags, 'selection', this.showTagsLink)
    },
    events: {
      "click a#show-all-tags": "show_all_tags"
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
    render: function() {
      app.positiveTags = this.collection.positiveTags();
      app.negativeTags = this.collection.negativeTags();
      app.positiveRecords = this.collection.positiveRecords();
      app.negativeRecords = this.collection.negativeRecords();
      this.addAll();
    },
    show_all_tags: function(e) {
      e.preventDefault();
      app.Tags.selectTags("all");
    },
    showTagsLink: function(selectedVal) {
      if (selectedVal == "all") {
        this.$show_all_tags.hide();
      } else {
        this.$show_all_tags.show();
      }
    }
  })
})(jQuery);
