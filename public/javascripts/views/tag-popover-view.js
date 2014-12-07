/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagPopoverView = Backbone.View.extend({
    tagName: "div",
    template: _.template($('#tag-popover-template').html()),
    events: {
      'click li': 'addTag',
      'click a.remove-tag': 'removeTag'
    },
    render: function() {
      this.$el.html(this.template(this.presenter()));
      return this;
    },
    addTag: function(e) {
      var id = $(e.target).attr('id');
      this.collection.addTagById(id);
    },
    removeTag: function(e) {
      var id = $(e.target).attr('id');
      this.collection.removeTagById(id);
    },
    presenter: function() {
      return {
        models: this.collection.toJSON(),
        tags: this.collection.unappliedTags().toJSON()
      }
    }
  })
})(jQuery);
