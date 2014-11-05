/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.ModalView = Backbone.View.extend({
    template: _.template($('#modal-template').html()),
    initialize: function() {
    },
    render: function() {
      this.$el.html(this.template());
      this.$el.find('.modal').modal("show");
      return this;
    },
    setContent: function(html) {
      this.$el.find('.modal-content').append(html);
    }
  })
})(jQuery);
