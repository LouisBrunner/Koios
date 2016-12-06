Meteor.publish('books', function() {
  return Books.find({ owner: getOwner(this) });
});

Meteor.publish('categories', function() {
  return Categories.find({ owner: getOwner(this) });
});
