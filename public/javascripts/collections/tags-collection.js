/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var TagsCollection = Backbone.Collection.extend({
    positiveTags: function() {
      return _.filter(this.models, function(tagGroup) {
        return tagGroup.get('records').total() > 0;
      });
    },
    positiveRecords: function() {
      var records = _.map(this.positiveTags(), function(tagGroup) {
        return tagGroup.get('records').models
      });
      records = _.flatten(records);
      return new app.RecordCollection(records);
    },
    negativeTags: function() {
      return _.filter(this.models, function(tagGroup) {
        return tagGroup.get('records').total() < 0;
      });
    },
    negativeRecords: function() {
      var records = _.map(this.negativeTags(), function(tagGroup) {
        return tagGroup.get('records').models
      });
      records = _.flatten(records);
      return new app.RecordCollection(records);
    }
  });
  app.TagsCollection = TagsCollection;
})();
