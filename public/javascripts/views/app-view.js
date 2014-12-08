/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: 'budgetapp',
    initialize: function() {
      console.log('AppView initialized');
      this.$table = $('#record-table tbody');
      this.addAll();
      new app.DateView()
      // this.listenTo(app.Records, 'reset', this.addAll);
    },
    addOne: function(record) {
      var view = new app.RecordView({model: record});
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.html('');
      app.Records.each(this.addOne, this);
    },
  })
})(jQuery);
