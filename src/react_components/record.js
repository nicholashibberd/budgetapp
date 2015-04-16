/** @jsx React.DOM */

var React = require('react/addons');
var moment = require('moment');
var _ = require('underscore');
var $ = require('jquery');

var Record = React.createClass({
  getInitialState: function() {
    return {mode: 'show'}
  },

  tags: function() {
    var _this = this;
    return _.filter(this.props.tags, function(tag) {
      return _.contains(_this.props.data.tag_ids, tag.id)
    })
  },

  displayDate: function() {
    var date = this.props.data.date;
    return moment(date).format("ddd Do MMM")
  },

  handleAdd: function() {
    this.setState({mode: 'edit'});
  },

  handleRemove: function() {
    this.setState({mode: 'show'});
    this.props.updateRecord();
  },

  handleSelection: function(value) {
    this.props.updateRecord(value);
    this.setState({mode: 'show'});
  },

  tagNames: function() {
    return _.map(this.props.tags, function(tag) {
      return tag.Name;
    });
  },

  loadTypeahead: function(element, results) {
    var _this = this;
    var states = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: $.map(results, function(result) { return { value: result }; })
    });
    states.initialize();
    $(element).typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'states',
      displayKey: 'value',
      source: states.ttAdapter()
    });
    $(element).bind('typeahead:selected', function(obj, datum, name) {
      _this.handleSelection(datum.value);
    });
  },

  componentDidUpdate: function() {
    if (this.state.mode == 'edit') {
      var element = React.findDOMNode(this.refs.tagSearch);
      this.loadTypeahead(element, this.tagNames());
      element.focus();
    }
  },

  render: function() {
    var button, input, tagControls;
    var data = this.props.data;
    var tags = this.tags();

    if (tags.length > 0) {
      var tagName = tags[0].Name
      button = <button className="btn btn-sm btn-primary tag" onClick={this.handleRemove}>{tagName}</button>
    } else {
      button = <button className="btn btn-sm btn-default add-button" onClick={this.handleAdd}>Add</button>
    }
    input = <input type="text" ref="tagSearch" className="form-control" />
    tagControls = (this.state.mode === 'show') ? button : input;

    return (
      <tr className="record">
        <td>{data.account_name}</td>
        <td>{this.displayDate()}</td>
        <td>{data.description}</td>
        <td>{data.amount}</td>
        <td className="tag-controls">{tagControls}</td>
      </tr>
    );
  },
});
module.exports = Record;
