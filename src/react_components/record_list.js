/** @jsx React.DOM */

var React = require('react/addons');
var Record = require('./record');
var _ = require('underscore');
var $ = require('jquery');

var RecordList = React.createClass({
  getInitialState: function() {
    return {
      records: this.props.records
    }
  },

  updateRecord: function(recordIndex, tagName) {
    var records = this.state.records.slice();
    var record = records[recordIndex];
    var tagIds;

    if (tagName !== undefined) {
      var tag = _.find(this.props.tags, function(tag) {
        return tag.Name == tagName
      })
      tagIds = [tag.id]
    } else {
      tagIds = [];
    }
    record.tag_ids = tagIds;

    this.setState({records: records});
    $.ajax({
      url: '/records/' + record.id,
      method: 'POST',
      data: JSON.stringify(record),
      contentType: 'application/json'
    })
  },

  render: function() {
    var _this = this;
    return (
      <div>
        <table className="recordList table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          {this.state.records.map(function(record, index) {
            return <Record
              data={record}
              tags={_this.props.tags}
              key={index}
              updateRecord={_this.updateRecord.bind(null, index)}
            />
          })}
        </table>
      </div>
    );
  },
});
module.exports = RecordList;
