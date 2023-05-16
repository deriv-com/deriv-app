import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Text } from '@deriv/components';
import './radio-button.scss';

const RadioButton = ({ id, className, selected_value, value, label, onChange }) => {
    return (
        <label
            htmlFor={id}
            className={classNames('radio-button', className, {
                'radio-button--selected': selected_value === value,
            })}
            onClick={() => onChange({ label, value })}
        >
            <input className='radio-button__input' id={id} type='radio' value={value} />
            <span
                className={classNames('radio-button__circle', {
                    'radio-button__circle--selected': selected_value === value,
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
