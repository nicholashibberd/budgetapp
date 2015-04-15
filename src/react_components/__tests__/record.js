/** @jsx React.DOM */

describe("Record", function() {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var Record = require('../record');
  var data, record, tag1, tag2, tags, updateRecord;

  beforeEach(function() {
    tag1 = { id: 12345, Name: 'Bills' };
    tag2 = { id: 98765, Name: 'Internet' };
    tag3 = { id: 34567, Name: 'Cash' };
    tags = [ tag1, tag2 ];
    data = {
      id: 123456,
      date: "2015-01-01T10:00:00Z",
      description: "FOXTEL BILL",
      amount: "-100.00",
      account_number: "012345678910",
      tag_ids: [12345, 98765]
    };
    updateRecord = jasmine.createSpy('updateRecord');
    record = TestUtils.renderIntoDocument(
      <Record data={data} tags={tags} key={data.id} updateRecord={updateRecord}/>
    );
    element = TestUtils.findRenderedDOMComponentWithClass(
      record, 'record'
    );
  });

  it("displays each value", function() {
    expect(element.getDOMNode().innerHTML).toContain('Thu 1st Jan');
    expect(element.getDOMNode().innerHTML).toContain('FOXTEL BILL');
    expect(element.getDOMNode().innerHTML).toContain('-100.00');
  });

  it("filters its tags", function() {
    expect(record.tags()).toEqual([tag1, tag2]);
  });

  it("displays each of its tags", function() {
    var tags = TestUtils.scryRenderedDOMComponentsWithClass(element, 'tag');
    expect(tags.length).toEqual(1);
    expect(element.getDOMNode().innerHTML).toContain('Bills');
    expect(element.getDOMNode().innerHTML).not.toContain('Cash');
  });

  it("displays an add button if no tags", function() {
    data.tag_ids = [];
    record = TestUtils.renderIntoDocument( <Record data={data} tags={tags}/>);
    element = TestUtils.findRenderedDOMComponentWithClass( record, 'record');
    var addButton = TestUtils.scryRenderedDOMComponentsWithClass(element, 'add-button');
    expect(addButton.length).toEqual(1);
  })

  it("displays no add button if tags", function() {
    var addButton = TestUtils.scryRenderedDOMComponentsWithClass(element, 'add-button');
    expect(addButton.length).toEqual(0);
  })

  describe("handleSelection", function() {
    it("sets the state to show", function() {
      record.handleSelection("Internet");
      expect(record.state.mode).toEqual('show');
    })

    it("calls the updateRecord callback", function() {
      record.handleSelection("Internet");
      expect(updateRecord).toHaveBeenCalledWith("Internet");
    })
  })
});
