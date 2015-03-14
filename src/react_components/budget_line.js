/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = React.createClass({
  render: function() {
    var data = this.props.data;
    return (
      <tr className="budgetLine">
        <td>{data.tagName}</td>
        <td><input /></td>
      </tr>
    );
  },
});
module.exports = BudgetLine;
