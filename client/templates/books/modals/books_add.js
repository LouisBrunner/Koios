
addBook = function (form, doc) {
    form.result(doc);
    $('#book-add-modal').modal('hide');
};

var hooks = {
    before: {
        method: function(doc) {
            var form = this;
            var isbn = doc.isbn;

            if (!checkBorrowed(form, doc)) {
                return;
            }

            form.removeStickyValidationError("isbn");

            fetchBookByISBN(isbn, function(error, result) {
                var book = getBook(result);

                if (book == null) {
                    form.addStickyValidationError("isbn", "cantFindBook");
                    form.result(false);
                } else if (isBookDuplicate(isbn)) {
                    new Confirmation({
                        message: "This book is already in your library, do you really want to add it again?",
                        title: "Duplicate book",
                        cancelText: "No",
                        okText: "Yes",
                        success: false
                    }, function (ok) {
                        if (ok) {
                            addBook(form, doc);
                        } else {
                            form.result(false);
                        }
                    });
                } else {
                    addBook(form, doc);
                }
            });
        },
    },
};

AutoForm.addHooks('insertBookForm', hooks);

Template.bookAdd.events({
    'click #book-add-modal-submit': function (event, template) {
        $('#insertBookForm').submit();
    },
});
