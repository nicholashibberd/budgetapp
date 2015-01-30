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
    getByAccountNumber: function(no) {
      return _.find(this.models, function(account) {
        return account.get('accountNumber') == no;
      });
    },
    getByRegion: function(region) {
      return _.filter(this.models, function(account) {
        return account.get('region') == region;
      });
    },
    getSelectedAccounts: function() {
      if (this.selectedAccounts !== undefined) {
        return this.selectedAccounts;
      } else {
        return this.getByRegion('Australia');
      }
    },
    selectAccounts: function(selectedVal) {
      var selected;
      if (selectedVal == 'all_australian') {
        selected = this.getByRegion('Australia');
      } else if (selectedVal == 'all_uk') {
        selected = this.getByRegion('UK')
      }
      else {
        var account = this.getByAccountNumber(selectedVal)
        selected = [account];
      }
      this.selectedAccounts = selected;
    }
  });

  app.Accounts = new Accounts();
})();
