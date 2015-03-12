/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = React.createClass({
  render: function() {
    var data = this.props.data;
    return (
      <div className="budgetLine">
        {data.tagName}
      </div>
    );
  },
});
module.exports = BudgetLine;
