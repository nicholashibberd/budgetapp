$ = require('jquery')
React = require('react')

Budget = require('./../../../react_components/budget')

$ ->
  React.render(
    Budget({
      tags: window.tagsJSON
    }), 
    document.getElementById('react-container')
  )
