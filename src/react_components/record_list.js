/** @jsx React.DOM */

var React = require('react/addons');
var Record = require('./record');
var _ = require('underscore');
var $ = require('jquery');

var RecordList = React.createClass({
  render: function() {
    var _this = this;
    return (
      <div>
        <table className="recordList table table-striped">
          <thead>
            <tr>
              <th>Account</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.props.records.map(function(record, index) {
              return <Record
                data={record}
                tags={_this.props.tags}
                key={index}
                updateRecord={_this.props.updateRecord.bind(null, index)}
              />
            })}
          </tbody>
        </table>
      </div>
    );
  },
});
module.exports = RecordList;
