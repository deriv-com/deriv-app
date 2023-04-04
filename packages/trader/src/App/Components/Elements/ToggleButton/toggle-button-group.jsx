import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isButtonSelected } from './helpers';

const ToggleButtonGroup = ({ children, className, multiple, onChange, value, ...others }) => {
    const handleChange = (event, button_value) => {
        if (!onChange) {
            return;
        }

        let new_value = null;

        if (multiple) {
            const index = value && value.indexOf(button_value);

            if (value && index >= 0) {
                new_value = [...value];
                new_value.splice(index, 1);
            } else {
                new_value = value ? [...value, button_value] : [button_value];
            }
        } else {
            new_value = value === button_value ? null : button_value;
        }

        onChange(event, new_value);
    };
    const toggle_buttons = React.Children.map(children, button => {
        if (!React.isValidElement(button)) {
            return null;
        }
        const { is_selected: button_is_selected, value: button_value } = button.props;
        const is_selected =
            button_is_selected === undefined ? isButtonSelected(value, button_value) : button_is_selected;

        return React.cloneElement(button, {
            onChange: handleChange,
            is_selected,
        });
    });

    return (
        <div data-testid='dt_toggle_button_group' className={classNames('toggle-button-group', className)} {...others}>
            {toggle_buttons}
        </div>
    );
};

ToggleButtonGroup.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    /**
     * If `true`, only allow one of the child ToggleButton values to be selected.
     */
    multiple: PropTypes.bool,
    /**
     * Callback fired when the value changes.
     *
     * @param {object} event The event source of the callback
     * @param {object} value of the selected buttons.
     * When `multiple` is false this is a single value;
     * when is true an array of selected values. If no value
     * is selected and `multiple` is false the value is null;
     * when false an empty array.
     */
    onChange: PropTypes.func,
    /**
     * The currently selected value within the group or an array of selected
     * values when `multiple` is true.
     */
    value: PropTypes.any,
};

export default ToggleButtonGroup;
