/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: 'budgetapp',
    initialize: function() {
      this.$table = $('#record-table tbody');
      this.addAll();
      new app.DateView();
      var tagsCollection = app.Records.tagsCollection();
      new app.RecordsSummaryView({
        el: 'h1',
        collection: app.Records
      }).render();
      new app.TagsSummaryView({
        el: '#negative-tags',
        collection: tagsCollection.negativeRecords()
      }).render();
      new app.TagsSummaryView({
        el: '#positive-tags',
        collection: tagsCollection.positiveRecords()
      }).render();
      this.listenTo(app.Records, 'change', this.addAll())
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
