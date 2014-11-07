/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Record = Backbone.Model.extend({
    initialize: function() {
      this.tags = new Backbone.Collection(this.get('tags'));
      this.listenTo(this.tags, 'add', this.addTag)
    },
    addTag: function(e) {
      var attrs = _.map(this.tags.models, function(m) {
        return m.attributes
      });
      this.set('tags', attrs);
    }
  });
})();
