/** @jsx React.DOM */

var React = require('react/addons');
var RecordList = require('./record_list');
var AccountsFilter = require('./accounts_filter');
var Budget = require('./budget');

var App = React.createClass({
  renderAccountsFilter: function() {
    React.render(
      React.createElement(
        AccountsFilter, {
          accounts: window.accountsJSON
        }
      ),
      document.getElementById('accounts-container')
    )
  },

  componentDidMount: function() {
    this.renderAccountsFilter();
  },

  componentDidUpdate: function() {
    this.renderAccountsFilter();
  },

  render: function() {
    if (this.props.start_date && this.props.end_date) {
      return (
        <div>
          <Budget
            budgetLines={this.props.budgetLines}
            tags={this.props.tags}
            start_date={this.props.start_date}
            end_date={this.props.end_date}
          />
          <RecordList records={this.props.records} tags={this.props.tags} />
        </div>
      );
    } else {
      return (<div></div>);
    }
  },
});
module.exports = App;
