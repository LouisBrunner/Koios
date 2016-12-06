
var hooks = {
    before: {
        'method-update': function(doc) {
            var newDoc = {};

            if (doc.$set.borrower != "") {
                newDoc.borrower = doc.$set.borrower;
            }
            if (doc.$set.borrowedDate != "") {
                newDoc.borrowedDate = doc.$set.borrowedDate;
            }

            if (checkBorrowed(this, newDoc)) {
                $('#book-edit-modal').modal('hide');
                this.result(doc);
            }
        },
    },
};

AutoForm.addHooks('updateBookForm', hooks);

Template.bookEdit.helpers({
    currentDoc: function() {
        return Books.findOne(Session.get('book-edit-id'));
    },
});

Template.bookEdit.events({
    'click #book-edit-modal-submit': function (event, template) {
        $('#updateBookForm').submit();
    },
});
