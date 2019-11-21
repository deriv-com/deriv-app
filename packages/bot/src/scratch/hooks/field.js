/**
 * By default there is no difference between the human-readable text and
 * the language-neutral values.  Subclasses (such as dropdown) may define this.
 * @param {string} newValue New value.
 */
Blockly.Field.prototype.setValue = function (new_value, options = {}) {
    if (new_value === null) {
        // No change if null.
        return;
    }
    const old_value = this.getValue();
    if (old_value == new_value) {
        return;
    }
    if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
        const event = new Blockly.Events.BlockChange(
            this.sourceBlock_, 'field', this.name, old_value, new_value);

        if (!options.record_undo) {
            event.recordUndo = false;
        }

        if (options.event_group) {
            event.group = options.event_group;
        }
            
        Blockly.Events.fire(event);
    }
    this.setText(new_value);
};
