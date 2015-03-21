$ = require('jquery')
React = require('react')

Budget = require('./../../../react_components/budget')

$ ->
  React.render(
    Budget({
      tags: window.tagsJSON,
      start_date: window.start_date,
      end_date: window.end_date
    }), 
    document.getElementById('react-container')
  )
