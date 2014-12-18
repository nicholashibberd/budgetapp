/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var Rules = Backbone.Collection.extend({
    model: app.Rule,
    url: '/rules',
    addRule: function(matchText, tagId) {
      var tagIdInt = parseInt(tagId);
      var rule = new this.model({matchText: matchText, tagId: tagIdInt});
      this.add(rule);
      rule.save();
    },
  });

  app.Rules = new Rules();
})();
