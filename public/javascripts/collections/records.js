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
    }
  });

  app.Records = new Records();
})();
