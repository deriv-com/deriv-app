import PropTypes             from 'prop-types';
import React, { useState }   from 'react';
import { Checkbox, Popover } from 'deriv-components';
import CurrencyUtils         from 'deriv-shared/utils/currency';
import Fieldset              from 'App/Components/Form/fieldset.jsx';
import InputField            from 'App/Components/Form/InputField';

const OrderInput = ({
    amount,
    currency,
    is_single_currency,
    name,
    label,
    onChange,
    tooltip_label,
}) => {
    const [disabled, setDisabled] = useState(true);

    const changeValue = (e) => {
        const { checked } = e.target;
        setDisabled(!checked);
        onChange({ target: { name: e.target.name, value: checked } });
    };

    const input =
        <InputField
            className={'trade-container__amount'}
            classNameInlinePrefix={'trade-container__currency'}
            classNameInput='trade-container__input'
            currency={currency}
            is_disabled={disabled ? 'disabled' : undefined}
            fractional_digits={CurrencyUtils.getDecimalPlaces(currency)}
            id={`dt_${name}_input`}
            inline_prefix={is_single_currency ? currency : null}
            is_autocomplete_disabled
            is_float
            is_hj_whitelisted
            is_incrementable
            is_negative_disabled
            max_length={10}
            name={name}
            onChange={onChange}
            type='tel'
            value={amount}
        />;

    return (
        <Fieldset className='trade-container__fieldset center-text'>
            <div className={`${name}-checkbox trade-container__order-input`}>
                <Checkbox
                    className={`${name}-checkbox__input-field`}
                    id={`dt_${name}-checkbox_input`}
                    onChange={changeValue}
                    defaultChecked={!disabled}
                    name={`has_${name}`}
                    label={label}
                    classNameLabel={`${name}-checkbox__label`}
                />
                <Popover
                    alignment='left'
                    icon='info'
                    id={`dt_${name}-checkbox__tooltip`}
                    message={tooltip_label}
                    margin={210}
                />
            </div>
            {input}
        </Fieldset>
    );
};

OrderInput.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    currency          : PropTypes.string,
    is_single_currency: PropTypes.bool,
    name              : PropTypes.string,
    onChange          : PropTypes.func,
    tooltip_label     : PropTypes.string,
};

export default OrderInput;

