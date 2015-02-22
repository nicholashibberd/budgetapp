/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.RecordView = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#record-template').html()),
    render: function() {
      this.$el.html(this.template(this.presenter()));
      this.buildTagView();
      return this;
    },
    buildTagView: function() {
      var tagPopoverView = new app.TagPopoverView({collection: this.model.tags});
      this.$el.find('td.add-tag').append(tagPopoverView.render().el)
    },
    presenter: function() {
      var formattedDate = this.model.date().format('ddd Do MMM');
      var presented = _.extend(this.model.toJSON(), {
        accountName: this.model.accountName(),
        formattedDate: formattedDate,
        tags: this.model.tagsJSON()
      })
      return presented;
    }
  })
})(jQuery);
