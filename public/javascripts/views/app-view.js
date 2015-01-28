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
      new app.AccountsView({ collection: app.Accounts });
      new app.RecordsView({ el: 'h1', collection: app.Records }).render();
      new app.RecordsView({ el: 'h2#positive span', collection: app.Records.positiveRecords() }).render();
      new app.RecordsView({ el: 'h2#negative span', collection: app.Records.negativeRecords() }).render();
      new app.TagsSummaryView({
        el: '#tag-groups',
        collection: app.Records.tagsCollection
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
