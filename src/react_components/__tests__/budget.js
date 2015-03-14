/** @jsx React.DOM */

jest.dontMock('../budget')
jest.dontMock('../budget_line')

describe("Budget", function() {
  var React = require('react/addons');
  var Budget = require('../budget');
  var BudgetLine = require('../budget_line');
  var TestUtils = React.addons.TestUtils;
  var tags, budget, elements;

  beforeEach(function() {
    tags = [
      { Name: "Tag1", id: 1 },
      { Name: "Tag2", id: 2 },
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
});
