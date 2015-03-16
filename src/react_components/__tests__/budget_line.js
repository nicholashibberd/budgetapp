/** @jsx React.DOM */

jest.dontMock('../budget_line')

describe("BudgetLine", function() {
  var React = require('react/addons');
  var BudgetLine = require('../budget_line');
  var TestUtils = React.addons.TestUtils;
  var data, budgetLine, element;

  beforeEach(function() {
    data = {
      id: 1,
      tagName: 'Tag1',
      total: 110
    }
    updateTotal = jasmine.createSpy('updateTotal');
    budgetLine = TestUtils.renderIntoDocument(
      <BudgetLine data={data} updateTotal={updateTotal}/>
    );
    element = TestUtils.findRenderedDOMComponentWithClass(
      budgetLine, 'budgetLine'
    );
  });

  it("prints the tag name", function() {
    expect(element.getDOMNode().innerHTML).toContain('Tag1');
  });

  it("sets the value to the total", function() {
    input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
    expect(input.getDOMNode().value).toEqual('110');
  });

  describe("inputting text", function() {
    it("calls the updateTotal callback", function() {
      input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
      TestUtils.Simulate.change(input, {target: {value: '120'}})
      expect(budgetLine.props.updateTotal).toHaveBeenCalled();
    });
  })
});
