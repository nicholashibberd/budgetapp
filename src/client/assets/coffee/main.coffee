$ = require('jquery')
React = require('react')

BudgetLineList = require('./../../../react_components/budget_line_list')

$ ->
  React.render(
    BudgetLineList({
      tags: window.tagsJSON
    }), 
    document.getElementById('react-container')
  )
