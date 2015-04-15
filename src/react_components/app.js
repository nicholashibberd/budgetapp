/** @jsx React.DOM */

var React = require('react/addons');
var RecordList = require('./record_list');
var AccountsFilter = require('./accounts_filter');
var Budget = require('./budget');
var _ = require('underscore');

var App = React.createClass({
  getInitialState: function() {
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
    this.setState({ currentAccounts: accounts });
  },

  _filterAccounts: function(region) {
    return _.filter(this.props.accounts, function(account) {
      return account.region == region;
    });
  },

  render: function() {
    if (this.props.start_date && this.props.end_date) {
      return (
        <div>
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
          <RecordList records={this.state.records} tags={this.props.tags} />
        </div>
      );
    } else {
      return (<div></div>);
    }
  },
});
module.exports = App;
