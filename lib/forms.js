var datepickerConf = {
    autoclose: true,
    format: "yyyy-mm-dd",
    weekStart: 1,
    todayBtn: "linked",
    clearBtn: true
};

checkBorrowed = function(form, doc) {
    form.removeStickyValidationError("borrowedDate");
    form.removeStickyValidationError("borrower");

    if (doc.borrower && !doc.borrowedDate) {
        form.addStickyValidationError("borrowedDate", "missingBorrowedDate");
        form.result(false);
        return false;
    }
    if (!doc.borrower && doc.borrowedDate) {
        form.addStickyValidationError("borrower", "missingBorrower");
        form.result(false);
        return false;
    }
    return true;
};

Schemas = {};

Schemas.bookForm = new SimpleSchema({
    isbn: {
        type: String,
        label: "ISBN",
        regEx: /^(ISBN[-]*(1[03])*[ ]*(: ){0,1})*(([0-9Xx][- ]*){13}|([0-9Xx][- ]*){10})$/,
        autoform: {
            placeholder: "978-3-16-148410-0",
            icon: "glyphicon-book",
            group: '1) General',
        },
    },
    location: {
        type: String,
        label: "Location",
        autoform: {
            placeholder: "Strasbourg - Etagère en haut à gauche",
            icon: "glyphicon-home",
            group: '1) General',
        },
    },
    comment: {
        type: String,
        label: "Comment",
        optional: true,
        autoform: {
            type: 'textarea',
            placeholder: "Good read, pretty boring or nothing",
            icon: "glyphicon-pencil",
            group: '1) General',
            rows: 3,
        },
    },
    category: {
        type: String,
        label: "Category",
        optional: true,
        autoform: {
            type: 'select',
            group: '1) General',
            // icon: "glyphicon-tags",
            placeholder: "Select a category or nothing",
            afFieldInput: {
                class: "to-selectize",
            },
        },
    },
    returnDate: {
        type: Date,
        label: "Return date",
        optional: true,
        autoform: {
            type: "bootstrap-datepicker",
            datePickerOptions: datepickerConf,
            placeholder: "2015-10-08 or nothing",
            icon: "glyphicon-calendar",
            group: '2) To Return',
        }
    },
    borrower: {
        type: String,
        label: "Borrower",
        optional: true,
        autoform: {
            placeholder: "Eve or nothing",
            icon: "glyphicon-user",
            group: '3) Borrowed',
        }
    },
    borrowedDate: {
        type: Date,
        label: "Borrowed date",
        optional: true,
        autoform: {
            type: "bootstrap-datepicker",
            datePickerOptions: datepickerConf,
            placeholder: "2015-10-21 or nothing",
            icon: "glyphicon-calendar",
            group: '3) Borrowed',
        }
    },
});

Schemas.bookForm.messages({
    cantFindBook: "Can't find this book",
    missingBorrower: "Borrowed date is filled but Borrower is missing",
    missingBorrowedDate: "Borrower is filled but Borrowed date is missing",
});

Schemas.categoryForm = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        autoform: {
            placeholder: "Fiction",
            icon: "glyphicon-tag",
        },
    },
});

Schemas.categoryForm.messages({
    'duplicate-category': "A category with this name already exist",
});
