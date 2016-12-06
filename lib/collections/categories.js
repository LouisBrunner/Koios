Categories = new Mongo.Collection('categories');

checkUnique = function (name) {
    var category = Categories.findOne({name: name});

    if (category) {
        throw new Meteor.Error("duplicate-category", "A category with this name already exist");
    }
};

Meteor.methods({
    addCategory: function(doc) {
        check(doc, Schemas.categoryForm);

        checkConnected();

        checkUnique(doc.name);

        var newId = Categories.insert({name: doc.name, owner: getOwner()});

        return { _id: newId };
    },
    updateCategory: function(doc, id) {
        var category = Categories.findOne(id);

        checkDocument(category);

        var someChanges = false;
        var newValues = {};

        if (category.name != doc.name) {
            checkUnique(doc.name);

            newValues.name = doc.name;

            someChanges = true;
        }

        if (someChanges) {
            Categories.update(id, {$set: newValues});
        }

        Books.update({'category._id': id, owner: getOwner()}, {$set: {category: Categories.findOne(id)}});
    },
    removeCategory: function(id) {
        var category = Categories.findOne(id);

        checkDocument(category);

        Categories.remove(id);

        Books.update({'category._id': id, owner: getOwner()}, {$set: {category: null}});
    },
});
