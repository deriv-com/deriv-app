import { localize } from '@deriv/translations';
import { runInvisibleEvents } from '../utils';

/**
 * Custom checkbox implementation.
 * @returns {Blockly.FieldImage} A Blockly.FieldImage pretending to be a checkbox.
 */

const FieldCheckbox = () => {
    const getAltText = is_checked => (is_checked ? localize('Y') : localize('N'));
    const onCheckboxClick = function () {
        if (this.sourceBlock_.workspace.options.readOnly || this.sourceBlock_.isInFlyout) {
            return;
        }
        this.is_checked = !this.is_checked;
        this.setValue(this.is_checked);
        this.setText(getAltText(this.is_checked));
    };

    const icon = new Blockly.FieldImage(true, 16, 16, getAltText(true), onCheckboxClick);

    // Required function on Blockly.Field instances.
    icon.fromJson = (/* options */) => {
        return FieldCheckbox();
    };

    // Custom setValue to support imported values, this allows us to bypass
    // adding domToMutation and mutationToDom logic to each block consuming this checkbox.
    icon.setValue = function (value) {
        const is_checked = value === true || value === 'TRUE';
        const old_value = this.getValue();
        this.src_ = is_checked ? 'TRUE' : 'FALSE';
        const el_field_group = this.fieldGroup_; // eslint-disable-line no-underscore-dangle

        if (el_field_group) {
            Array.from(el_field_group.children).forEach(child_node => el_field_group.removeChild(child_node));

            // Draw a rectangle which is coloured based on the host-block's colour.
            Blockly.utils.dom.createSvgElement(
                'rect',
                {
                    fill: this.sourceBlock_.getColourSecondary(), // eslint-disable-line
                    'fill-rule': 'nonzero',
                    height: this.height_, // eslint-disable-line
                    width: this.width_, // eslint-disable-line
                    rx: 2,
                    stroke: this.sourceBlock_.getColourTertiary(),
                },
                el_field_group
            );

            if (is_checked) {
                // Draw checkmark.
                Blockly.utils.dom.createSvgElement(
                    'path',
                    {
                        fill: 'var(--text-general)',
                        d: 'M6 10.086L3.707 7.793a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 10-1.414-1.414L6 10.086z',
                    },
                    el_field_group
                );
            }
        }

        // Emit an event that can be redone/undone.
        if (this.sourceBlock_ && Blockly.Events.isEnabled()) {
            Blockly.Events.fire(
                new Blockly.Events.BlockChange(this.sourceBlock_, 'field', this.name, old_value, this.getValue())
            );
        }
    };

    return icon;
};

Blockly.fieldRegistry.register('field_image_checkbox', FieldCheckbox());

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
