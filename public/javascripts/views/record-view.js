/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#record-template').html()),
    events: {
      'click button.add-tag': "addTag"
    },
    render: function() {
      this.$el.html(this.template(this.presenter()));
      this.buildTagView();
      return this;
    },
    addTag: function() {
      var modal = new app.ModalView();
      this.$el.find('td.add-tag').append(modal.render().el);
      modal.setContent(recordFormView.render().el)
    },
    buildTagView: function() {
      var tagPopoverView = new app.TagPopoverView({collection: this.model.tags});
      this.$el.find('td.add-tag').append(tagPopoverView.render().el)
    },
    presenter: function() {
      var formattedDate = moment(this.model.get('date')).format('ddd Do MMM');
      var presented = _.extend(this.model.toJSON(), {
        formattedDate: formattedDate,
        tags: this.model.tagsJSON()
      })
      return presented;
    }
  })
})(jQuery);
