/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.TagAppView = Backbone.View.extend({
    el: '#tag-app',
    initialize: function() {
      this.$table = $('#tag-table tbody');
      this.$input = this.$table.find('tr.new-tag input');
      this.addAll();
    },
    events: {
      'click tr.new-tag button': "addTag"
    },
    addOne: function(tag) {
      var view = new app.TagRowView({model: tag});
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.find("tr:gt(0)").remove();
      app.Tags.each(this.addOne, this);
    },
    addTag: function() {
      var tagName = this.$input.val();
      if (tagName !== "") {
        app.Tags.addTag(tagName);
        this.$input.val("");
        this.addAll()
      }
    }
  })
})(jQuery);
