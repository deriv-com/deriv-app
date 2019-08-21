/* eslint-disable func-names, no-underscore-dangle */
Blockly.FieldDropdown.prototype.updateOptions = function(options, opt_default = null, should_trigger_event = true) {
    Blockly.Events.disable();

    const previous_value = this.getValue();

    this.menuGenerator_ = options;

    if (opt_default && this.menuGenerator_.findIndex(item => item[1] === opt_default) !== -1) {
        this.setValue('');
        this.setValue(opt_default);
    } else if (this.menuGenerator_.length > 0) {
        this.setValue('');
        this.setValue(this.menuGenerator_[0][1]);
    }

    Blockly.Events.enable();

    if (should_trigger_event) {
        const event = new Blockly.Events.BlockChange(this.sourceBlock_, 'field', this.name, previous_value, this.getValue());
        Blockly.Events.fire(event);
    }
};
