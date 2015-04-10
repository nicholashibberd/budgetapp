$ = require('jquery')
require('../sass/app')
require('./../../../react_components/vendor/pickadate/pickadate.js')
React = require('react')
Budget = require('./../../../react_components/budget')
RecordList = require('./../../../react_components/record_list')
DatePicker = require('./../../../react_components/date_picker')
AccountsFilter = require('./../../../react_components/accounts_filter')

window.jQuery = $

$ ->
  start_date = window.datesJSON.start_date
  end_date = window.datesJSON.end_date

  #Pickadate
  pickerOptions = {
    weekdaysFull: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysShort: ["S", "M", "T", "W", "T", "F", "S"],
    today: false,
    clear: false,
    format: 'dd/mm/yyyy',
    # close: "Cancel",
    # firstDay: true,
    # min: false,
    onClose: -> $(document.activeElement).blur()
    # onSet: (picker) -> setDate(picker.select) if picker.select
  }

  React.render(
    React.createElement(DatePicker),
    document.getElementById('date-form')
  )

  window.startDatePicker = $(".js-start-date")
    .pickadate(pickerOptions)
    .pickadate("picker")
    .set('select', start_date, {format: "dd/mm/yyyy"});

  window.endDatePicker = $(".js-end-date")
    .pickadate(pickerOptions)
    .pickadate("picker")
    .set('select', end_date, {format: "dd/mm/yyyy"});

  React.render(
    React.createElement(
      AccountsFilter, {
        accounts: window.accountsJSON
      }
    )
    document.getElementById('accounts-container')
  )

  if start_date && end_date
    React.render(
      React.createElement(
        Budget, {
          tags: window.tagsJSON,
          budgetLines: window.budgetLinesJSON,
          start_date: start_date,
          end_date: end_date
        }
      ),
      document.getElementById('budget-container')
    )

    React.render(
      React.createElement(
        RecordList, {
          records: window.recordsJSON
          tags: window.tagsJSON
        }
      )
      document.getElementById('record-container')
    )
