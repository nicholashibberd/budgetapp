/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordFormView = Backbone.View.extend({
    template: _.template($('#record-form-template').html()),
    initialize: function() {
      this.$table = function() {
        return this.$el.find('ul#tag-list');
      };
      this.$input = function() {
        return this.$el.find('#new-tag');
      };
    },
    events: {
      'keypress #new-tag': 'createOnEnter',
      'click button.save': 'save',
      'click a.add-tag': 'addTag',
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.addAll();
      return this;
    },
    addOne: function(tag) {
      var view = new app.TagView({model: tag });
      this.$table().append(view.render().el);
    },
    addAll: function() {
      app.Tags.each(this.addOne, this);
    },
    createOnEnter: function(e) {
      if (e.which === ENTER_KEY && this.$input().val().trim()) {
        this.model.tags.push(this.newTag());
        this.model
        this.$input().val('');
      }
    },
    newTag: function() {
      return new app.Tag({
        Name: this.$input().val().trim()
      });
    },
    addTag: function(e) {
      e.preventDefault()
      var id = $(e.target).attr('id')
      this.model.addTag(id)
    },
    save: function() {
      this.model.save({}, {
        success: function() {
          console.log('successfully saved!')
        }
      })
    },
  })
})(jQuery);
