
Router.route('/', function () {
    this.render('Books');
}, {name: 'books'});

Router.route('/categories', function () {
    this.render('Categories');
}, {name: 'categories'});

Router.configure({
    layoutTemplate: 'main',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading',
});

Router.onBeforeAction(function() {
    if (!Meteor.userId()) {
        this.render('Login');
    } else {
        this.next();
    }
});
