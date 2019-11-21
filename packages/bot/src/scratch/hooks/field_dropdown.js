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

/**
 * This function is hooked to change backgound color and change dropdown lists shape from rounded corner box to oval shape,
 * e.g. for market list, trade type, etc.
 *      'rx': Blockly.BlockSvg.CORNER_RADIUS * 4,
 *      'ry': Blockly.BlockSvg.CORNER_RADIUS * 4,
 */
Blockly.FieldDropdown.prototype.init = function() {
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
        'height': `${this.arrowSize_  }px`,
        'width' : `${this.arrowSize_  }px`,
    });
    this.arrow_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', `${Blockly.mainWorkspace.options.pathToMedia  }dropdown-arrow.svg`);
    this.className_ += ' blocklyDropdownText';
  
    Blockly.FieldDropdown.superClass_.init.call(this);
    // If not in a shadow block, draw a box.
    if (!this.sourceBlock_.isShadow()) {
        this.box_ = Blockly.utils.createSvgElement('rect', {
            'rx'          : Blockly.BlockSvg.CORNER_RADIUS * 4,
            'ry'          : Blockly.BlockSvg.CORNER_RADIUS * 4,
            'x'           : 0,
            'y'           : 0,
            'width'       : this.size_.width,
            'height'      : this.size_.height,
            'stroke'      : this.sourceBlock_.getColourTertiary(),
            'fill'        : this.sourceBlock_.getColourTertiary(),
            'fill-opacity': 1,
        }, null);
        this.fieldGroup_.insertBefore(this.box_, this.textElement_);
    }
    // Force a reset of the text to add the arrow.
    const text = this.text_;
    this.text_ = null;
    this.setText(text);
};

/**
 * This one is hooked to prevent the dropddown field background color from changing on item select
 */
Blockly.FieldDropdown.prototype.onHide = function() {
    this.dropDownOpen_ = false;
    // Update colour to look selected.
    if (!this.disableColourChange_ && this.sourceBlock_) {
        if (this.sourceBlock_.isShadow()) {
            this.sourceBlock_.clearShadowColour();
        }
    }
};
