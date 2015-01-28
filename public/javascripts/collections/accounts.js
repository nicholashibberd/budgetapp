/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  var Accounts = Backbone.Collection.extend({
    model: app.Account,
    url: '/accounts',
    addAccount: function(accountNo, name, region) {
      var account = new this.model({
        accountNumber: accountNo,
        name: name,
        region: region
      });
      this.add(account);
      account.save();
    },
  });

  app.Accounts = new Accounts();
})();
