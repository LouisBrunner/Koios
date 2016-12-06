
Template.registerHelper('pluralize', function(n, thing) {
    // fairly stupid pluralizer
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});

Template.registerHelper('capitalize', function(thing) {
    if (!thing) {
        return null;
    }
    return thing.charAt(0).toUpperCase() + thing.slice(1);
});

formatDate = function(date) {
    if (date) {
        return moment(date.toISOString()).format("DD/MM/YYYY");
    }
    return "";
};

Template.registerHelper('formatDate', formatDate);
