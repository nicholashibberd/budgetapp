$ = require('jquery')
require('../sass/app')
require('./../../../react_components/vendor/pickadate/pickadate.js')
React = require('react')
DatePicker = require('./../../../react_components/date_picker')
App = require('./../../../react_components/app')

window.jQuery = $

$ ->
  start_date = window.datesJSON.start_date
  end_date = window.datesJSON.end_date

  # #Pickadate
  # pickerOptions = {
  #   weekdaysFull: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  #   weekdaysShort: ["S", "M", "T", "W", "T", "F", "S"],
  #   today: false,
  #   clear: false,
  #   format: 'dd/mm/yyyy',
  #   # close: "Cancel",
  #   # firstDay: true,
  #   # min: false,
  #   onClose: -> $(document.activeElement).blur()
  #   # onSet: (picker) -> setDate(picker.select) if picker.select
  # }

  React.render(
    React.createElement(App, {
      accounts: window.accountsJSON,
      budgetLines: window.budgetLinesJSON,
      records: window.recordsJSON,
      tags: window.tagsJSON,
      start_date: start_date,
      end_date: end_date
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

  # window.startDatePicker = $(".js-start-date")
  #   .pickadate(pickerOptions)
  #   .pickadate("picker")
  #   .set('select', start_date, {format: "dd/mm/yyyy"});

  # window.endDatePicker = $(".js-end-date")
  #   .pickadate(pickerOptions)
  #   .pickadate("picker")
  #   .set('select', end_date, {format: "dd/mm/yyyy"});
