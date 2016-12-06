Books = new Mongo.Collection('books');

var handleCategory = function (newCategory) {
    var category = null;
    if (newCategory) {
        category = Categories.findOne(newCategory);
        if (!category) {
            var result = Meteor.call('addCategory', {name: newCategory});
            if (result) {
                category = Categories.findOne(result);
            }
        }
    }
    return category;
};

Meteor.methods({
    addBook: function(doc) {
        check(doc, Schemas.bookForm);

        doc.isbn = simplifyISBN(doc.isbn);

        checkConnected();

        var metadata = getMetadata(doc.isbn);
        var code = generateCode(doc.isbn, metadata);

        var returnDate = null;
        if (doc.returnDate) {
            returnDate = moment(doc.returnDate).toDate();
        }

        var borrowedDate = null;
        if (doc.borrowedDate) {
            borrowedDate = moment(doc.borrowedDate).toDate();
        }

        var category = handleCategory(doc.category);

        var values = {isbn: doc.isbn, code: code, metadata: metadata,
                        owner: getOwner(), location: doc.location, returnDate: returnDate,
                        borrower: doc.borrower, borrowedDate: borrowedDate, comment: doc.comment,
                        category: category,
                    };

        var newId = Books.insert(values);

        return { _id: newId };
    },
    updateBook: function(doc, id) {
        check(doc, Schemas.bookForm);

        doc = doc.$set || {};
        doc.id = id;

        var book = Books.findOne(doc.id);

        checkDocument(book);

        var someChanges = false;
        var newValues = {};

        if (book.isbn != doc.isbn) {
            doc.isbn = simplifyISBN(doc.isbn);

            var metadata = getMetadata(doc.isbn);

            newValues.isbn = doc.isbn;
            newValues.code = generateCode(doc.isbn, metadata);
            newValues.metadata = metadata;

            someChanges = true;
        }
        if (book.location != doc.location) {
            newValues.location = doc.location;

            someChanges = true;
        }
        if (book.returnDate != doc.returnDate) {
            newValues.returnDate = doc.returnDate;
            if (doc.returnDate) {
                newValues.returnDate = moment(doc.returnDate).toDate();
            }

            someChanges = true;
        }
        if (book.borrower != doc.borrower) {
            newValues.borrower = doc.borrower;

            someChanges = true;
        }
        if (book.borrowedDate != doc.borrowedDate) {
            newValues.borrowedDate = doc.borrowedDate;
            if (doc.borrowedDate) {
                newValues.borrowedDate = moment(doc.borrowedDate).toDate();
            }

            someChanges = true;
        }
        if (book.comment != doc.comment) {
            newValues.comment = doc.comment;

            someChanges = true;
        }
        if (book.category != doc.category) {
            newValues.category = handleCategory(doc.category);

            someChanges = true;
        }

        if (someChanges) {
            Books.update(id, {$set: newValues});
        }
    },
    removeBook: function(id) {
        var book = Books.findOne(id);

        checkDocument(book);

        Books.remove(id);
    },
});
