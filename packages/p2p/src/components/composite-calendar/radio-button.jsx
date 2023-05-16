import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Text } from '@deriv/components';

const RadioButton = ({ id, className, selected_value, value, label, onChange }) => {
    return (
        <label
            htmlFor={id}
            className={classNames('composite-calendar-modal__radio', className, {
                'composite-calendar-modal__radio--selected': selected_value === value,
            })}
            onClick={() => onChange({ label, value })}
        >
            <input className='composite-calendar-modal__radio-input' id={id} type='radio' value={value} />
            <span
                className={classNames('composite-calendar-modal__radio-circle', {
                    'composite-calendar-modal__radio-circle--selected': selected_value === value,
                })}
            />
            <Text
                as='p'
                color='prominent'
                size='xs'
                line_height='unset'
                weight={selected_value === value ? 'bold' : 'normal'}
            >
                {label}
            </Text>
        </label>
    );
};

RadioButton.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
    selected_value: PropTypes.string,
};

export default RadioButton;
