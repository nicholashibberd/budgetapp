/** @jsx React.DOM */

jest.dontMock('../accounts_filter');
jest.dontMock('underscore');

describe("AccountsFilter", function() {
  var React = require('react/addons');
  var AccountsFilter = require('../accounts_filter');
  var TestUtils = React.addons.TestUtils;
  var aussie1, aussie2, uk, accountsFilter;

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
    var australianAccounts = [aussie1, aussie2];
    var ukAccounts = [uk];
    var accounts = [aussie1, aussie2, uk];
    var updateCurrentAccounts = jasmine.createSpy();
    accountsFilter = TestUtils.renderIntoDocument(
      <AccountsFilter
        australianAccounts={australianAccounts}
        ukAccounts={ukAccounts}
        accounts={accounts}
        currentAccounts={australianAccounts}
        updateCurrentAccounts={updateCurrentAccounts}
      />
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
      TestUtils.Simulate.click(link);
    });

    it("calls updateCurrentAccounts with that account", function() {
      expect(accountsFilter.props.updateCurrentAccounts).toHaveBeenCalledWith([aussie1]);
    })
  });

  describe("clicking an 'All' button", function() {
    beforeEach(function() {
      var element = TestUtils.findRenderedDOMComponentWithClass(
        accountsFilter, 'all-australian-accounts'
      );
      TestUtils.Simulate.click(element);
    });

    it("calls updateCurrentAccounts with all accounts in that region", function() {
      expect(accountsFilter.props.updateCurrentAccounts).toHaveBeenCalledWith([aussie1, aussie2]);
    })
  })
});
