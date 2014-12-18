/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RuleRowView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#rule-row-template').html()),
    render: function() {
      this.$el.html(this.template(this.presenter()));
      return this;
    },
    presenter: function() {
      var presented = _.extend(this.model.toJSON(), {
        TagName: this.model.getTag().get('Name')
      })
      return presented;
    }
  })
})(jQuery);
