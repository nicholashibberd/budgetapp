/** @jsx React.DOM */

describe("Budget", function() {
  var React = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var $ = require('jquery');
  var Budget = require('../budget');
  var BudgetLine = require('../budget_line');
  var tags, start_date, end_date, budget, elements;

  beforeEach(function() {
    tags = [
      { Name: "Tag1", id: 1 },
      { Name: "Tag2", id: 2 },
      { Name: "Tag3", id: 3 },
    ]
    var tagsSummary = {
      1: { recordTotal: -100 },
      2: { recordTotal: -200 },
      3: { recordTotal: -300 }
    }
    budgetLines = [
      { tag_id: 1, amount: 100, id: 123 },
      { tag_id: 2, amount: 200, id: 456 },
    ]
    start_date = '12/07/2015'
    end_date = '25/12/2015'
    budget = TestUtils.renderIntoDocument(
      <Budget
        tags={tags}
        budgetLines={budgetLines}
        start_date={start_date}
        end_date={end_date}
        tagsSummary={tagsSummary}
      />
    );
    elements = TestUtils.scryRenderedComponentsWithType(
      budget, BudgetLine
    );
  });

  it("renders a budget line for each tag", function() {
    expect(elements.length).toEqual(3);
  });

  it("prints the name of each tag", function() {
    var tag1 = elements[0].getDOMNode()
    var tag2 = elements[1].getDOMNode()
    var tag3 = elements[2].getDOMNode()
    expect(tag1.innerHTML).toContain('Tag1')
    expect(tag2.innerHTML).toContain('Tag2')
    expect(tag3.innerHTML).toContain('Tag3')
  });

  describe("initial state", function() {
    it("starts with the amount at 0", function() {
      expect(budget.state.amount).toEqual(300)
    });

    it("builds a new budget line for tags without one already", function() {
      expect(budget.state.budgetLines).toEqual(
        [
          { tag_id: 1, tagName: "Tag1", amount: 100, id: 123 },
          { tag_id: 2, tagName: "Tag2", amount: 200, id: 456 },
          { tag_id: 3, tagName: "Tag3", amount: 0 }
        ]
      )
    });

    it("renders the amount", function() {
      var amountDisplay = TestUtils.findRenderedDOMComponentWithClass(
        budget, 'budgetTotal'
      );
      expect(amountDisplay.getDOMNode().textContent).toEqual('$300')
    });
  })

  describe("value is entered on budget line", function() {
    it("updates the amount", function() {
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(budget, 'input');
      TestUtils.Simulate.change(inputs[0], {target: {value: '333'}})
      expect(budget.state.amount).toEqual(533);
    });

    it("treats blank lines as zeroes", function() {
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(budget, 'input');
      TestUtils.Simulate.change(inputs[0], {target: {value: '333'}})
      TestUtils.Simulate.change(inputs[1], {target: {value: ''}})
      expect(budget.state.amount).toEqual(333);
    });
  });

  describe("clicking the submit button", function() {
    it("sends the current state", function() {
      spyOn($, 'ajax')
      submit = TestUtils.findRenderedDOMComponentWithClass(budget, 'submitButton');
      TestUtils.Simulate.click(submit)
      var budgetLines = {
        budgetLines: [
          {
            start_date: "12/07/2015",
            end_date: "25/12/2015",
            tag_id: 1,
            amount: 100,
            id: 123,
          },
          {
            start_date: "12/07/2015",
            end_date: "25/12/2015",
            tag_id: 2,
            amount: 200,
            id: 456,
          },
          {
            start_date: "12/07/2015",
            end_date: "25/12/2015",
            tag_id: 3,
            amount: 0,
          }
        ]
      }
      expect($.ajax).toHaveBeenCalledWith(
        '/budgets',
        {
          method: 'POST',
          data: JSON.stringify(budgetLines)
        }
      );
    });
  });
});
