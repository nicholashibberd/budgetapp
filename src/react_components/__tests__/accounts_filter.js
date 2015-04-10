/** @jsx React.DOM */

jest.dontMock('../accounts_filter');
jest.dontMock('underscore');

describe("AccountsFilter", function() {
  var React = require('react/addons');
  var AccountsFilter = require('../accounts_filter');
  var TestUtils = React.addons.TestUtils;
  var aussie1, aussie2, uk;

  beforeEach(function() {
    aussie1 = {
      id: 123456,
      accountNumber: 'aussie_account_number1',
      name: 'Aussie 1',
      region: 'Australia'
    },
    aussie2 = {
      id: 235467,
      accountNumber: 'aussie_account_number2',
      name: 'Aussie 2',
      region: 'Australia'
    },
    uk = {
      id: 654321,
      accountNumber: 'uk_account_number',
      name: 'UK Account',
      region: 'UK'
    }
    var accounts = [aussie1, aussie2, uk];
    accountsFilter = TestUtils.renderIntoDocument(
      <AccountsFilter accounts={accounts}/>
    );
  });

  describe("Australian accounts", function() {
    var elements;

    beforeEach(function() {
      elements = TestUtils.scryRenderedDOMComponentsWithClass(
        accountsFilter, 'australian-account'
      );
    });

    it("renders each Australian account", function() {
      expect(elements.length).toEqual(2);
    });

    it("prints the name of each Australian account", function() {
      expect(elements[0].getDOMNode().innerHTML).toContain('Aussie 1');
      expect(elements[1].getDOMNode().innerHTML).toContain('Aussie 2');
    });
  });

  it("renders a link for all Australian accounts", function() {
    TestUtils.findRenderedDOMComponentWithClass(
      accountsFilter, 'all-australian-accounts'
    );
  });

  describe("UK accounts", function() {
    var elements;

    beforeEach(function() {
      elements = TestUtils.scryRenderedDOMComponentsWithClass(
        accountsFilter, 'uk-account'
      );
    });

    it("renders each UK account", function() {
      elements = TestUtils.scryRenderedDOMComponentsWithClass(
        accountsFilter, 'uk-account'
      );
      expect(elements.length).toEqual(1);
    });

    it("prints the name of each UK account", function() {
      expect(elements[0].getDOMNode().innerHTML).toContain('UK Account');
    });
  });


  it("renders a link for all UK accounts", function() {
    TestUtils.findRenderedDOMComponentWithClass(
      accountsFilter, 'all-uk-accounts'
    );
  });

  describe("initial state", function() {
    it("sets currentAccounts to all australian accounts", function() {
      expect(accountsFilter.state.currentAccounts).toEqual(
        [aussie1, aussie2]
      );
    })

    it("displays All Australian Accounts", function() {
      var element = TestUtils.findRenderedDOMComponentWithClass(
        accountsFilter, 'accounts-button-text'
      );
      expect(element.getDOMNode().innerHTML).toEqual('All Australian Accounts');
    })
  })

  describe("clicking an account", function() {
    beforeEach(function() {
      elements = TestUtils.scryRenderedDOMComponentsWithClass(
        accountsFilter, 'australian-account'
      );
      link = TestUtils.findRenderedDOMComponentWithTag(
        elements[0], 'a'
      );
      TestUtils.Simulate.click(link)
    });

    it("sets currentAccounts to just that account", function() {
      expect(accountsFilter.state.currentAccounts).toEqual([aussie1]);
    });

    it("displays that account name", function() {
      var element = TestUtils.findRenderedDOMComponentWithClass(
        accountsFilter, 'accounts-button-text'
      );
      expect(element.getDOMNode().innerHTML).toEqual('Aussie 1');
    })
  });

  describe("clicking an 'All' button", function() {
    beforeEach(function() {
      var element = TestUtils.findRenderedDOMComponentWithClass(
        accountsFilter, 'all-uk-accounts'
      );
      TestUtils.Simulate.click(element);
    });

    it("sets currentAccounts to all those accounts", function() {
      expect(accountsFilter.state.currentAccounts).toEqual([uk]);
    })

    it("displays that region group name", function() {
      var element = TestUtils.findRenderedDOMComponentWithClass(
        accountsFilter, 'accounts-button-text'
      );
      expect(element.getDOMNode().innerHTML).toEqual('All UK Accounts');
    })
  })
});
