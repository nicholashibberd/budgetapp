/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({
    el: 'budgetapp',
    initialize: function() {
      this.$table = $('#record-table tbody');
      new app.DateView();
      new app.AccountsView({ collection: app.Accounts });
      this.setup();
    },
    addOne: function(record) {
      var view = new app.RecordView({model: record});
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.html('');
      this.records.each(this.addOne, this);
    },
    setup: function() {
      this.records = app.Accounts.getSelectedRecords();
      this.addAll();
      new app.RecordsView({ el: 'h1', collection: this.records }).render();
      new app.RecordsView({ el: 'h2#positive span', collection: this.records.positiveRecords() }).render();
      new app.RecordsView({ el: 'h2#negative span', collection: this.records.negativeRecords() }).render();
      new app.TagsSummaryView({
        el: '#tag-groups',
        collection: this.records.tagsCollection()
      }).render();
      this.listenTo(this.records, 'change', this.addAll)
      this.listenTo(app.Accounts, 'selection', this.setup)
    }
  })
})(jQuery);
