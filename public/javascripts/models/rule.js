/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Rule = Backbone.Model.extend({
    getTag: function() {
      if (this.tag !== undefined) return this.tag;
      this.tag = app.Tags.findById(this.get('tagId'));
      return this.tag
    }
  });
})();
