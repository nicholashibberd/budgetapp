/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var TagsCollection = Backbone.Collection.extend({
    positiveTags: function() {
      var taggroups = _.filter(this.models, function(taggroup) {
        return taggroup.get('records').total() > 0;
      });
      return new app.TagsCollection(taggroups)
    },
    negativeTags: function() {
      var taggroups = _.filter(this.models, function(taggroup) {
        return taggroup.get('records').total() < 0;
      });
      return new app.TagsCollection(taggroups)
    },
    positiveRecords: function() {
      var records = _.map(this.positiveTags().models, function(tagGroup) {
        return tagGroup.get('records').models
      });
      records = _.flatten(records);
      return new app.RecordCollection(records);
    },
    negativeRecords: function() {
      var records = _.map(this.negativeTags().models, function(tagGroup) {
        return tagGroup.get('records').models
      });
      records = _.flatten(records);
      return new app.RecordCollection(records);
    },
    records: function() {
      var records = _.map(this.models, function(tagGroup) {
        return tagGroup.get('records').models
      });
      var records = _.flatten(records);
      return new app.RecordCollection(records);
    }
  });
  app.TagsCollection = TagsCollection;
})();
