/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = require('./budget_line');
var _ = require('underscore');

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
      </div>
    );
  },
});
module.exports = Budget;
