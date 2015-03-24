/** @jsx React.DOM */

jest.dontMock('../budget_line')

describe("BudgetLine", function() {
  var React = require('react/addons');
  var BudgetLine = require('../budget_line');
  var TestUtils = React.addons.TestUtils;
  var data, budgetLine, element;

  beforeEach(function() {
    data = {
      tag_id: 1,
      amount: 110,
      tagName: 'Tag1'
    }
    updateAmount = jasmine.createSpy('updateAmount');
    budgetLine = TestUtils.renderIntoDocument(
      <BudgetLine data={data} updateAmount={updateAmount}/>
    );
    element = TestUtils.findRenderedDOMComponentWithClass(
      budgetLine, 'budgetLine'
    );
  });

  it("prints the tag name", function() {
    expect(element.getDOMNode().innerHTML).toContain('Tag1');
  });

  it("sets the value to the amount", function() {
    input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
    expect(input.getDOMNode().value).toEqual('110');
  });

  describe("inputting text", function() {
    it("calls the updateAmount callback", function() {
      input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
      TestUtils.Simulate.change(input, {target: {value: '120'}})
      expect(budgetLine.props.updateAmount).toHaveBeenCalledWith(1, 120);
    });
  })
});
