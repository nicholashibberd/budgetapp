/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RuleAppView = Backbone.View.extend({
    el: '#rule-app',
    initialize: function() {
      this.$table = $('#rule-table tbody');
      this.$input = this.$table.find('tr.new-rule input');
      this.$select = this.$table.find('tr.new-rule select');
      this.addAll();
      this.addTagsToSelect();
    },
    events: {
      'click tr.new-rule button': "addRule"
    },
    addOne: function(rule) {
      var view = new app.RuleRowView({model: rule});
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.find("tr:gt(0)").remove();
      app.Rules.each(this.addOne, this);
    },
    addRule: function() {
      var matchText = this.$input.val();
      var tagId = this.$select.val();
      if (matchText !== "") {
        app.Rules.addRule(matchText, tagId);
        this.$input.val("");
        this.addAll()
      }
    },
    addTagsToSelect: function() {
      var view = this;
      _.each(app.Tags.models, function(tag) {
        var option = "<option value='"+ tag.id + "'>" + tag.get('Name') + "</option>"
        view.$select.append(option);
      });
    }
  })
})(jQuery);
