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
      this.records = app.Accounts.getSelectedRecords();
      this.allRecordsView = new app.RecordsView({ el: 'h1', collection: this.records });
      this.positiveRecordsView = new app.RecordsView({ el: 'h2#positive span', collection: this.records.positiveRecords() });
      this.negativeRecordsView = new app.RecordsView({ el: 'h2#negative span', collection: this.records.negativeRecords() });
      this.tagsSummaryView = new app.TagsSummaryView({
        el: '#tag-groups',
        collection: this.records.tagsCollection()
      });
      this.renderViews()
      this.listenTo(app.Records, 'change', this.reload)
      this.listenTo(app.Accounts, 'selection', this.reload)
    },
    addOne: function(record) {
      var view = new app.RecordView({model: record});
      this.$table.append(view.render().el);
    },
    addAll: function() {
      this.$table.html('');
      this.records.each(this.addOne, this);
    },
    reload: function() {
      this.resetCollections();
      this.renderViews();
    },
    resetCollections: function() {
      this.records = app.Accounts.getSelectedRecords();
      this.allRecordsView.collection = this.records;
      this.positiveRecordsView.collection = this.records.positiveRecords();
      this.negativeRecordsView.collection = this.records.negativeRecords();
      this.tagsSummaryView.collection = this.records.tagsCollection();
    },
    renderViews: function() {
      this.addAll();
      this.allRecordsView.render()
      this.positiveRecordsView.render();
      this.negativeRecordsView.render();
      this.tagsSummaryView.render();
    }
  })
})(jQuery);
