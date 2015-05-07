/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = require('./budget_line');
var _ = require('underscore');
var utils = require('../utils/common');
var $ = require('jquery');

var Budget = React.createClass({
  getInitialState: function() {
    var budgetLines = this._budgetLines(this.props);
    return {
      amount: this._calculateTotal(budgetLines),
      tags: this.props.tags,
      budgetLines: budgetLines
    }
  },

  updateAmount: function(id, amount) {
    var _this = this;
    _.each(this.state.budgetLines, function(budgetLine) {
      if (budgetLine.tag_id == id) {
        budgetLine.amount = _this._isNumber(amount) ? amount : 0;
      }
    });
    this.setState({amount: this._calculateTotal(this.state.budgetLines)})
  },

  submit: function(event) {
    event.preventDefault();
    $.ajax('/budgets', {
      method: 'POST',
      data: this._budgetLinesJson()
    })
  },

  _budgetLinesJson: function() {
    var _this = this;
    var budgetLines = _.map(this._budgetLinesExcludingUntagged(), function(budgetLine) {
      var attrs = {
        start_date: _this.props.start_date,
        end_date: _this.props.end_date,
        tag_id: budgetLine.tag_id,
        amount: budgetLine.amount,
      }
      if (budgetLine.id !== undefined) {
        attrs.id = budgetLine.id
      }
      return attrs;
    });
    var data = { budgetLines: budgetLines };
    return JSON.stringify(data);
  },

  _calculateTotal: function(budgetLines) {
    var _this = this;
    return _.reduce(budgetLines, function(memo, budgetLine) {
      var val = _this._isNumber(budgetLine.amount) ? budgetLine.amount : 0
      return memo + val;
    }, 0)
  },

  _isNumber: function(n) {
    return !isNaN(parseFloat(n) && isFinite(n));
  },

  maximumValue: function() {
    var budgetLineAmounts = _.map(this.state.budgetLines, function(budgetLine) {
      return Math.abs(budgetLine.amount);
    });
    var recordTotals = _.map(this.props.tagsSummary, function(tag) {
      return Math.abs(tag);
    });
    var allValues = budgetLineAmounts.concat(recordTotals);
    return _.max(allValues);
  },

  handleShowAll: function(evt) {
    evt.preventDefault();
    this.props.handleShowAll();
  },

  _budgetLines: function(props) {
    var _this = this;
    var budgetLines = _.map(props.tags, function(tag) {
      var budgetLine = _.find(props.budgetLines, function(budgetLine) {
        return budgetLine.tag_id == tag.id;
      });
      var amount = budgetLine !== undefined ? budgetLine.amount : 0;
      var recordTotal = props.tagsSummary[tag.id];
      var attrs = {
        tag_id: tag.id,
        amount: amount,
        tagName: tag.Name,
        recordTotal: recordTotal
      }
      if (budgetLine !== undefined) {
        attrs.id = budgetLine.id
      }
      return attrs;
    })
    var sortedBudgetLines = _.sortBy(budgetLines, function(budgetLine) {
      var total = budgetLine.recordTotal
      if (total > 0) {
        return total + 200000;
      } else if (total < 0) {
        return Math.abs(total) + 100000;
      } else {
        return 0;
      }
    });
    var untaggedTotal = (props.tagsSummary['untagged'] !== undefined) ? props.tagsSummary['untagged'] : 0;
    var untagged = {
      tag_id: 'untagged',
      amount: 0,
      tagName: 'Untagged',
      recordTotal: untaggedTotal
    }
    var allBudgetLines = sortedBudgetLines.reverse().concat(untagged);
    if (!props.showAll) {
      return _.filter(allBudgetLines, function(budgetLine) {
        return budgetLine.recordTotal !== 0;
      });
    } else {
      return allBudgetLines;
    }
  },

  _budgetLinesExcludingUntagged: function() {
    return _.filter(this.state.budgetLines, function(budgetLine) {
      return budgetLine.tag_id !== 'untagged';
    });
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      budgetLines: this._budgetLines(newProps)
    })
  },

  render: function() {
    var _this = this;
    var showAll = this.props.showAll ? "" : React.createElement('a', {href: '#', onClick: this.handleShowAll}, 'Show All');
    return (
      <div>
        <div>
          <div className="summary-total">
            Budget: <strong className="budgetTotal">{utils.displayAmount(this.state.amount, this.props.currencySymbol)}</strong>
          </div>
          <div className="summary-total">
            Money In: <strong>{utils.displayAmount(this.props.moneyIn, this.props.currencySymbol)}</strong>
          </div>
          <div className="summary-total">
            Money Out: <strong>{utils.displayAmount(this.props.moneyOut, this.props.currencySymbol)}</strong>
          </div>
          <div className="summary-total">
            Balance: <strong>{utils.displayAmount(this.props.balance, this.props.currencySymbol)}</strong>
          </div>
        </div>
        <div className="budgetLineList">
          {this.state.budgetLines.map(function(budgetLine) {
            var tagsSummary = _this.props.tagsSummary[budgetLine.tag_id];
            return <BudgetLine
              data={budgetLine}
              key={budgetLine.tag_id}
              updateAmount={_this.updateAmount}
              maximumValue={_this.maximumValue()}
              currencySymbol={_this.props.currencySymbol}
              handleClick={_this.props.handleClick}
            />
          })}
          <div className="row">
            <div className="col-md-4 col-sm-4 col-xs-7">
              <div className="submitButtonCell">
                <input onClick={this.submit} className="btn btn-success submitButton" type="submit" value="Submit" />
              </div>
              {showAll}
            </div>
          </div>
        </div>
      </div>
    );
  },
});
module.exports = Budget;
