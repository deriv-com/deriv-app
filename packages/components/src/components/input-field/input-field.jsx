import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { isCryptocurrency, getCurrencyDisplayCode } from '@deriv/shared';
import IncrementButtons from './increment-buttons.jsx';
import Input from './input.jsx';
import Tooltip from '../tooltip';
import Text from '../text';

const InputField = ({
    ariaLabel,
    checked,
    className,
    classNameDynamicSuffix,
    classNameInlinePrefix,
    classNameInput,
    classNamePrefix,
    classNameWrapper,
    currency,
    current_focus,
    data_tip,
    data_value,
    decimal_point_change,
    error_messages,
    error_message_alignment,
    fractional_digits,
    helper,
    icon,
    id,
    inline_prefix,
    is_autocomplete_disabled,
    is_disabled,
    is_error_tooltip_hidden = false,
    is_float,
    is_hj_whitelisted = false,
    is_incrementable,
    is_incrementable_on_long_press,
    is_negative_disabled,
    is_read_only = false,
    is_signed = false,
    is_unit_at_right = false,
    inputmode,
    increment_button_type,
    label,
    max_length,
    max_value,
    min_value,
    name,
    format,
    onBlur,
    onChange,
    onClick,
    onClickInputWrapper,
    placeholder,
    prefix,
    required,
    setCurrentFocus,
    type,
    unit,
    value,
    data_testid,
}) => {
    const [local_value, setLocalValue] = React.useState();
    const Icon = icon;
    const has_error = error_messages && !!error_messages.length;
    const max_is_disabled = max_value && (+value >= +max_value || +local_value >= +max_value);
    const min_is_disabled = min_value && (+value <= +min_value || +local_value <= +min_value);
    let has_valid_length = true;

    const changeValue = (e, callback) => {
        if (unit) {
            e.target.value = e.target.value.replace(unit, '').trim();
        }

        if (e.target.value === value && type !== 'checkbox') {
            return;
        }

        if (type === 'number' || type === 'tel') {
            const is_empty = !e.target.value || e.target.value === '' || e.target.value === '  ';
            const signed_regex = is_signed ? '^([+-.0-9])' : '^';
            e.target.value = e.target.value.replace(',', '.');

            const is_number = new RegExp(`${signed_regex}(\\d*)?${is_float ? '(\\.\\d+)?' : ''}$`).test(e.target.value);

            const is_not_completed_number =
                is_float && new RegExp(`${signed_regex}(\\.|\\d+\\.)?$`).test(e.target.value);
            // This regex check whether there is any zero at the end of fractional part or not.
            const has_zero_at_end = new RegExp(`${signed_regex}(\\d+)?\\.(\\d+)?[0]+$`).test(e.target.value);

            const is_scientific_notation = /e/.test(`${+e.target.value}`);

            if (max_length && (fractional_digits || fractional_digits === 0)) {
                has_valid_length = new RegExp(
                    `${signed_regex}(\\d{0,${max_length}})(\\${fractional_digits && '.'}\\d{0,${fractional_digits}})?$`
                ).test(e.target.value);
            }

            if ((is_number || is_empty) && has_valid_length) {
                e.target.value =
                    is_empty || is_signed || has_zero_at_end || is_scientific_notation || type === 'tel'
                        ? e.target.value
                        : +e.target.value;
            } else if (!is_not_completed_number) {
                e.target.value = value;
                return;
            }
        }

        onChange(e);
        if (callback) {
            callback(e);
        }
    };

    const getDecimals = val => {
        const array_value = typeof val === 'string' ? val.split('.') : val.toString().split('.');
        return array_value && array_value.length > 1 ? array_value[1].length : 0;
    };

    const getClampedValue = val => {
        let new_value = val;
        if (min_value) {
            new_value = Math.max(new_value, min_value);
        }
        if (max_value) {
            new_value = Math.min(new_value, max_value);
        }
        return new_value;
    };

    const incrementValue = (ev, long_press_step) => {
        if (max_is_disabled) return;
        let increment_value;

        const current_value = local_value || value;

        const decimal_places = current_value ? getDecimals(current_value) : 0;
        const is_crypto = !!currency && isCryptocurrency(currency);

        if (long_press_step) {
            const increase_percentage = Math.min(long_press_step, Math.max(long_press_step, 10)) / 10;
            const increase = (value * increase_percentage) / 100;
            const new_value = parseFloat(current_value || 0) + Math.abs(increase);

            increment_value = parseFloat(getClampedValue(new_value)).toFixed(decimal_places);
        } else if (is_crypto || (!currency && is_float)) {
            const new_value =
                parseFloat(current_value || 0) + parseFloat(1 * 10 ** (0 - (decimal_point_change || decimal_places)));
            increment_value = parseFloat(new_value).toFixed(decimal_point_change || decimal_places);
        } else {
            increment_value = parseFloat((+current_value || 0) + 1).toFixed(decimal_places);
        }

        updateValue(increment_value, !!long_press_step);
    };

    const calculateDecrementedValue = long_press_step => {
        let decrement_value;
        const current_value = local_value || value;

        const decimal_places = current_value ? getDecimals(current_value) : 0;
        const is_crypto = !!currency && isCryptocurrency(currency);

        if (long_press_step) {
            const decrease_percentage = Math.min(long_press_step, Math.max(long_press_step, 10)) / 10;
            const decrease = (value * decrease_percentage) / 100;
            const new_value = parseFloat(current_value || 0) - Math.abs(decrease);

            decrement_value = parseFloat(getClampedValue(new_value)).toFixed(decimal_places);
        } else if (is_crypto || (!currency && is_float)) {
            const new_value =
                parseFloat(current_value || 0) - parseFloat(1 * 10 ** (0 - (decimal_point_change || decimal_places)));
            decrement_value = parseFloat(new_value).toFixed(decimal_point_change || decimal_places);
        } else {
            decrement_value = parseFloat((current_value || 0) - 1).toFixed(decimal_places);
        }
        return decrement_value;
    };

    const decrementValue = (ev, long_press_step) => {
        if (min_is_disabled) {
            return;
        }
        const decrement_value = calculateDecrementedValue(long_press_step);
        if (is_negative_disabled && decrement_value < 0) {
            return;
        }

        updateValue(decrement_value, !!long_press_step);
    };

    const updateValue = (new_value, is_long_press) => {
        let formatted_value = format ? format(new_value) : new_value;
        if (is_long_press) {
            setLocalValue(formatted_value);
        } else {
            if (is_signed && /^\d+/.test(formatted_value) && formatted_value > 0) {
                formatted_value = `+${formatted_value}`;
            }
            onChange({ target: { value: formatted_value, name } });
        }
    };

    const onLongPressEnd = () => {
        const new_value = local_value;
        const formatted_value = format ? format(new_value) : new_value;
        onChange({ target: { value: formatted_value, name } });

        setLocalValue();
    };

    const onKeyPressed = e => {
        if (e.keyCode === 38) incrementValue(); // up-arrow pressed
        if (e.keyCode === 40) decrementValue(); // down-arrow pressed
    };

    let display_value = local_value || value;

    if (unit) {
        display_value = is_unit_at_right ? `${value} ${unit}` : `${unit} ${value}`;
    }

    const is_increment_input = is_incrementable && (type === 'number' || type === 'tel');

    const input = (
        <Input
            ariaLabel={ariaLabel}
            changeValue={changeValue}
            checked={checked}
            current_focus={current_focus}
            className={classNames(
                is_increment_input ? 'dc-input-wrapper__input' : '',
                inline_prefix ? 'input--has-inline-prefix' : '',
                'input',
                { 'input--error': has_error },
                classNameInput
            )}
            classNameDynamicSuffix={classNameDynamicSuffix}
            classNameInlinePrefix={classNameInlinePrefix}
            data_tip={data_tip}
            data_testid={data_testid}
            data_value={data_value}
            display_value={display_value}
            fractional_digits={fractional_digits}
            has_error={has_error}
            id={id}
            inline_prefix={inline_prefix}
            is_autocomplete_disabled={is_autocomplete_disabled}
            is_disabled={is_disabled}
            is_hj_whitelisted={is_hj_whitelisted}
            is_incrementable={is_increment_input}
            is_read_only={is_read_only}
            max_length={max_length}
            name={name}
            onBlur={onBlur}
            onClick={onClick}
            onKeyPressed={onKeyPressed}
            placeholder={placeholder}
            required={required}
            setCurrentFocus={setCurrentFocus}
            type={type}
            inputmode={inputmode}
        />
    );

    const increment_buttons = (
        <IncrementButtons
            id={id}
            max_is_disabled={max_is_disabled || !!is_disabled}
            incrementValue={incrementValue}
            min_is_disabled={
                min_is_disabled || (is_negative_disabled && calculateDecrementedValue() < 0) || !!is_disabled
            }
            decrementValue={decrementValue}
            onLongPressEnd={onLongPressEnd}
            is_incrementable_on_long_press={is_incrementable_on_long_press}
            type={increment_button_type}
        />
    );

    const input_tooltip = (
        <Tooltip
            className={classNames('trade-container__tooltip', { 'dc-tooltip--with-label': label })}
            alignment={error_message_alignment || 'left'}
            message={has_error ? error_messages[0] : null}
            has_error={!is_error_tooltip_hidden && has_error}
        >
            {!!label && (
                <label htmlFor={name} className='dc-input-field__label'>
                    {label}
                </label>
            )}
            {!!helper && (
                <Text size='xxs' color='less-prominent' weight='lighter'>
                    {helper}
                </Text>
            )}
            {is_increment_input ? (
                <div
                    className={classNames(
                        'dc-input-wrapper',
                        {
                            'dc-input-wrapper--disabled': !!is_disabled,
                        },
                        classNameWrapper
                    )}
                >
                    {increment_buttons}
                    {input}
                </div>
            ) : (
                input
            )}
        </Tooltip>
    );

    return (
        <React.Fragment>
            {!!prefix && (
                <div className={classNamePrefix}>
                    <span className={classNames(`${classNamePrefix}--symbol`, 'symbols')}>
                        {getCurrencyDisplayCode(currency)}
                    </span>
                </div>
            )}
            <div className={classNames('dc-input-field', className)} onClick={onClickInputWrapper}>
                {icon && <Icon onClick={onClick} />}
                {input_tooltip}
            </div>
        </React.Fragment>
    );
};

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
InputField.propTypes = {
    ariaLabel: PropTypes.string,
    checked: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    classNameInlinePrefix: PropTypes.string,
    classNameInput: PropTypes.string,
    classNameDynamicSuffix: PropTypes.string,
    classNamePrefix: PropTypes.string,
    classNameWrapper: PropTypes.string, // CSS class for the component wrapper
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    decimal_point_change: PropTypes.number, // Specify which decimal point must be updated when the increment/decrement button is pressed
    error_messages: PropTypes.array,
    error_message_alignment: PropTypes.string,
    fractional_digits: PropTypes.number,
    helper: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    id: PropTypes.string,
    inline_prefix: PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled: PropTypes.string,
    is_float: PropTypes.bool,
    is_hj_whitelisted: PropTypes.bool,
    is_incrementable: PropTypes.bool,
    is_incrementable_on_long_press: PropTypes.bool,
    is_negative_disabled: PropTypes.bool,
    is_read_only: PropTypes.bool,
    is_signed: PropTypes.bool,
    is_unit_at_right: PropTypes.bool,
    increment_button_type: PropTypes.string,
    label: PropTypes.string,
    max_length: PropTypes.number,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onClickInputWrapper: PropTypes.func,
    placeholder: PropTypes.string,
    prefix: PropTypes.string,
    required: PropTypes.bool,
    setCurrentFocus: PropTypes.func,
    type: PropTypes.string,
    unit: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    data_testid: PropTypes.string,
    data_tip: PropTypes.string,
    data_value: PropTypes.string,
    is_error_tooltip_hidden: PropTypes.bool,
    inputmode: PropTypes.string,
    max_value: PropTypes.number,
    min_value: PropTypes.number,
    format: PropTypes.func,
};

export default InputField;
