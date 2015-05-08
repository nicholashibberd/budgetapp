/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var AccountsFilter = React.createClass({
  selectAccount: function(id) {
    var account = this._findAccount(id);
    this.props.updateCurrentAccounts([account]);
  },

  selectAll: function(region) {
    var currentAccounts = (region == 'Australia') ? this.props.australianAccounts : this.props.ukAccounts;
    this.props.updateCurrentAccounts(currentAccounts);
  },

  displayText: function() {
    if (this._allAustralianAccountsSelected()) {
      return 'All Australian Accounts';
    } else if (this._allUKAccountsSelected()) {
      return 'All UK Accounts';
    } else {
      var account = this.props.currentAccounts[0];
      return account.name;
    }
  },

  _allAustralianAccountsSelected: function() {
    return _.isEqual(
      this.props.currentAccounts, this.props.australianAccounts
    );
  },

  _allUKAccountsSelected: function() {
    return _.isEqual(
      this.props.currentAccounts, this.props.ukAccounts
    );
  },

  _findAccount: function(id) {
    return _.find(this.props.accounts, function(account) {
      return account.id == id;
    })
  },

  render: function() {
    var _this = this;
    return (
      <div className="dropdown accounts-filter btn-group">
        <button
          onClick={this.props.changeRegion}
          className="btn btn-default btn-lg"
          type="button">
          <img src={"/images/" + this.props.region + "_flag.gif"} className="flag" />
        </button>
        <button className="btn btn-default btn-lg dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
          <span className="accounts-button-text">{this.displayText()}</span>
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          {this.props.australianAccounts.map(function(account, index) {
            return <li role="presentation" className="australian-account" key={index}>
              <a role="menuitem" href="#" onClick={_this.selectAccount.bind(null, account.id)}>{account.name}</a>
            </li>
          })}
          <li role="presentation" className="australian">
            <a role="menuitem" className="all-australian-accounts" href="#" onClick={this.selectAll.bind(null, 'Australia')}>
              <strong>All Australian Accounts</strong>
            </a>
          </li>
          <li role="presentation" className="divider"></li>
          {this.props.ukAccounts.map(function(account, index) {
            return <li role="presentation" className="uk-account" key={index}>
              <a role="menuitem" href="#" onClick={_this.selectAccount.bind(null, account.id)}>{account.name}</a>
            </li>
          })}
          <li role="presentation" className="uk">
            <a role="menuitem" className="all-uk-accounts" href="#" onClick={this.selectAll.bind(null, 'UK')}>
              <strong>All UK Accounts</strong>
            </a>
          </li>
        </ul>
      </div>
    );
  },
});
module.exports = AccountsFilter;
