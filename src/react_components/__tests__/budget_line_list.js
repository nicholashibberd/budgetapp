/** @jsx React.DOM */

jest.dontMock('../budget_line_list')
describe("BudgetLineList", function() {
  var React = require('react/addons');
  var BudgetLineList = require('../budget_line_list');
  var TestUtils = React.addons.TestUtils;
  var tags, budget_line_list, elements;

  beforeEach(function() {
    tags = [
      { Name: "Tag1", id: 1 },
      { Name: "Tag2", id: 2 },
    ]
    budget_line_list = TestUtils.renderIntoDocument(
      <BudgetLineList tags={tags}/>
    );
    elements = TestUtils.scryRenderedDOMComponentsWithClass(
      budget_line_list, 'budget-line'
    );
  });

  it("renders a budget line for each json object", function() {
    expect(elements.length).toEqual(2);
  })

  it("prints the name of each tag", function() {
    var tag1 = elements[0].getDOMNode()
    var tag2 = elements[1].getDOMNode()
    expect(tag1.innerHTML).toEqual('Tag1')
    expect(tag2.innerHTML).toEqual('Tag2')
  })
});
