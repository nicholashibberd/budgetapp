/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.AccountAppView = Backbone.View.extend({
    el: '#account-app',
    initialize: function() {
      this.$table = $('#account-table tbody');
      this.$nameInput = this.$table.find('tr.new-account input#name');
      this.$accountNoInput = this.$table.find('tr.new-account input#account-no');
      this.$select = this.$table.find('tr.new-account select');
      this.addAll();
    },
    events: {
      'click tr.new-account button': "addAccount",
    },
    addOne: function(account) {
      var view = new app.AccountRowView({model: account});
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.find("tr:gt(0)").remove();
      app.Accounts.each(this.addOne, this);
    },
    addAccount: function() {
      var accountNo = this.$accountNoInput.val();
      var name = this.$nameInput.val();
      var region = this.$select.val();
      if (accountNo !== "" && name !== "") {
        app.Accounts.addAccount(accountNo, name, region);
        this.$nameInput.val("");
        this.$accountNoInput.val("");
        this.addAll()
      }
    },
  })
})(jQuery);
