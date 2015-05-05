/** @jsx React.DOM */

describe("BudgetLine", function() {
  var React = require('react/addons');
  var BudgetLine = require('../budget_line');
  var TestUtils = React.addons.TestUtils;
  var data, budgetLine, element, tagsSummary, updateAmount;

  beforeEach(function() {
    data = {
      tag_id: 1,
      amount: -100,
      tagName: 'Tag1',
      recordTotal: -350
    }
    updateAmount = jasmine.createSpy('updateAmount');
    budgetLine = TestUtils.renderIntoDocument(
      <BudgetLine
        data={data}
        updateAmount={updateAmount}
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
    expect(input.getDOMNode().value).toEqual('-100');
  });

  describe("positive record total", function() {
    beforeEach(function() {
      data = {
        recordTotal: 200
      }
      budgetLine = TestUtils.renderIntoDocument(
        <BudgetLine
          data={data}
          updateAmount={updateAmount}
          maximumValue={4000}
        />
      );
    })

    it("sets the class to positive", function() {
      TestUtils.findRenderedDOMComponentWithClass(budgetLine, 'positive-summary-bar');
    });
  })

  describe("negative record total", function() {
    beforeEach(function() {
      data = {
        recordTotal: -200
      }
      budgetLine = TestUtils.renderIntoDocument(
        <BudgetLine
          data={data}
          updateAmount={updateAmount}
          maximumValue={2000}
        />
      );
    })

    it("sets the class to negative", function() {
      TestUtils.findRenderedDOMComponentWithClass(budgetLine, 'negative-summary-bar');
    });
  })

  describe("inputting text", function() {
    it("calls the updateAmount callback", function() {
      input = TestUtils.findRenderedDOMComponentWithTag(budgetLine, 'input');
      TestUtils.Simulate.change(input, {target: {value: '120'}})
      expect(budgetLine.props.updateAmount).toHaveBeenCalledWith(1, 120);
    });
  })
});
