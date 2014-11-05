/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var Records = Backbone.Collection.extend({
    model: app.Record,
    url: '/records',
  });

  app.Records = new Records();
})();
