ServiceConfiguration.configurations.upsert({
    service: 'facebook'
}, {
  $set: {
    appId: Meteor.settings.facebook.appId,
    secret: Meteor.settings.facebook.secret
  }
});
