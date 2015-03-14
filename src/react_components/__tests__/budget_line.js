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
      tagName: 'Tag1'
    }
    budgetLine = TestUtils.renderIntoDocument(
      <BudgetLine data={data}/>
    );
    element = TestUtils.findRenderedDOMComponentWithClass(
      budgetLine, 'budgetLine'
    );
  });

  it("prints the tag name", function() {
    expect(element.getDOMNode().innerHTML).toContain('Tag1');
  })
});
