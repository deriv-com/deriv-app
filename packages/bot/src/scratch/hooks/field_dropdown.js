/* eslint-disable func-names, no-underscore-dangle */
/** *
 * Updates a Blockly.FieldDropdown with the passed dropdown_options. Available options:
 * - default_value       : After updating, attempt to set this value as the selected option
 * - should_trigger_event: Should an Blockly.Events.Change event be triggered?
 * - event_group         : Coincides with should_trigger_event, passes event_group along the event chain.
 * - should_pretend_empty: Trigger event, pretend oldValue was empty to force triggering event. Blockly
 *                         filters out and stops events from firing where the oldValue and newValue are the same.
 */
Blockly.FieldDropdown.prototype.updateOptions = function(dropdown_options, options = {}) {
    Blockly.Events.disable();

    let previous_value = this.getValue();
    let has_default_value = false;

    // Blockly won't actually fire an event if the oldValue and newValue are the same.
    if (options.should_pretend_empty) {
        previous_value = '';
    }

    if (options.default_value) {
        has_default_value = dropdown_options.findIndex(item => item[1] === options.default_value) !== -1;
    }

    this.menuGenerator_ = dropdown_options;

    if (has_default_value) {
        // Set default value if available in new options.
        this.setValue('');
        this.setValue(options.default_value);
    } else if (dropdown_options.length > 0) {
        // Default to first if option isn't available.
        this.setValue('');
        this.setValue(this.menuGenerator_[0][1]);
    }
    
    Blockly.Events.enable();

    if (Blockly.DropDownDiv.isVisible()) {
        Blockly.DropDownDiv.hideWithoutAnimation();
    }

    if (!options.should_trigger_event || options.should_trigger_event === true) {
        const event = new Blockly.Events.BlockChange(this.sourceBlock_, 'field', this.name, previous_value, this.getValue());

        event.recordUndo = false;
        
        if (options.event_group) {
            event.group = options.event_group;
        }

        Blockly.Events.fire(event);
    }
};
