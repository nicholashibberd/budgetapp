/*global Backbone */
var app = app || {};

(function () {
  'use strict';

  app.Filter = Backbone.Model.extend({
    getRecords: function() {
      var accounts = app.Accounts.getSelectedAccounts();
      var tags = app.Tags.getSelectedTags();
      var records = app.Records.models;
      var accountNumbers = _.map(accounts, function(account) {
        return account.get('accountNumber');
      });
      var records = _.filter(records, function(record) {
        var hasTag = true;
        if (tags !== "all") {
          var hasTag = _.find(record.tags.models, function(tag) {
            return tag.get('Name') == tags;
          });
        }
        var belongsToAccount = accountNumbers.indexOf(record.get('account_number')) !== -1
        return hasTag && belongsToAccount
      });
      return new app.RecordCollection(records);
    }
  });
})();
