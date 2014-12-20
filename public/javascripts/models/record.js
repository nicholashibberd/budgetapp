/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Record = Backbone.Model.extend({
    initialize: function() {
      this.buildTagCollection();
      this.listenTo(this.tags, 'add', this.updateTagIds)
      this.listenTo(this.tags, 'remove', this.updateTagIds)
    },
    buildTagCollection: function() {
      var tags = _.map(this.get('tag_ids'), function(id) {
        return app.Tags.findById(id)
      })
      this.tags = new app.TagCollection(tags);
    },
    tagsJSON: function() {
      return _.map(this.tags.models, function(tag) {
        return tag.toJSON();
      })
    },
    updateTagIds: function() {
      var tag_ids = _.map(this.tags.models, function(tag) { return tag.id });
      this.set({ tag_ids: tag_ids });
      this.save();
      this.trigger("change")
    },
    amount: function() {
      return parseFloat(this.get('amount'));
    },
    isPositive: function() {
      return this.amount() > 0;
    },
    isNegative: function() {
      return this.amount() < 0;
    }
  });
})();
