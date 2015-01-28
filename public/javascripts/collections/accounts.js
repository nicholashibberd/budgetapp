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
    getByRegion: function(region) {
      return _.filter(this.models, function(account) {
        return account.get('region') == region;
      });
    },
  });

  app.Accounts = new Accounts();
})();
