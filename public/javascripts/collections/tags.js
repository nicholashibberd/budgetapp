/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var Tags = Backbone.Collection.extend({
    model: app.Tag,
    initialize: function() {
      this.comparator = function(model) {
        return model.get('Name');
      }
    },
    url: '/tags',
    addTag: function(tagName) {
      var tag = new this.model({Name: tagName});
      this.add(tag);
      tag.save();
    },
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
    getByName: function(name) {
      return this.find(function(tag) { return tag.get('Name') == name })
    },
    unappliedTags: function() {
      var models = _.difference(app.Tags.models, this.models)
      return new Backbone.Collection(models);
    },
    selectTags: function(selectedVal) {
      this.selectedTags = selectedVal;
      this.trigger('selection', selectedVal);
    },
    getSelectedTags: function() {
      if (this.selectedTags !== undefined) {
        return this.selectedTags
      } else {
        return "all"
      }
    },
  });

  app.TagCollection = Tags;
  app.Tags = new Tags();
})();
