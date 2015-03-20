/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = require('./budget_line');
var _ = require('underscore');
var $ = require('jquery');

var Budget = React.createClass({
  getInitialState: function() {
    return {
      total: 0,
      tags: this.props.tags
    }
  },

  updateTotal: function(id, total) {
    _.each(this.state.tags, function(tag) {
      if (tag.id == id) {
        tag.total = total
      }
    });
    this.setState({total: this._calculateTotal()})
  },

  submit: function(event) {
    event.preventDefault();
    var budgetLines = {
      budgetLines: [
        {
          start_date: "12/07/2015",
          end_date: "25/12/2015",
          tag_id: 123,
          amount: "123",
        },
        {
          start_date: "10/01/2015",
          end_date: "24/01/2015",
          tag_id: 456,
          amount: "456",
        }
      ]
    }
    $.ajax('/budgets', {
      method: 'POST',
      // data: JSON.stringify(this.state.tags)
      data: JSON.stringify(budgetLines)
    })
  },

  _calculateTotal: function() {
    var _this = this;
    return _.reduce(this.state.tags, function(memo, tag) {
      var val = _this._isNumber(tag.total) ? tag.total : 0
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
          {this.state.tags.map(function(tag) {
            var data = {tagName: tag.Name, id: tag.id}
            return <BudgetLine data={data} key={tag.id} updateTotal={_this.updateTotal}/>
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
