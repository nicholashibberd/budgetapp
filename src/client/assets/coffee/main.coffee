$ = require('jquery')
require('../sass/app')
require('./../../../react_components/vendor/pickadate/pickadate.js')
React = require('react')
Budget = require('./../../../react_components/budget')
DatePicker = require('./../../../react_components/date_picker')

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

  React.render(DatePicker(), document.getElementById('date-form'))

  window.startDatePicker = $(".js-start-date")
    .pickadate(pickerOptions)
    .pickadate("picker")
    .set('select', start_date, {format: "dd/mm/yyyy"});

  window.endDatePicker = $(".js-end-date")
    .pickadate(pickerOptions)
    .pickadate("picker")
    .set('select', end_date, {format: "dd/mm/yyyy"});

  if start_date && end_date
    React.render(
      Budget({
        tags: window.tagsJSON,
        budgetLines: window.budgetLinesJSON,
        start_date: start_date,
        end_date: end_date
      }),
      document.getElementById('react-container')
    )
