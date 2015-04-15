/** @jsx React.DOM */

jest.dontMock('../app');
jest.dontMock('moment');
jest.dontMock('underscore');

describe("AccountsFilter", function() {
  var React = require('react/addons');
  var App = require('../app');
  var TestUtils = React.addons.TestUtils;
  var moment = require('moment');
  var app, aussie1, aussie2, uk;

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
    app = TestUtils.renderIntoDocument(
      <App
        accounts={accounts}
        budgetLines={[]}
        records={[]}
        tags={[]}
        start_date={moment()}
        end_date={moment()}
      />
    );
  });

  describe("filtering accounts", function() {
    it("filters australian accounts", function() {
      expect(app.australianAccounts()).toEqual([aussie1, aussie2]);
    });

    it("filters uk accounts", function() {
      expect(app.ukAccounts()).toEqual([uk]);
    });
  });

  describe("initial state", function() {
    it("sets currentAccounts to all australian accounts", function() {
      expect(app.state.currentAccounts).toEqual([aussie1, aussie2]
      );
    });
  });

  describe("updateCurrentAccounts", function() {
    it("sets currentAccounts to those that are passed", function() {
      app.updateCurrentAccounts([uk]);
      expect(app.state.currentAccounts).toEqual([uk]);
    });
  });
});
