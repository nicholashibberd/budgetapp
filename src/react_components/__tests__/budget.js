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
  var tags, start_date, end_date, budget, elements;

  beforeEach(function() {
    tags = [
      { name: "Tag1", id: 1 },
      { name: "Tag2", id: 2 },
      { name: "Tag3", id: 3 },
    ]
    budgetLines = [
      { tagId: 1, total: 100 },
      { tagId: 2, total: 200 },
    ]
    start_date = '12/07/2015'
    end_date = '25/12/2015'
    budget = TestUtils.renderIntoDocument(
      <Budget
        tags={tags}
        budgetLines={budgetLines}
        start_date={start_date}
        end_date={end_date}
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
    it("starts with the total at 0", function() {
      expect(budget.state.total).toEqual(300)
    });

    it("builds a new budget line for tags without one already", function() {
      expect(budget.state.budgetLines).toEqual(
        [
          { tagId: 1, tagName: "Tag1", total: 100 },
          { tagId: 2, tagName: "Tag2", total: 200 },
          { tagId: 3, tagName: "Tag3", total: 0 }
        ]
      )
    });

    it("renders the total", function() {
      var totalDisplay = TestUtils.findRenderedDOMComponentWithClass(
        budget, 'budgetTotal'
      );
      expect(totalDisplay.getDOMNode().textContent).toEqual('£300')
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
      var budgetLines = {
        budgetLines: [
          {
            start_date: "12/07/2015",
            end_date: "25/12/2015",
            tag_id: 1,
            amount: "100",
          },
          {
            start_date: "12/07/2015",
            end_date: "25/12/2015",
            tag_id: 2,
            amount: "200",
          },
          {
            start_date: "12/07/2015",
            end_date: "25/12/2015",
            tag_id: 3,
            amount: "0",
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