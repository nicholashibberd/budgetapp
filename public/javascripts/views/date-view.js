/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.DateView = Backbone.View.extend({
    el: 'form#date-form',
    initialize: function() {
      var dp = this.$el.find('input').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
      });
      this.$start = this.$el.find('input#start-date');
      this.$end = this.$el.find('input#end-date');
      this.setup();
    },
    events: {
      'submit': "submit"
    },
    setup: function() {
      var query = this.queryParams();
      var startParam = query["start_date"];
      var endParam = query["end_date"];
      if (startParam && endParam) {
        var startDate = moment(startParam, "DD/MM/YYYY").toDate();
        var endDate = moment(endParam, "DD/MM/YYYY").toDate();
        this.$start.datepicker('setDate', startDate);
        this.$end.datepicker('setDate', endDate);
      }
    },
    queryParams: function() {
      var queryString = window.location.search.substring(1);
      var params = {}, queries, temp, i, l;

      queries = queryString.split("&");

      for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
      }
      return params;
    },
    submit: function(e) {
      e.preventDefault()
      if (this.$start.val() === "" || this.$end.val() === "") return false;
      var url = '/?start_date=' + this.$start.val() + '&end_date=' + this.$end.val()
      window.location.href = url;
    }
  })
})(jQuery);
