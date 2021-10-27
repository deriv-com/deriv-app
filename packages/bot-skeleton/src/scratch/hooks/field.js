import { localize } from '@deriv/translations';

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
            Blockly.utils.createSvgElement(
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
                Blockly.utils.createSvgElement(
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

Blockly.Field.register('field_image_checkbox', FieldCheckbox());
