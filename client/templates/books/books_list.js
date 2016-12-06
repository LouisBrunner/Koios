
var resetSelectize = function (self) {
    var categories = [];
    Categories.find({}, {sort: {name: 1}}).forEach(function (element) {
        categories.push({label: element.name, value: element._id});
    });
    self.find('.to-selectize').selectize({
        options: categories,
        create: true,
        sortField: 'label',
        searchField: 'label',
        valueField: 'value',
        labelField: 'label',
    });
    var select = self.find('select');
    if (self.attr('id') == "book-edit-modal" && select) {
        var book = Books.findOne(Session.get('book-edit-id'));
        if (book && book.category) {
            select[0].selectize.setValue(book.category._id);
        }
    }
    self.find('.to-selectize').removeClass('to-selectize');
};

resetPage = function (self) {
    $('.page').attr("style", "");
    resetSelectize(self);
};

Template.booksList.helpers({
    booksCount: function () {
        var result = Books.find();

        if (result) {
            return result.count();
        }
        return 0;
    },
    settings: function () {
        return {
            collection: Books,
            rowsPerPage: 50,
            class: "table table-striped table-hover books",
            showColumnToggles: true,
            fields: [
                {key: 'code', label: 'Code'},
                {key: 'metadata.author', label: 'Author'},
                {key: 'metadata.title', label: 'Title'},
                {key: 'location', label: 'Location', tmpl: Template.limitLength_location},
                {key: 'comment', label: 'Comment', tmpl: Template.limitLength_comment},
                {key: 'category.name', label: 'Category'},
                {key: 'returnDate', label: 'Return Date', fn: formatDate, hidden: true},
                {key: 'borrower', label: 'Borrower', hidden: true},
                {key: 'borrowedDate', label: 'Borrow Date', fn: formatDate, hidden: true},
                {key: 'isbn', label: 'ISBN', hidden: true},
                {key: 'actions', label: 'Actions', tmpl: Template.bookActions, hideToggle: true},
            ],
            filters: ['hasReturnFilter', 'hasBorrowedFilter'],
            showFilter: true,
        };
    },
});

Template.booksList.events({
    'click #book-add': function(e) {
        e.preventDefault();
        var modal = $('#book-add-modal');
        resetPage(modal);
        modal.modal({
            show: true,
            keyboard: true,
        });
    },
});

Template.booksList.onRendered(function () {
    var self = this;

    this.subscribe("books");
    this.subscribe("categories");

    this.find('.books tbody')._uihooks = {
        insertElement: function (node, next) {
            $(node)
            .hide()
            .insertBefore(next)
            .velocity("transition.swoopIn", 500);
        },
        removeElement: function(node) {
            $(node).velocity("transition.swoopOut", 500, {
                complete: function() {
                    $(this).remove();
                }
            });
        }
    };
});
