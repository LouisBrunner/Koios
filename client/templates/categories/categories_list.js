
var getCategories = function () {
    return Categories.find();
};

Template.categoriesList.helpers({
    hasCategories: function () {
        var result = getCategories();

        if (result) {
            return result.count();
        }
        return 0;
    },
    categories: getCategories,
});

Template.categoriesList.events({
    "click .remove": function (event) {
        Meteor.call('removeCategory', this._id, function(error, result) {
            if (error) {
                throwError(error);
            } else {
                sAlert.info("Category deleted");
            }
        });
    },
});

var resetEditable = function (self) {
    self.$('.edit').editable("destroy").editable({
        placeholder: 'Fantasy',
        mode: 'inline',
        url: function(params) {
            var d = new $.Deferred;
            if (params.value == "") {
                return d.reject("Value can't be empty")
            }
            Meteor.call('updateCategory', {name: params.value}, params.pk, function (error, result) {
                if (error) {
                    d.reject(error.reason);
                } else {
                    d.resolve();
                    sAlert.success("Category updated");
                }
            });
            return d.promise();
        }
    });
};

Template.categoriesList.onRendered(function () {
    var self = this;

    self.subscribe("categories");

    self.autorun(function () {
        if (!self.subscriptionsReady()) {
            return;
        }

        resetEditable(self);
    });

    this.find('.categories')._uihooks = {
        insertElement: function (node, next) {
            $(node)
            .hide()
            .insertBefore(next)
            .slideDown(function () {
                resetEditable(self);
            });
        },
        removeElement: function(node) {
            $(node).velocity("transition.fadeOut", 500, {
                complete: function() {
                    $(this).remove();
                }
            });
        }
    };
});
