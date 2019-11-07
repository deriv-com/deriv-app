import PropTypes             from 'prop-types';
import React, { useState }   from 'react';
import { Checkbox, Popover } from 'deriv-components';
import CurrencyUtils         from 'deriv-shared/utils/currency';
import InputField            from './input-field.jsx';

const InputWithCheckbox = ({
    classNameInlinePrefix,
    classNameInput,
    className,
    currency,
    defaultChecked,
    error_messages,
    is_single_currency,
    is_negative_disabled = true,
    label,
    name,
    onChange,
    tooltip_label,
    value,
}) => {
    const [disabled, setDisabled] = useState(!defaultChecked);

    const changeValue = (e) => {
        const { checked } = e.target;
        setDisabled(!checked);
        onChange({ target: { name: e.target.name, value: checked } });
    };

    const input =
        <InputField
            className={className}
            classNameInlinePrefix={classNameInlinePrefix}
            classNameInput={classNameInput}
            currency={currency}
            error_messages={error_messages}
            is_disabled={disabled ? 'disabled' : undefined}
            fractional_digits={CurrencyUtils.getDecimalPlaces(currency)}
            id={`dt_${name}_input`}
            inline_prefix={is_single_currency ? currency : null}
            is_autocomplete_disabled
            is_float
            is_hj_whitelisted
            is_incrementable
            is_negative_disabled={is_negative_disabled}
            max_length={10}
            name={name}
            onChange={onChange}
            type='tel'
            value={value}
        />;

    return (
        <React.Fragment>
            <div className='input-wrapper--inline'>
                <Checkbox
                    className={`${name}-checkbox__input`}
                    id={`dt_${name}-checkbox_input`}
                    onChange={changeValue}
                    defaultChecked={!disabled}
                    name={`has_${name}`}
                    label={label}
                    classNameLabel={`${name}-checkbox__label`}
                />
                {tooltip_label &&
                    <Popover
                        alignment='left'
                        icon='info'
                        id={`dt_${name}-checkbox__tooltip`}
                        message={tooltip_label}
                        margin={210}
                    />
                }
            </div>
            {input}
        </React.Fragment>
    );
};

InputWithCheckbox.propTypes = {
    currency            : PropTypes.string,
    defaultChecked      : PropTypes.bool,
    is_negative_disabled: PropTypes.bool,
    is_single_currency  : PropTypes.bool,
    max_value           : PropTypes.number,
    name                : PropTypes.string,
    onChange            : PropTypes.func,
    tooltip_label       : PropTypes.string,
    value               : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default InputWithCheckbox;

