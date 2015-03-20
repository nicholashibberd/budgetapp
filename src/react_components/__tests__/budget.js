/** @jsx React.DOM */

jest.dontMock('../budget')
jest.dontMock('../budget_line')
jest.dontMock('underscore')

describe("Budget", function() {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var $ = require('jquery');
  var Budget = require('../budget');
  var BudgetLine = require('../budget_line');
  var tags, budget, elements;

  beforeEach(function() {
    tags = [
      { Name: "Tag1", id: 1, total: 100 },
      { Name: "Tag2", id: 2, total: 200 },
    ]
    budget = TestUtils.renderIntoDocument(
      <Budget tags={tags}/>
    );
    elements = TestUtils.scryRenderedComponentsWithType(
      budget, BudgetLine
    );
  });

  it("renders a budget line for each json object", function() {
    expect(elements.length).toEqual(2);
  });

  it("prints the name of each tag", function() {
    var tag1 = elements[0].getDOMNode()
    var tag2 = elements[1].getDOMNode()
    expect(tag1.innerHTML).toContain('Tag1')
    expect(tag2.innerHTML).toContain('Tag2')
  });

  describe("initial state", function() {
    it("starts with the total at 0", function() {
      expect(budget.state.total).toEqual(0)
    });

    it("renders the total", function() {
      var totalDisplay = TestUtils.findRenderedDOMComponentWithClass(
        budget, 'budgetTotal'
      );
      expect(totalDisplay.getDOMNode().textContent).toEqual('£0')
    });
  })

  describe("value is entered on budget line", function() {
    it("updates the total", function() {
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(budget, 'input');
      TestUtils.Simulate.change(inputs[0], {target: {value: '333'}})
      expect(budget.state.total).toEqual(533);
    });

    it("treats blank lines as zeroes", function() {
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(budget, 'input');
      TestUtils.Simulate.change(inputs[0], {target: {value: '333'}})
      TestUtils.Simulate.change(inputs[1], {target: {value: ''}})
      expect(budget.state.total).toEqual(333);
    });
  });

  describe("clicking the submit button", function() {
    it("sends the current state", function() {
      spyOn($, 'ajax')
      submit = TestUtils.findRenderedDOMComponentWithClass(budget, 'submitButton');
      TestUtils.Simulate.click(submit)
      expect($.ajax).toHaveBeenCalledWith(
        '/budgets',
        budget.state.tags
      );
    });
  });
});
