/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.AccountsView = Backbone.View.extend({
    el: '#account-controls .dropdown',
    initialize: function() {
      this.$australianLinks = this.$el.find('li.australian');
      this.$ukLinks = this.$el.find('li.uk');
      this.setup();
    },
    events: {
      'click a[role=menuitem]': "handleSelect"
    },
    setup: function() {
      var view = this;
      _.each(this.collection.getByRegion('Australia'), function(account) {
        var link = '<li role="presentation" class="australian">' +
        '<a role="menuitem" id="' + account.get('accountNumber')  + '"tabindex="-1" href="#">'+ account.get('name') +'</a>' +
        '</li>';
        view.$australianLinks.after(link)
      });
      _.each(this.collection.getByRegion('UK'), function(account) {
        var link = '<li role="presentation" class="uk">' +
        '<a role="menuitem" tabindex="-1" href="#">'+ account.get('name') +'</a>' +
        '</li>';
        view.$ukLinks.after(link)
      });
    },
    handleSelect: function(e) {
      e.preventDefault();
      var selectedVal = $(e.target).closest('a').attr('id');
      this.collection.selectAccounts(selectedVal);
    }
  })
})(jQuery);
