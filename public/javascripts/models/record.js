/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Record = Backbone.Model.extend({
    initialize: function() {
      this.buildTagCollection();
      this.listenTo(this.tags, 'add', this.addTagId)
      this.listenTo(this.tags, 'destroy', this.removeTagId)
    },
    addTag: function(id) {
      this.set({
        tag_ids: this.get('tag_ids').concat(id)
      })
      this.tags.rebuildCollection();
    },
    addTagId: function(e) {
      var attrs = _.map(this.tags.models, function(m) {
        return m.attributes
      });
      this.set('tags', attrs);
    },
    removeTagId: function(e) {
      var attrs = _.map(this.tags.models, function(m) {
        return m.attributes
      });
      this.set('tags', attrs);
    },
    buildTagCollection: function() {
      var tags = _.map(this.get('tag_ids'), function(id) {
        return app.Tags.findById(id)
      })
      this.tags = new app.TagCollection(tags);
      this.tags.record = this;

    },
    tagsJSON: function() {
      return _.map(this.tags.models, function(tag) {
        return tag.toJSON();
      })
    }
  });
})();
