/** @jsx React.DOM */

var React = require('react/addons');
var RecordList = require('./record_list');
var AccountsFilter = require('./accounts_filter');
var Budget = require('./budget');
var _ = require('underscore');
var $ = require('jquery');
var utils = require('../utils/common');

var App = React.createClass({
  getInitialState: function() {
    var _this = this;
    _.each(this.props.records, function(record) {
      var account = _this._getAccount(record.account_number);
      record.account_name = account.name;
    });
    var state = {
      budgetLines: this.props.budgetLines
    }
    var accountsState;
    if (this.props.account !== undefined) {
      var account = this._getAccount(this.props.account);
       accountsState = this._stateCurrentAccounts([account]);
    } else if (this.props.region === 'uk') {
      var accountsState = this._stateRegionUk();
    } else {
      var accountsState = this._stateRegionAustralia();
    }
    return _.extend(state, accountsState);
  },

  australianAccounts: function() {
    return this._filterAccounts('Australia');
  },

  ukAccounts: function() {
    return this._filterAccounts('UK');
  },

  changeRegion: function() {
    this.state.region == 'australia' ? this.setRegion('uk') : this.setRegion('australia');
  },

  setRegion: function(region) {
    var _this = this;
    var state = (region == 'australia') ? this._stateRegionAustralia() : this._stateRegionUk();
    this.setState(state);
    this.setState(state, function() {
      _this._updateURL();
    });
  },

  _stateRegionAustralia: function() {
    var accounts = this.australianAccounts();
    return {
      region: 'australia',
      currentAccounts: accounts,
      records: this._filterRecordsByAccounts(accounts),
      showAll: false,
      mode: 'region'
    };
  },

  _stateRegionUk: function() {
    var accounts = this.ukAccounts();
    return {
      region: 'uk',
      currentAccounts: accounts,
      records: this._filterRecordsByAccounts(accounts),
      showAll: false,
      mode: 'region'
    };
  },

  _stateCurrentAccounts: function(accounts) {
    var records = this._filterRecordsByAccounts(accounts);
    var region = (accounts[0].region ==  'Australia') ? 'australia' : 'uk';
    return {
      region: region,
      currentAccounts: accounts,
      records: records,
      mode: 'account'
    };
  },

  submitBudgetLines: function(budgetLines) {
    this.updateBudgetLines(budgetLines);
    var data = JSON.stringify({ budgetLines: budgetLines });
    $.ajax('/budgets', {
      method: 'POST',
      data: data
    })
  },

  updateBudgetLines: function(newBudgetLines) {
    var stateBudgetLines = this.state.budgetLines;
    _.each(newBudgetLines, function(newBudgetLine) {
      stateBudgetLine = _.find(stateBudgetLines, function(stateBudgetLine) {
        return stateBudgetLine.id === newBudgetLine.id;
      });
      stateBudgetLine.amount = newBudgetLine.amount
    });
    this.setState({budgetLines: stateBudgetLines});
  },

  updateCurrentAccounts: function(accounts) {
    var _this = this;
    this.setState(this._stateCurrentAccounts(accounts), function() {
      _this._updateURL();
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

  tagsSummary: function() {
    var tags = {};
    _.each(this.state.records, function(record) {
      var amount = utils.parseAmount(record.amount);
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
    return _.filter(this.state.records, function(record) {
      if (tag_id === 'untagged') {
        return record.tag_ids === null || !record.tag_ids.length;
      } else {
        return _.contains(record.tag_ids, tag_id);
      }
    });
  },

  _getAccount: function(accountNumber) {
    return _.find(this.props.accounts, function(account) {
      return account.accountNumber == accountNumber;
    });
  },

  currencySymbol: function() {
    return this.state.region == "uk" ? "£" : "$"
  },

  _updateURL: function() {
    history.pushState(null, null, this._stateToQuery());
  },

  _stateToQuery: function() {
    var urlParts =  {
      start_date: this.props.start_date,
      end_date: this.props.end_date
    }
    if (this.state.mode == 'account') {
      urlParts.account = this.state.currentAccounts[0].accountNumber;
    } else {
      urlParts.region = this.state.region;
    }
    return "/?" + $.param(urlParts);
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
                budgetLines={this.state.budgetLines}
                tags={this.props.tags}
                start_date={this.props.start_date}
                end_date={this.props.end_date}
                moneyIn={this.moneyIn()}
                moneyOut={this.moneyOut()}
                balance={this.balance()}
                tagsSummary={this.tagsSummary()}
                currencySymbol={this.currencySymbol()}
                handleClick={this.handleClick}
                showAll={this.state.showAll}
                handleShowAll={this.handleShowAll}
                region={this.state.region}
                submitBudgetLines={this.submitBudgetLines}
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
