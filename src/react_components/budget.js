/** @jsx React.DOM */

var React = require('react/addons');
var BudgetLine = require('./budget_line');

var Budget = React.createClass({
  getInitialState: function() {
    return {
      total: 0
    }
  },

  render: function() {
    var tags = this.props.tags;
    return (
      <div>
        <table className="budgetLineList table table-striped">
          <thead>
            <tr>
              <th>Total</th>
              <th className="budgetTotal">£{this.state.total}</th>
            </tr>
          </thead>
          {tags.map(function(tag) {
            var data = {tagName: tag.Name, id: tag.id}
            return <BudgetLine data={data} key={tag.id}/>
          })}
        </table>
      </div>
    );
  },
});
module.exports = Budget;
