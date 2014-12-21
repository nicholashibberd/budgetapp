/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var Records = Backbone.Collection.extend({
    model: app.Record,
    url: '/records',
    total: function() {
      return _.reduce(this.models, function(memo, model) {
        return memo + model.amount()
      }, 0)
    },
    tagsCollection: function() {
      var tags = {};
      _.each(this.models, function(record) {
        _.each(record.tags.models, function(tag) {
          if (tags[tag.get('Name')] !== undefined) {
            tags[tag.get('Name')].add(record)
          } else {
            tags[tag.get('Name')] = new app.RecordCollection([record]);
          }
        })
      });
      var tagsToArray = _.map(tags, function(records, tagName) {
        return [tagName, records];
      });
      return _.sortBy(tagsToArray, function(tagArray) {
        return tagArray[1].total();
      });
    },
    positiveRecords: function() {
      var records = _.filter(this.models, function(record) {
        return record.isPositive()
      });
      return new app.RecordCollection(records);
    },
    negativeRecords: function() {
      var records = _.filter(this.models, function(record) {
        return record.isNegative()
      });
      return new app.RecordCollection(records);
    },
    state: function() {
      var total = this.total();
      if (total > 0) return 'positive';
      if (total < 0) return 'negative';
      return 'zero'
    }
  });

  app.RecordCollection = Records;
  app.Records = new Records();
})();
