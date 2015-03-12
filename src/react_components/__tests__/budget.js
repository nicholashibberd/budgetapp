/** @jsx React.DOM */

jest.dontMock('../budget')
describe("Budget", function() {
  var React = require('react/addons');
  var Budget = require('../budget');
  var TestUtils = React.addons.TestUtils;
  var tags, budget_line_list, elements;

  beforeEach(function() {
    tags = [
      { Name: "Tag1", id: 1 },
      { Name: "Tag2", id: 2 },
    ]
    budget = TestUtils.renderIntoDocument(
      <Budget tags={tags}/>
    );
    elements = TestUtils.scryRenderedDOMComponentsWithClass(
      budget, 'budget-line'
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
