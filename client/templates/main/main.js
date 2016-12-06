Meteor.startup(function () {
    Template.registerHelper("Schemas", Schemas);

    AutoForm.setDefaultTemplateForType('afFormGroup', 'mine');

    sAlert.config({
        effect: 'stackslide',
        position: 'bottom-right',
        timeout: 5000,
        html: false,
        onRouteClose: false,
        stack: {
            limit: 5,
        },
        offset: 0,
        beep: false,
    });
});

Template.main.helpers({
    transition: function() {
        return function(from, to, element) {
            return 'right-to-left';
        }
    },
});
