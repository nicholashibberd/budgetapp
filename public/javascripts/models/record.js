/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Record = Backbone.Model.extend({
    initialize: function() {
      var tags = [];
      _.each(this.attributes.Tags, function(tag) {
        tags.push(new app.Tag(tag));
      });
      this.tags = new Backbone.Collection(tags);
    }
  });
})();
