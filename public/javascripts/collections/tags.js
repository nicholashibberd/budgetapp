/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var Tags = Backbone.Collection.extend({
    model: app.Tag,
    url: '/tags',
    addTagById: function(id) {
      var tag = app.Tags.findById(id);
      this.add(tag);
    },
    removeTagById: function(id) {
      var tag = this.findById(id);
      this.remove(tag);
    },
    findById: function(id) {
      return this.find(function(tag) { return tag.id == id })
    },
    unappliedTags: function() {
      var models = _.difference(app.Tags.models, this.models)
      return new Backbone.Collection(models);
    }
  });

  app.TagCollection = Tags;
  app.Tags = new Tags();
})();
