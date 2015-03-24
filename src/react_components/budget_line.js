/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = React.createClass({
  handleChange: function(event) {
    var amount = parseInt(event.target.value);
    this.props.updateAmount(this.props.data.tag_id, amount)
  },

  getInitialState: function() {
    return {
      amount: 0
    }
  },

  render: function() {
    var data = this.props.data;
    return (
      <tr className="budgetLine">
        <td>{data.tagName}</td>
        <td><input onChange={this.handleChange} value={data.amount}/></td>
      </tr>
    );
  },
});
module.exports = BudgetLine;
