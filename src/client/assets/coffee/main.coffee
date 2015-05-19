$ = require('jquery')
require('../sass/app')
require('./../../../react_components/vendor/pickadate/pickadate.js')
React = require('react')
DatePicker = require('./../../../react_components/date_picker')
App = require('./../../../react_components/app')

window.jQuery = $

$ ->
  start_date = window.paramsJSON.start_date
  end_date = window.paramsJSON.end_date
  region = window.paramsJSON.region
  account = window.paramsJSON.account

  if start_date && end_date
    path = 'export-records?start_date=' + start_date + '&end_date=' + end_date
    $('#export-records').attr('href', path)

  React.render(
    React.createElement(App, {
      accounts: window.accountsJSON,
      budgetLines: window.budgetLinesJSON,
      records: window.recordsJSON,
      tags: window.tagsJSON,
      start_date: start_date,
      end_date: end_date,
      region: region,
      account: account
    }),
    document.getElementById('app-container')
  )

  React.render(
    React.createElement( DatePicker, {
      startDate: start_date,
      endDate: end_date
    }),
    document.getElementById('date-form')
  )
