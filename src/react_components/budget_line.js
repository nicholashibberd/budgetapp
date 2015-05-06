/** @jsx React.DOM */
var React = require('react/addons');
var _ = require('underscore');
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

  handleClick: function() {
    this.props.handleClick(this.props.data.tag_id)
  },

  positiveNegativeStatus: function() {
    var total = this.props.data.recordTotal;
    if (total > 0) {
      return 'positive-summary-bar'
    } else if (total < 0) {
      return 'negative-summary-bar'
    } else {
      return 'zero-summary-bar'
    }
  },

  budgetStatus: function() {
    var recordTotal = this.props.data.recordTotal;
    var budgetTotal = this.props.data.amount;
    if (recordTotal > budgetTotal) {
      return 'over-budget'
    } else if (recordTotal < budgetTotal) {
      return 'within-budget'
    } else {
      return 'equal-to-budget'
    }
  },

  statusClasses: function() {
    return this.positiveNegativeStatus() + ' ' + this.budgetStatus();
  },

  outerWidth: function() {
    var vals = [
      Math.abs(this.props.data.recordTotal),
      Math.abs(this.props.data.amount)
    ];
    return (this.props.maximumValue > 0) ? (_.max(vals) / this.props.maximumValue) * 100 : 0;
  },

  innerWidth: function() {
    var vals = [
      Math.abs(this.props.data.recordTotal),
      Math.abs(this.props.data.amount)
    ];
    var sortedVals = _.sortBy(vals, function(val) { return val; });
    return (sortedVals[0] / sortedVals[1]) * 100;
  },

  render: function() {
    var data = this.props.data;
    return (
      <div className="budgetLine row">
        <div className="col-md-4 col-sm-4 col-xs-7">
          <div className="input-group input-group budgetLine-budget-input">
            <span className="input-group-addon">{this.props.currencySymbol}</span>
            <span className="input-group-addon record-addon">
              {this.props.data.recordTotal}
            </span>
            <input className="form-control" onChange={this.handleChange} value={data.amount}/>
          </div>
          <div className="budgetLine-tag-name">
            <a href="#" onClick={this.handleClick}>{data.tagName}</a>
          </div>
        </div>
        <div className="summary-bar col-md-8 col-sm-8 col-xs-5">
          <div
            className={this.statusClasses() + ' summary-bar-outer'}
            style={{width: this.outerWidth() + "%"}}
          >
            <div className="summary-bar-inner" style={{width: this.innerWidth() + '%'}}></div>
          </div>
        </div>
      </div>
    );
  },
});
module.exports = BudgetLine;
