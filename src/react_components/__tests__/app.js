/** @jsx React.DOM */

describe("AccountsFilter", function() {
  var React = require('react/addons');
  var $ = require('jquery');
  var App = require('../app');
  var Record = require('../record');
  var TestUtils = React.addons.TestUtils;
  var moment = require('moment');
  var app, accounts, aussie1, aussie2, uk, aussie_record1, uk_record1;

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
    aussie_record1 = {
      id: 123456,
      date: "2015-01-01T10:00:00Z",
      description: "FOXTEL BILL",
      amount: "-100.00",
      account_number: "aussie_account_number1",
      tag_ids: []
    };
    uk_record1 = {
      id: 123456,
      date: "2015-01-01T10:00:00Z",
      description: "UK expense",
      amount: "-200.00",
      account_number: "uk_account_number",
      tag_ids: []
    };
    accounts = [aussie1, aussie2, uk];
    var tags = [ { id: 12345, Name: 'Bills' } ];
    var records = [aussie_record1, uk_record1];
    app = TestUtils.renderIntoDocument(
      <App
        accounts={accounts}
        budgetLines={[]}
        records={records}
        tags={tags}
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
    it("sets the account name on each record", function() {
      expect(app.state.records[0].account_name).toEqual('Aussie 1');
    });

    it("sets the region to australia", function() {
      expect(app.state.region).toEqual('australia');
    });

    it("sets currentAccounts to all australian accounts", function() {
      expect(app.state.currentAccounts).toEqual([aussie1, aussie2]
      );
    });

    it("loads australian records", function() {
      expect(app.state.records).toEqual([aussie_record1]);
    });

    it("sets currencySymbol to $", function() {
      expect(app.state.currencySymbol).toEqual('$');
    });
  });

  describe("updateCurrentAccounts", function() {
    it("sets currentAccounts to those that are passed", function() {
      app.updateCurrentAccounts([uk]);
      expect(app.state.currentAccounts).toEqual([uk]);
    });

    it("filters the records", function() {
      app.updateCurrentAccounts([uk]);
      expect(app.state.records).toEqual([uk_record1]);
    });

    it("sets currencySymbol to £", function() {
      app.updateCurrentAccounts([uk]);
      expect(app.state.currencySymbol).toEqual('£');
    });
  });

  describe("updateRecord", function() {
    it("updates its records when a single record is updated", function() {
      var records = TestUtils.scryRenderedComponentsWithType(app, Record);
      records[0].props.updateRecord('Bills');
      expect(app.state.records[0].tag_ids).toEqual([ 12345 ]);
    })

    it("removes the tag if no tag name is passed", function() {
      app.state.records[0].tag_ids = [ 12345 ];
      var records = TestUtils.scryRenderedComponentsWithType(app, Record);
      records[0].props.updateRecord();
      expect(app.state.records[0].tag_ids).toEqual([]);
    })

    it("posts an ajax request", function() {
      spyOn($, 'ajax');
      var record_components = TestUtils.scryRenderedComponentsWithType(app, Record);
      record_components[0].props.updateRecord('Bills');
      expect($.ajax).toHaveBeenCalledWith({
        url: '/records/123456',
        method: 'POST',
        data: JSON.stringify({
          id: 123456,
          date: "2015-01-01T10:00:00Z",
          description: "FOXTEL BILL",
          amount: "-100.00",
          account_number: "aussie_account_number1",
          tag_ids: [12345],
          account_name: "Aussie 1",
        }),
        contentType: 'application/json'
      });
    })
  })

  describe("changeRegion", function() {
    it("sets the region to the one that it is not", function() {
      app.changeRegion();
      expect(app.state.region).toEqual('uk');
    });
  });

  describe("tag summary", function() {
    beforeEach(function() {
      record1 = {
        id: 123456,
        date: "2015-01-01T10:00:00Z",
        description: "FOXTEL BILL",
        amount: "-100.00",
        account_number: "aussie_account_number1",
        tag_ids: [12345]
      };
      record2 = {
        id: 123456,
        date: "2015-01-01T10:00:00Z",
        description: "FOXTEL BILL",
        amount: "-200.00",
        account_number: "aussie_account_number1",
        tag_ids: [12345]
      };
      record3 = {
        id: 123456,
        date: "2015-01-01T10:00:00Z",
        description: "FOXTEL BILL",
        amount: "150.00",
        account_number: "aussie_account_number1",
        tag_ids: [54321]
      };
      record4 = {
        id: 123456,
        date: "2015-01-01T10:00:00Z",
        description: "FOXTEL BILL",
        amount: "-75.00",
        account_number: "aussie_account_number1",
        tag_ids: [98765]
      };
      record5 = {
        id: 123457,
        date: "2015-01-01T10:00:00Z",
        description: "FOXTEL BILL",
        amount: "-500.00",
        account_number: "aussie_account_number1",
        tag_ids: null
      };
      var tags = [
        { id: 12345, Name: 'Bills' },
        { id: 54321, Name: 'Internet' },
        { id: 98765, Name: 'Cash' },
        { id: 56789, Name: 'Recreation' }
      ];
      var records = [record1, record2, record3, record4, record5];
      app = TestUtils.renderIntoDocument(
        <App
          accounts={accounts}
          budgetLines={[]}
          records={records}
          tags={tags}
          start_date={moment()}
          end_date={moment()}
        />
      );
    })

    it("calculates the balance of each tag", function() {
      expect(app.tagsSummary()).toEqual(
        {
          12345:  -300.00,
          54321: 150.00,
          98765: -75.00,
          56789: 0,
          untagged: -500
        }
      );
    });

    it("it calculates the money out", function() {
      expect(app.moneyOut()).toEqual(-875);
    });

    it("it calculates the money in", function() {
      expect(app.moneyIn()).toEqual(150);
    });

    it("it calculates the balance", function() {
      expect(app.balance()).toEqual(-725);
    });
  });
});
