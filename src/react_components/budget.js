/** @jsx React.DOM */

var React = require('react/addons');
var Budget = React.createClass({
  render: function() {
    var tags = this.props.tags;
    return (
      <div className="budgetLineList">
        {tags.map(function(tag) {
          return <div className="budget-line" key={tag.id}>{tag.Name}</div>
        })}
      </div>
    );
  },
});
module.exports = Budget;
