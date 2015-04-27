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
      currentAccounts: this.australianAccounts()
    }
  },

  australianAccounts: function() {
    return this._filterAccounts('Australia');
  },

  ukAccounts: function() {
    return this._filterAccounts('UK');
  },

  updateCurrentAccounts: function(accounts) {
    var records = this._filterRecords(accounts);
    this.setState({
      currentAccounts: accounts,
      records: records
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
