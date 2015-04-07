/** @jsx React.DOM */

var React = require('react/addons');
var RecordList = require('./record_list');

var App = React.createClass({
  render: function() {
    return (
      <RecordList records={window.recordsJSON} tags={window.tagsJSON} />
    );
  },
});
module.exports = App;
