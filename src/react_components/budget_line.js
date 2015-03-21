/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = React.createClass({
  handleChange: function(event) {
    var total = parseInt(event.target.value);
    this.props.updateTotal(this.props.data.tagId, total)
  },

  getInitialState: function() {
    return {
      total: 0
    }
  },

  render: function() {
    var data = this.props.data;
    return (
      <tr className="budgetLine">
        <td>{data.tagName}</td>
        <td><input onChange={this.handleChange} value={data.total}/></td>
      </tr>
    );
  },
});
module.exports = BudgetLine;
