/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagRowView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#tag-row-template').html()),
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
  })
})(jQuery);
