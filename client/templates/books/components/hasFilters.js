Template.hasFilters.created = function () {
  this.returnFilter = new ReactiveTable.Filter('hasReturnFilter', ['returnDate']);
  this.borrowedFilter = new ReactiveTable.Filter('hasBorrowedFilter', ['borrowedDate']);
};

Template.hasFilters.events({
   "change .has-return-filter": function (event, template) {
       var checked = $(event.target).prop("checked");
       if (checked) {
           template.returnFilter.set({ $ne: null });
       } else {
           template.returnFilter.set("");
       }
   },
  "change .has-borrowed-filter": function (event, template) {
      var checked = $(event.target).prop("checked");
      if (checked) {
          template.borrowedFilter.set({ $ne: null });
      } else {
          template.borrowedFilter.set("");
      }
  },
});
