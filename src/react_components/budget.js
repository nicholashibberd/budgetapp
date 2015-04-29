/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = require('./budget_line');
var _ = require('underscore');
var $ = require('jquery');

var Budget = React.createClass({
  getInitialState: function() {
    var _this = this;
    var budgetLines = _.map(this.props.tags, function(tag) {
      var budgetLine = _.find(_this.props.budgetLines, function(budgetLine) {
        return budgetLine.tag_id == tag.id;
      });
      var amount = budgetLine !== undefined ? budgetLine.amount : 0;
      var attrs = {
        tag_id: tag.id,
        amount: amount,
        tagName: tag.Name,
      }
      if (budgetLine !== undefined) {
        attrs.id = budgetLine.id
      }
      return attrs;
    })
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
    var budgetLines = _.map(this.state.budgetLines, function(budgetLine) {
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

  render: function() {
    var _this = this;
    return (
      <div>
        <div>
          <div className="summary-total">
            Budget: <strong className="budgetTotal">${this.state.amount}</strong>
          </div>
          <div className="summary-total">
            Money In: <strong>${this.props.moneyIn}</strong>
          </div>
          <div className="summary-total">
            Money Out: <strong>${this.props.moneyOut}</strong>
          </div>
          <div className="summary-total">
            Balance: <strong>${this.props.balance}</strong>
          </div>
        </div>
        <div className="budgetLineList">
          {this.state.budgetLines.map(function(budgetLine) {
            var tagsSummary = _this.props.tagsSummary[budgetLine.tag_id];
            return <BudgetLine
              data={budgetLine}
              key={budgetLine.tag_id}
              updateAmount={_this.updateAmount}
              tagsSummary={tagsSummary}
              moneyIn={_this.props.moneyIn}
              moneyOut={_this.props.moneyOut}
            />
          })}
          <div className="row">
            <div className="col-md-3 col-sm-4 col-xs-7">
              <div className="submitButtonCell">
                <input onClick={this.submit} className="btn btn-success submitButton" type="submit" value="Submit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
module.exports = Budget;
