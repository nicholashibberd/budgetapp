/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Tag = Backbone.Model.extend({
    // summary: function() {
    //   return {
    //     tag: this,
    //     records: this.getRecords()
    //   }
    // },
    // getRecords: function() {
    //   var tag = this;
    //   var records = _.filter(app.Records.models, function(record) {
    //     return _.contains(record.tags.models, tag)
    //   });
    //   return new app.RecordCollection(records)
    // }
  });
})();
