/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#record-template').html()),
    initialize: function() {
    },
    events: {
      'click button.add-tag': "addTag"
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    addTag: function() {
      var modal = new app.ModalView();
      this.$el.find('td.add-tag').append(modal.render().el);
      var recordFormView = new app.RecordFormView({model: this.model});
      modal.setContent(recordFormView.render().el)
    }
  })
})(jQuery);
