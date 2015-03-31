/** @jsx React.DOM */

var React = require('react/addons');
var moment = require('moment');
var DATE_FORMAT = "DD/MM/YYYY";
var CAL_DATE_FORMAT = "D MMM, YYYY";
var DatePicker = React.createClass({
  getInitialState: function() {
    return {
      startDate: moment(this.props.startDate, DATE_FORMAT),
      endDate: moment(this.props.endDate, DATE_FORMAT),
    };
  },

  loadStartDatePicker: function() {
    window.startDatePicker.open();
  },

  loadEndDatePicker: function() {
    window.endDatePicker.open();
  },

  setStartDate: function(e) {
    this.state.startDate = moment(e.target.value, CAL_DATE_FORMAT);
  },

  setEndDate: function(e) {
    this.state.endDate = moment(e.target.value, CAL_DATE_FORMAT);
  },

  render: function() {
    return (
      <form className="navbar-form navbar-right" role="form" action="/budget">
        <div className="form-group">
          <input
            name="start_date"
            className="form-control js-start-date"
            onClick={this.loadStartDatePicker}
            onChange={this.setStartDate}
          />
        </div>
        <div className="form-group">
          <input
            name="end_date"
            className="form-control js-end-date"
            onClick={this.loadEndDatePicker}
            onChange={this.setEndDate}
          />
        </div>
        <button type="submit" className="btn btn-primary">Go</button>
      </form>
    );
  },
});
module.exports = DatePicker;
