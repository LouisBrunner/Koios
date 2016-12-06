
Template.limitLength.helpers({
    truncContent: function () {
        return this.substr(0, 20);
    },
    moreContent: function () {
        return this.length > 20;
    },
    content: function () {
        return this;
    },
});

Template.limitLength.onRendered(function() {
    this.$('[data-toggle="popover"]').popover();
});
