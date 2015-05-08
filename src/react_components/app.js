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
    var accounts = this.australianAccounts();
    return {
      region: 'australia',
      records: this._filterRecordsByAccounts(accounts),
      currentAccounts: accounts,
      currencySymbol: '$',
      showAll: true
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

      if (!record.tag_ids || !record.tag_ids.length) {
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
    var records = this._filterRecordsByAccounts(accounts);
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

  changeRegion: function() {
    var region = this.state.region == 'australia' ? 'uk' : 'australia'
    this.setState({region: region});
  },

  handleClick: function(tag_id) {
    var records = this._filterRecordsByTag(tag_id);
    this.setState({
      records: records,
      showAll: false
    });
  },

  handleShowAll: function() {
    this.setState({
      records: this.props.records,
      showAll: true
    });
  },

  _filterAccounts: function(region) {
    return _.filter(this.props.accounts, function(account) {
      return account.region == region;
    });
  },

  _filterRecordsByAccounts: function(accounts) {
    var accountIds = _.map(accounts, function(account) {
      return account.accountNumber;
    });
    return _.filter(this.props.records, function(record) {
      return _.contains(accountIds, record.account_number);
    });
  },

  _filterRecordsByTag: function(tag_id) {
    return _.filter(this.props.records, function(record) {
      if (tag_id === 'untagged') {
        return record.tag_ids === null || !record.tag_ids.length;
      } else {
        return _.contains(record.tag_ids, tag_id);
      }
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
                region={this.state.region}
                changeRegion={this.changeRegion}
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
                handleClick={this.handleClick}
                showAll={this.state.showAll}
                handleShowAll={this.handleShowAll}
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
