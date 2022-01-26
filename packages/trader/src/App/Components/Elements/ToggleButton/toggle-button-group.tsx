import classNames from 'classnames';
import React from 'react';
import { isButtonSelected } from './helpers';

type ToggleButtonGroupProps = {
    children: React.ReactNode;
    className: string;
    multiple: boolean;
    onChange: () => void;
    value: unknown;
};

const ToggleButtonGroup = ({ children, className, multiple, onChange, value, ...others }: ToggleButtonGroupProps) => {
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
        <div className={classNames('toggle-button-group', className)} {...others}>
            {toggle_buttons}
        </div>
    );
};

export default ToggleButtonGroup;
