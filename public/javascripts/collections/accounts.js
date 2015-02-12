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
      var selected, description;
      if (selectedVal == 'all_australian') {
        selected = this.getByRegion('Australia');
        description = 'All Australian Accounts'
      } else if (selectedVal == 'all_uk') {
        selected = this.getByRegion('UK')
        description = 'All UK Accounts'
      }
      else {
        var account = this.getByAccountNumber(selectedVal)
        selected = [account];
        description = account.get('name')
      }
      this.selectedAccounts = selected;
      this.accountsDescription = description;
      this.trigger('selection')
    },
    getAccountsDescription: function() {
      return this.accountsDescription
    },
    getSelectedRecords: function() {
      var accountNumbers = _.map(this.getSelectedAccounts(), function(account) {
        return account.get('accountNumber');
      });
      var records = _.filter(app.Records.models, function(record) {
        return accountNumbers.indexOf(record.get('account_number')) !== -1
      });
      return new app.RecordCollection(records);
    }
  });

  app.Accounts = new Accounts();
})();
