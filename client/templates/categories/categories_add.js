
var hooks = {
    before: {
        method: function(doc) {
            this.removeStickyValidationError('name');
            this.result(doc);
        },
    },
    onError: function(formType, error) {
        this.addStickyValidationError('name', error.error);
        AutoForm.validateField(this.formId, 'name');
    },
};

AutoForm.addHooks('insertCategoryForm', hooks);
