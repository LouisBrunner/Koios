/*
** Permissions
*/

getOwner = function(self) {
    if (self != null) {
        return self.userId;
    }
    return Meteor.userId();
};

ownsDocument = function (doc) {
    return doc.owner === Meteor.userId();
};

throwUnauthorized = function() {
    throw new Meteor.Error("not-authorized", "Unauthorized action");
};

checkDocument = function(doc) {
    if (doc == null) {
        throw new Meteor.Error("invalid-argument", "Document doesn't exist");
    }

    if (!ownsDocument(doc)) {
        throwUnauthorized();
    }
};

checkConnected = function() {
    if (!Meteor.userId()) {
        throwUnauthorized();
    }
};

isBookDuplicate = function(isbn) {
    return Books.find({'isbn': isbn}).count() > 0;
};

/*
** ISBN Manipulation
*/

simplifyISBN = function(isbn) {
    isbn = isbn.replace('-', '');
    isbn = isbn.replace(/^ISBN:? ?/i, '');
    return isbn;
};

formatInteger = function(n, p) {
    var str = "" + n;
    while (str.length < p) {
        str = "0" + str;
    }
    return str;
};

generateCode = function(isbn, metadata) {
    if (metadata.author && metadata.title) {
        var authorNames = metadata.author.split(' ');
        var authorCode = authorNames[authorNames.length - 1].toUpperCase().substr(0, 3);
        var regex = new RegExp("^" + authorCode + ".*");
        return authorCode + formatInteger(Books.find({code: regex}).count() + 1, 3);
    }
    return "ZZZ" + isbn.substr(0, 3);
};

getMetadata = function(isbn) {
    var data = fetchBookByISBN(isbn);
    var metadata = {};
    if (data) {
        metadata.title = data.volumeInfo.title;
        if (data.volumeInfo.authors && data.volumeInfo.authors.length > 0) {
            metadata.author = data.volumeInfo.authors[0];
        }
    }
    return metadata;
};

/*
** Book API Abstraction
*/

fetchBookByISBN = function(isbn, callback) {
    var data = googleFetchBookByISBN(isbn, callback);
    if (callback == null) {
        if (data) {
            if (data.volumeInfo) {
                return data;
            }
        }
    }
    return null;
};

getBook = function(result) {
    var book = getGoogleBook(result);
    return book;
};
