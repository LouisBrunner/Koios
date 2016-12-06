Template.afFormGroup_mine.helpers({
  skipLabel: function bsFormGroupSkipLabel() {
    var self = this;

    var type = AutoForm.getInputType(self.afFieldInputAtts);
    return (self.skipLabel || type === "boolean-checkbox");
  },
  bsFieldLabelAtts: function bsFieldLabelAtts() {
    var atts = _.clone(this.afFieldLabelAtts);
    atts = AutoForm.Utility.addClass(atts, "control-label");
    return atts;
  }
});
