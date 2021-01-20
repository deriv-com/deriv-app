import { runInvisibleEvents } from '../utils';

/** *
 * Updates a Blockly.FieldDropdown with the passed dropdown_options. Available options:
 * - default_value       : After updating, attempt to set this value as the selected option
 * - should_trigger_event: Should an Blockly.Events.Change event be triggered?
 * - event_group         : Coincides with should_trigger_event, passes event_group along the event chain.
 * - should_pretend_empty: Trigger event, pretend oldValue was empty to force triggering event. Blockly
 *                         filters out and stops events from firing where the oldValue and newValue are the same.
 */
Blockly.FieldDropdown.prototype.updateOptions = function (dropdown_options, options = {}) {
    if (Blockly.DropDownDiv.isVisible()) {
        Blockly.DropDownDiv.hideWithoutAnimation();
    }

    this.menuGenerator_ = dropdown_options;

    // Blockly won't actually fire an event if the oldValue and newValue are the same. This prop
    // sets the event's oldValue to an empty string so it's always executed.
    let previous_value = this.getValue();

    if (options.should_pretend_empty) {
        previous_value = '';
    }

    // Set a flag indicating whether the default value passed to this function is available in the newly
    // set dropdown options, if false the default option will be the first available one.
    const has_default_value = dropdown_options.findIndex(item => item[1] === options.default_value) !== -1;

    runInvisibleEvents(() => {
        this.setValue('');

        if (has_default_value) {
            this.setValue(options.default_value);
        } else if (dropdown_options.length > 0) {
            // Default to first if option isn't available.
            this.setValue(this.menuGenerator_[0][1]);
        } else {
            this.setValue(previous_value);
        }
    });

    // If "should_trigger_event" prop is omitted or set to true, fire an event.
    if (!options.should_trigger_event || options.should_trigger_event === true) {
        const event = new Blockly.Events.BlockChange(
            this.sourceBlock_,
            'field',
            this.name,
            previous_value,
            this.getValue()
        );
        event.recordUndo = false;
        event.group = options.event_group;
        Blockly.Events.fire(event);
    }
};

/**
 * This function is hooked to change backgound color and change dropdown lists shape from rounded corner box to oval shape,
 * e.g. for market list, trade type, etc.
 *      'rx': Blockly.BlockSvg.CORNER_RADIUS * 4,
 *      'ry': Blockly.BlockSvg.CORNER_RADIUS * 4,
 */
Blockly.FieldDropdown.prototype.init = function () {
    if (this.fieldGroup_) {
        // Dropdown has already been initialized once.
        return;
    }
    // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
    // Positioned on render, after text size is calculated.
    /** @type {Number} */
    this.arrowSize_ = 12;
    /** @type {Number} */
    this.arrowX_ = 0;
    /** @type {Number} */
    this.arrowY_ = 11;
    this.arrow_ = Blockly.utils.createSvgElement('image', {
        height: `${this.arrowSize_}px`,
        width: `${this.arrowSize_}px`,
    });
    this.arrow_.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        `${Blockly.mainWorkspace.options.pathToMedia}dropdown-arrow-dark.svg`
    );
    this.className_ += ' blocklyDropdownText';
    // @deriv/bot: stop the drop-down from changing its fill colour to colourTertiary on click
    this.disableColourChange_ = true;

    Blockly.FieldDropdown.superClass_.init.call(this);
    // If not in a shadow block, draw a box.
    if (!this.sourceBlock_.isShadow()) {
        this.box_ = Blockly.utils.createSvgElement(
            'rect',
            {
                rx: Blockly.BlockSvg.CORNER_RADIUS * 4,
                ry: Blockly.BlockSvg.CORNER_RADIUS * 4,
                x: 0,
                y: 0,
                width: this.size_.width,
                height: this.size_.height,
                stroke: this.sourceBlock_.getColourTertiary(),
                'stroke-width': '0.3px',
                fill: this.sourceBlock_.getColourSecondary(),
                'fill-opacity': 1,
            },
            null
        );
        this.fieldGroup_.insertBefore(this.box_, this.textElement_);
    }
    // Force a reset of the text to add the arrow.
    const text = this.text_;
    this.text_ = null;
    this.setText(text);
};

/**
 * Returns whether a dropdown is empty or not.
 */
Blockly.FieldDropdown.prototype.isEmpty = function () {
    return this.menuGenerator_.length === 0 || !this.menuGenerator_[0][1];
};
