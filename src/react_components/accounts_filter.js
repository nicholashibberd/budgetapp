/** @jsx React.DOM */

var React = require('react/addons');
var _ = require('underscore');

var AccountsFilter = React.createClass({
  australianAccounts: function() {
    return this._filterAccounts('Australia');
  },

  ukAccounts: function() {
    return this._filterAccounts('UK');
  },

  _filterAccounts: function(region) {
    return _.filter(this.props.accounts, function(account) {
      return account.region == region;
    });
  },

  render: function() {
    return (
      <div className="dropdown accounts-filter">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-expanded="true">
          <span id="accounts-button-text">Accounts</span>
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
          {this.australianAccounts().map(function(account, index) {
            return <li role="presentation" className="australian-account" key={index}>
              <a role="menuitem" href="#">{account.name}</a>
            </li>
          })}
          <li role="presentation" className="australian">
            <a role="menuitem" className="all-australian-accounts" href="#">
              <strong>All Australian Accounts</strong>
            </a>
          </li>
          <li role="presentation" className="divider"></li>
          {this.ukAccounts().map(function(account, index) {
            return <li role="presentation" className="uk-account" key={index}>
              <a role="menuitem" href="#">{account.name}</a>
            </li>
          })}
          <li role="presentation" className="uk">
            <a role="menuitem" className="all-uk-accounts" href="#">
              <strong>All UK Accounts</strong>
            </a>
          </li>
        </ul>
      </div>
    );
  },
});
module.exports = AccountsFilter;
