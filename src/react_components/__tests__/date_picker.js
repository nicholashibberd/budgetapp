/** @jsx React.DOM */

describe("DatePicker", function() {
  var React = require('react/addons');
  var DatePicker = require('../date_picker');
  var TestUtils = React.addons.TestUtils;
  var moment = require('moment');
  var datePicker, form;
  var DATE_FORMAT = "DD/MM/YYYY";

  beforeEach(function() {
    startDate = '01/01/2015';
    endDate = '31/01/2015';
    datePicker = TestUtils.renderIntoDocument(
      <DatePicker startDate={startDate} endDate={endDate}/>
    );
    form = TestUtils.findRenderedDOMComponentWithTag(
      datePicker, 'form'
    );
  });

  it("sets the start date", function() {
    expect(datePicker.state.startDate).toEqual(
      moment("01/01/2015", "DD/MM/YYYY")
    );
  });

  it("sets the end date", function() {
    expect(datePicker.state.endDate).toEqual(
      moment("31/01/2015", "DD/MM/YYYY")
    );
  });

  it("loads the start date picker on click", function() {
    window.startDatePicker = { open: function() {} };
    spyOn(window.startDatePicker, 'open')
    input = TestUtils.findRenderedDOMComponentWithClass(form, 'js-start-date');
    TestUtils.Simulate.click(input)
    expect(window.startDatePicker.open).toHaveBeenCalled();
  });

  it("loads the end date picker on click", function() {
    window.endDatePicker = { open: function() {} };
    spyOn(window.endDatePicker, 'open')
    input = TestUtils.findRenderedDOMComponentWithClass(form, 'js-end-date');
    TestUtils.Simulate.click(input)
    expect(window.endDatePicker.open).toHaveBeenCalled();
  });

  describe('changing the dates', function() {
    var inputs;

    beforeEach(function() {
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(form, 'input');
      TestUtils.Simulate.change(inputs[0], {target: {value: '2 February, 2015'}})
      TestUtils.Simulate.change(inputs[1], {target: {value: '25 March, 2015'}})
    })

    it("sets the start date when the input value changes", function() {
      expect(datePicker.state.startDate.format(DATE_FORMAT)).toEqual(
        moment("02/02/2015", DATE_FORMAT).format(DATE_FORMAT)
      );

      expect(datePicker.state.endDate.format(DATE_FORMAT)).toEqual(
        moment("25/03/2015", DATE_FORMAT).format(DATE_FORMAT)
      );
    });
  })
});
