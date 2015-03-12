/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = require('./budget_line');

var Budget = React.createClass({
  render: function() {
    var tags = this.props.tags;
    return (
      <div className="budgetLineList">
        {tags.map(function(tag) {
          var data = {tagName: tag.Name, id: tag.id}
          return <BudgetLine data={data} key={tag.id}/>
        })}
      </div>
    );
  },
});
module.exports = Budget;
