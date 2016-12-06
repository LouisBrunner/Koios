
Template.bookActions.events({
    'click .lookup': function(e) {
        e.preventDefault();

        var isbn = this.isbn;

        Session.set('isbn-metadata', {isbn: isbn});

        if (isbn) {
            Session.set('isbn-metadata', {loading: true});

            fetchBookByISBN(isbn, function(errors, result) {
                var data = getBook(result);
                var metadata = {};

                metadata.isbn = isbn;

                if (data) {
                    if (data.volumeInfo) {
                        metadata.title = data.volumeInfo.title;
                        metadata.subtitle = data.volumeInfo.subtitle;
                        metadata.description = data.volumeInfo.description;
                        metadata.language = data.volumeInfo.language;
                        if (data.volumeInfo.authors) {
                            metadata.author = data.volumeInfo.authors.join(', ');
                        }
                        metadata.categories = data.volumeInfo.categories;
                        metadata.rating = data.volumeInfo.averageRating;
                        metadata.ratingsCount = data.volumeInfo.ratingsCount;
                        metadata.pages = data.volumeInfo.pageCount;
                        metadata.infoLink = data.volumeInfo.infoLink;
                        metadata.publishedDate = data.volumeInfo.publishedDate;
                        metadata.publisher = data.volumeInfo.publisher;
                        if (data.volumeInfo.imageLinks) {
                            metadata.picture = data.volumeInfo.imageLinks.thumbnail;
                        }
                    }
                    if (data.accessInfo) {
                        metadata.publicDomain = data.accessInfo.publicDomain;
                    }
                }

                Session.set('isbn-metadata', metadata);
            });
        }

        $('#lookup-modal').modal({
            show: true,
            keyboard: true,
        });
    },
    'click .edit': function(e) {
        e.preventDefault();
        Session.set('book-edit-id', this._id);
        var modal = $('#book-edit-modal');
        resetPage(modal);
        modal.modal({
            show: true,
            keyboard: true,
        });
    },
    'click .remove': function(e) {
        e.preventDefault();
        var id = this._id;
        new Confirmation({
          message: "Do you really want to delete this book ?",
          title: "Confirmation",
          cancelText: "Cancel",
          okText: "Ok",
          success: false
        }, function (ok) {
            if (ok) {
                Meteor.call('removeBook', id, function(error, result) {
                    if (error) {
                        throwError(error);
                    } else {
                        sAlert.info("Book deleted");
                    }
                });
            }
        });
    },
});
