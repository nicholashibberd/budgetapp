/** @jsx React.DOM */

describe("BudgetLine", function() {
  var React = require('react/addons');
  var BudgetLine = require('../budget_line');
  var TestUtils = React.addons.TestUtils;
  var data, budgetLine, element, tagsSummary, updateAmount;

  beforeEach(function() {
    data = {
      tag_id: 1,
      amount: 110,
      tagName: 'Tag1'
    }
    tagsSummary = {
      recordTotal: -350,
    }
    updateAmount = jasmine.createSpy('updateAmount');
    budgetLine = TestUtils.renderIntoDocument(
      <BudgetLine
        data={data}
        updateAmount={updateAmount}
        tagsSummary={tagsSummary}
      />
    );
    element = TestUtils.findRenderedDOMComponentWithClass(
      budgetLine, 'budgetLine'
    );
  });

  it("prints the tag name", function() {
    expect(element.getDOMNode().innerHTML).toContain('Tag1');
  });

  it("sets the value to the amount", function() {
    var input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
    expect(input.getDOMNode().value).toEqual('110');
  });

  it("sets the class to negative if the value record total is negative", function() {
    TestUtils.findRenderedDOMComponentWithClass(budgetLine, 'negative-summary-bar');
  });

  it("sets the class to positive if the value record total is positive", function() {
    tagsSummary = {
      recordTotal: 350,
    }
    budgetLine = TestUtils.renderIntoDocument(
      <BudgetLine
        data={data}
        updateAmount={updateAmount}
        tagsSummary={tagsSummary}
      />
    );
    TestUtils.findRenderedDOMComponentWithClass(budgetLine, 'positive-summary-bar');
  });

  describe("inputting text", function() {
    it("calls the updateAmount callback", function() {
      input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
      TestUtils.Simulate.change(input, {target: {value: '120'}})
      expect(budgetLine.props.updateAmount).toHaveBeenCalledWith(1, 120);
    });
  })
});
