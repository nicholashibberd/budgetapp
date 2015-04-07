/** @jsx React.DOM */

jest.dontMock('../record_list');
jest.dontMock('../record');
jest.dontMock('moment');
jest.dontMock('underscore');
jest.dontMock('jquery');

describe("RecordList", function() {
  var React = require('react/addons');
  var $ = require('jquery');
  var TestUtils = React.addons.TestUtils;
  var RecordList = require('../record_list');
  var Record = require('../record');
  var record_list, elements, tags, records;

  beforeEach(function() {
    tags = [
      { id: 12345, Name: 'Bills' }
    ];

    records = [
      {
        id: 123456,
        date: "2015-01-01T00:00:00Z",
        description: "FOXTEL BILL",
        amount: "-100.00",
        account_number: "012345678910",
        tag_ids: [ 12345 ]
      },
      {
        id: 456789,
        date: "2015-02-02T00:00:00Z",
        description: "VISA DEBIT PURCHASE CARD",
        amount: "-200.00",
        account_number: "012345678910",
        tag_ids: []
      }
    ];
    record_list = TestUtils.renderIntoDocument(
      <RecordList records={records} tags={tags}/>
    );
    elements = TestUtils.scryRenderedComponentsWithType(
      record_list, Record
    );
  });

  it("renders a record for each item", function() {
    expect(elements.length).toEqual(2);
  });

  it("sets its initial state from props", function() {
    expect(record_list.state.records).toEqual(records);
  })

  describe("updateRecord", function() {
    it("updates its records when a single record is updated", function() {
      var records = TestUtils.scryRenderedComponentsWithType(record_list, Record);
      records[1].props.updateRecord('Bills');
      expect(record_list.state.records[1].tag_ids).toEqual([ 12345 ]);
    })

    it("removes the tag if no tag name is passed", function() {
      var records = TestUtils.scryRenderedComponentsWithType(record_list, Record);
      records[0].props.updateRecord();
      expect(record_list.state.records[0].tag_ids).toEqual([]);
    })

    it("posts an ajax request", function() {
      spyOn($, 'ajax');
      var record_components = TestUtils.scryRenderedComponentsWithType(record_list, Record);
      record_components[1].props.updateRecord('Bills');
      expect($.ajax).toHaveBeenCalledWith({
        url: '/records/456789',
        method: 'POST',
        data: JSON.stringify({
          id: 456789,
          date: "2015-02-02T00:00:00Z",
          description: "VISA DEBIT PURCHASE CARD",
          amount: "-200.00",
          account_number: "012345678910",
          tag_ids: [12345]
        }),
        contentType: 'application/json'
      });
    })
  })
});
