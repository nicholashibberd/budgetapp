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

  positiveNegativeStatus: function() {
    var total = this.props.tagsSummary.recordTotal;
    if (total > 0) {
      return 'positive'
    } else if (total < 0) {
      return 'negative'
    } else {
      return 'zero'
    }
  },

  width: function() {
    var recordTotal = this.props.tagsSummary.recordTotal;
    var percentage
    if (recordTotal > 0) {
      percentage = (recordTotal / this.props.moneyIn) * 100;
    } else if (recordTotal < 0) {
      var val = (recordTotal / this.props.moneyOut) * 100;
      percentage = Math.abs(val);
    } else {
      percentage = 0;
    }
    return percentage + '%';
  },

  render: function() {
    var data = this.props.data;
    return (
      <div className="budgetLine row">
        <div className="col-md-3 col-sm-4 col-xs-7">
          <div className="input-group input-group budgetLine-budget-input">
            <span className="input-group-addon" id="sizing-addon1">£</span>
            <input className="form-control" onChange={this.handleChange} value={data.amount}/>
          </div>
          <div className="budgetLine-tag-name">{data.tagName}</div>
        </div>
        <div className="budgetLine-summary-bar col-md-9 col-sm-8 col-xs-5">
          <div className={this.positiveNegativeStatus() + '-summary-bar'} style={{width: '100%'}}>
            <div className="tag-summary-bar" style={{width: this.width()}}></div>
          </div>
        </div>
      </div>
    );
  },
});
module.exports = BudgetLine;
