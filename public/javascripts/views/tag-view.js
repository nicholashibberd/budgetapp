/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#tag-template').html()),
    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },
    events: {
      "click .destroy": "clear",
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    updateOnEnter: function(e) {
      if (e.which === ENTER_KEY) {
        console.log('ENTER key pressed');
        this.close();
      }
    },
    clear: function(e) {
      this.model.destroy();
    },
    presenter: function() {
      this.model.toJSON()
    }
  })
})(jQuery);
