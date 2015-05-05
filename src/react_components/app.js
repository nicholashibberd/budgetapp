/** @jsx React.DOM */

var React = require('react/addons');
var RecordList = require('./record_list');
var AccountsFilter = require('./accounts_filter');
var Budget = require('./budget');
var _ = require('underscore');
var $ = require('jquery');

var App = React.createClass({
  getInitialState: function() {
    var _this = this;
    _.each(this.props.records, function(record) {
      record.account_name = _this._getAccountName(record.account_number);
    });
    return {
      records: this.props.records,
      currentAccounts: this.australianAccounts(),
      currencySymbol: '$'
    }
  },

  australianAccounts: function() {
    return this._filterAccounts('Australia');
  },

  ukAccounts: function() {
    return this._filterAccounts('UK');
  },

  tagsSummary: function() {
    var tags = {};
    _.each(this.state.records, function(record) {
      var amount = parseInt(record.amount);
      _.each(record.tag_ids, function(tag_id) {
        if (tags[tag_id] !== undefined) {
          tags[tag_id] += amount;
        } else {
          tags[tag_id] = amount;
        }
      });

      if (record.tag_ids === undefined || !record.tag_ids.length) {
        if (tags.untagged !== undefined) {
          tags.untagged += amount;
        } else {
          tags.untagged = amount;
        }
      }
    });

    _.each(this.props.tags, function(tag) {
      if (tags[tag.id] === undefined) {
        tags[tag.id] = 0;
      }
    });
    return tags;
  },

  moneyOut: function() {
    return _.reduce(this.tagsSummary(), function(memo, tag) {
      var val = (tag < 0) ? tag : 0;
      return memo + val;
    }, 0);
  },

  moneyIn: function() {
    return _.reduce(this.tagsSummary(), function(memo, tag) {
      var val = (tag > 0) ? tag : 0;
      return memo + val;
    }, 0);
  },

  balance: function() {
    return this.moneyIn() + this.moneyOut();
  },

  updateCurrentAccounts: function(accounts) {
    var records = this._filterRecords(accounts);
    var currencySymbol = (accounts[0].region ==  'Australia') ? '$' : '£';
    this.setState({
      currentAccounts: accounts,
      records: records,
      currencySymbol: currencySymbol
    });
  },

  updateRecord: function(recordIndex, tagName) {
    var records = this.state.records.slice();
    var record = records[recordIndex];
    var tagIds;

    if (tagName !== undefined) {
      var tag = _.find(this.props.tags, function(tag) {
        return tag.Name == tagName
      })
      tagIds = [tag.id]
    } else {
      tagIds = [];
    }
    record.tag_ids = tagIds;

    this.setState({records: records});
    $.ajax({
      url: '/records/' + record.id,
      method: 'POST',
      data: JSON.stringify(record),
      contentType: 'application/json'
    })
  },

  _filterAccounts: function(region) {
    return _.filter(this.props.accounts, function(account) {
      return account.region == region;
    });
  },

  _filterRecords: function(accounts) {
    var accountIds = _.map(accounts, function(account) {
      return account.accountNumber;
    });
    return _.filter(this.props.records, function(record) {
      return _.contains(accountIds, record.account_number);
    });
  },

  _getAccountName: function(accountNumber) {
    var account = _.find(this.props.accounts, function(account) {
      return account.accountNumber == accountNumber;
    });
    return account.name;
  },

  render: function() {
    if (this.props.start_date && this.props.end_date) {
      return (
        <div>
          <div className="jumbotron">
            <div className="container">
              <AccountsFilter
                accounts={this.props.accounts}
                australianAccounts={this.australianAccounts()}
                ukAccounts={this.ukAccounts()}
                currentAccounts={this.state.currentAccounts}
                updateCurrentAccounts={this.updateCurrentAccounts}
              />
              <Budget
                budgetLines={this.props.budgetLines}
                tags={this.props.tags}
                start_date={this.props.start_date}
                end_date={this.props.end_date}
                moneyIn={this.moneyIn()}
                moneyOut={this.moneyOut()}
                balance={this.balance()}
                tagsSummary={this.tagsSummary()}
                currencySymbol={this.state.currencySymbol}
              />
            </div>
          </div>
          <div className="container">
            <RecordList
              records={this.state.records}
              tags={this.props.tags}
              updateRecord={this.updateRecord}
            />
          </div>
        </div>
      );
    } else {
      return (<div></div>);
    }
  },
});
module.exports = App;
