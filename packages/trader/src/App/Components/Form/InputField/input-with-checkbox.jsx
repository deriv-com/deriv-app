import PropTypes             from 'prop-types';
import {
    PropTypes as MobxPropTypes,
}                            from 'mobx-react';
import React, {
    useEffect,
    useRef,
    useState,
}                            from 'react';
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
    is_disabled,
    is_single_currency,
    is_negative_disabled,
    label,
    name,
    onChange,
    tooltip_label,
    value,
}) => {
    const checkboxRef = useRef();
    const [is_checked, setChecked] = useState(defaultChecked);

    const checkboxName = `has_${name}`;

    useEffect(() => {
        setChecked(defaultChecked);
    });

    const changeValue = (e) => {
        // e.target.checked is not reliable, we have to toggle its previous value
        onChange({ target: { name: e.target.name, value: !is_checked } });
    };

    const enableInputOnClick = (e) => {
        if (!is_checked) {
            setChecked(true);
            onChange({ target: { name: checkboxName, value: true } });

            const input = e.target.querySelector('input.input-wrapper__input');
            if (input) {
                setTimeout(() => input.focus());
            }
        }
    };

    const input =
        <InputField
            className={className}
            classNameInlinePrefix={classNameInlinePrefix}
            classNameInput={classNameInput}
            currency={currency}
            error_messages={error_messages}
            is_disabled={is_disabled ? 'disabled' : undefined}
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
            onClickInputWrapper={is_disabled ? undefined : enableInputOnClick}
            type='tel'
            value={value}
        />;

    return (
        <React.Fragment>
            <div className='input-wrapper--inline'>
                <Checkbox
                    className={`${name}-checkbox__input`}
                    ref={checkboxRef}
                    id={`dt_${name}-checkbox_input`}
                    onChange={changeValue}
                    name={checkboxName}
                    label={label}
                    classNameLabel={`${name}-checkbox__label`}
                    defaultChecked={defaultChecked}
                    disabled={is_disabled}
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
    className            : PropTypes.string,
    classNameInlinePrefix: PropTypes.string,
    classNameInput       : PropTypes.string,
    classNamePrefix      : PropTypes.string,
    currency             : PropTypes.string,
    defaultChecked       : PropTypes.bool,
    error_messages       : MobxPropTypes.arrayOrObservableArray,
    is_negative_disabled : PropTypes.bool,
    is_single_currency   : PropTypes.bool,
    label                : PropTypes.string,
    name                 : PropTypes.string,
    onChange             : PropTypes.func,
    tooltip_label        : PropTypes.string,
    value                : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default InputWithCheckbox;

