$ = require('jquery')
React = require('react')

Budget = require('./../../../react_components/budget')

$ ->
  start_date = window.datesJSON.start_date
  end_date = window.datesJSON.end_date

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
