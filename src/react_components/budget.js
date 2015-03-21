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
        return budgetLine.tagId == tag.id;
      });
      var total = budgetLine !== undefined ? budgetLine.total : 0;
      return {
        tagId: tag.id,
        total: total,
        tagName: tag.name,
      }
    })
    return {
      total: this._calculateTotal(budgetLines),
      tags: this.props.tags,
      budgetLines: budgetLines
    }
  },

  updateTotal: function(id, total) {
    _.each(this.state.budgetLines, function(budgetLine) {
      if (budgetLine.tagId == id) {
        budgetLine.total = total
      }
    });
    this.setState({total: this._calculateTotal(this.state.budgetLines)})
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
      return {
        start_date: _this.props.start_date,
        end_date: _this.props.end_date,
        tag_id: budgetLine.tagId,
        amount: budgetLine.total.toString(),
      }
    });
    var data = { budgetLines: budgetLines };
    return JSON.stringify(data);
  },

  _calculateTotal: function(budgetLines) {
    var _this = this;
    return _.reduce(budgetLines, function(memo, budgetLine) {
      var val = _this._isNumber(budgetLine.total) ? budgetLine.total : 0
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
        <table className="budgetLineList table table-striped">
          <thead>
            <tr>
              <th>Total</th>
              <th className="budgetTotal">£{this.state.total}</th>
            </tr>
          </thead>
          {this.state.budgetLines.map(function(budgetLine) {
            return <BudgetLine data={budgetLine} key={budgetLine.tagId} updateTotal={_this.updateTotal}/>
          })}
        </table>
        <div>
          <input onClick={this.submit} className="btn btn-success submitButton" type="submit" value="Submit" />
        </div>
      </div>
    );
  },
});
module.exports = Budget;
