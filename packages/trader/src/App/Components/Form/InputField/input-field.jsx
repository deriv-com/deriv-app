import classNames                from 'classnames';
import {
    observer,
    PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                 from 'prop-types';
import React                     from 'react';
import CurrencyUtils             from 'deriv-shared/utils/currency';
import Tooltip                   from 'App/Components/Elements/tooltip.jsx';
import IncrementButtons          from './increment-buttons.jsx';
import Input                     from './input.jsx';

class InputField extends React.Component {
    render () {
        const {
            checked,
            className,
            classNameInlinePrefix,
            classNameInput,
            classNamePrefix,
            currency,
            data_tip,
            data_value,
            error_messages,
            fractional_digits,
            helper,
            id,
            inline_prefix,
            is_autocomplete_disabled,
            is_disabled,
            is_float,
            is_hj_whitelisted = false,
            is_incrementable,
            is_negative_disabled,
            is_read_only = false,
            is_signed = false,
            is_unit_at_right = false,
            label,
            max_length,
            max_value,
            min_value,
            name,
            onChange,
            onClick,
            placeholder,
            prefix,
            required,
            type,
            unit,
            value,
        } = this.props;
        const Icon = this.props.icon;
        const has_error       = error_messages && !!error_messages.length;
        let has_valid_length  = true;
        const max_is_disabled = max_value && +value >= +max_value;
        const min_is_disabled = min_value && +value <= +min_value;

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

                const is_number = new RegExp(`${signed_regex}(\\d*)?${is_float ? '(\\.\\d+)?' : ''}$`)
                    .test(e.target.value);

                const is_not_completed_number = is_float && new RegExp(`${signed_regex}(\\.|\\d+\\.)?$`)
                    .test(e.target.value);
                // This regex check whether there is any zero at the end of fractional part or not.
                const has_zero_at_end = new RegExp(`${signed_regex}(\\d+)?\\.(\\d+)?[0]+$`)
                    .test(e.target.value);

                const is_scientific_notation = /e/.test(`${+e.target.value}`);

                if (max_length && fractional_digits) {
                    has_valid_length = new RegExp(`${signed_regex}(\\d{0,${max_length}})(\\.\\d{0,${fractional_digits}})?$`)
                        .test(e.target.value);
                }

                if (((is_number) || is_empty) && has_valid_length) {
                    e.target.value = is_empty || is_signed || has_zero_at_end || is_scientific_notation || type === 'tel'
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

        const getDecimals = (val) => {
            const array_value = typeof val === 'string' ? val.split('.') : val.toString().split('.');
            return array_value && array_value.length > 1 ? array_value[1].length : 0;
        };

        const incrementValue = () => {
            if (max_is_disabled) return;
            let increment_value;

            const decimal_places = value ? getDecimals(value) : 0;
            const is_crypto      = !!currency && CurrencyUtils.isCryptocurrency(currency);

            if (is_crypto || (!currency && is_float)) {
                const new_value = parseFloat(+value) + parseFloat(1 * 10 ** (0 - decimal_places));
                increment_value = parseFloat(new_value).toFixed(decimal_places);
            } else {
                increment_value = parseFloat((+value) + 1).toFixed(decimal_places);
            }
            onChange({ target: { value: increment_value, name } });
        };

        const calculateDecrementedValue = () => {
            let decrement_value;

            const decimal_places = value ? getDecimals(value) : 0;
            const is_crypto      = !!currency && CurrencyUtils.isCryptocurrency(currency);

            if (is_crypto || (!currency && is_float)) {
                const new_value = parseFloat(+value) - parseFloat(1 * 10 ** (0 - decimal_places));
                decrement_value = parseFloat(new_value).toFixed(decimal_places);
            } else {
                decrement_value = parseFloat((+value) - 1).toFixed(decimal_places);
            }
            return decrement_value;
        };

        const decrementValue = () => {
            if (!value || min_is_disabled) return;
            const decrement_value = calculateDecrementedValue();
            if (is_negative_disabled && decrement_value < 0) return;
            onChange({ target: { value: decrement_value, name } });
        };

        const onKeyPressed = (e) => {
            if (e.keyCode === 38) incrementValue(); // up-arrow pressed
            if (e.keyCode === 40) decrementValue(); // down-arrow pressed
        };

        let display_value = value;

        if (unit) {
            display_value = is_unit_at_right ? `${value} ${unit}` : `${unit} ${value}`;
        }

        const is_increment_input = is_incrementable && (type === 'number' || type === 'tel');

        const input =
            <Input
                changeValue={changeValue}
                checked={checked}
                className={classNames(is_increment_input ? 'input-wrapper__input' : '', inline_prefix ? 'input--has-inline-prefix' : '', 'input', { 'input--error': has_error }, classNameInput)}
                classNameInlinePrefix={classNameInlinePrefix}
                data_tip={data_tip}
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
                onClick={onClick}
                onKeyPressed={onKeyPressed}
                placeholder={placeholder}
                required={required}
                type={type}
            />;

        const increment_buttons =
            <IncrementButtons
                id={id}
                max_is_disabled={max_is_disabled}
                incrementValue={incrementValue}
                min_is_disabled={min_is_disabled || (is_negative_disabled && calculateDecrementedValue() < 0)}
                decrementValue={decrementValue}
            />;

        const input_tooltip =
            <Tooltip
                className={classNames('', { 'tooltip--with-label': label })}
                alignment='left'
                message={has_error ? error_messages[0] : null}
                has_error={has_error}
            >
                {!!label &&
                <label htmlFor={name} className='input-field__label'>{label}</label>
                }
                {!!helper &&
                <span className='input-field__helper'>{helper}</span>
                }
                {is_increment_input ?
                    <div className='input-wrapper'>
                        {increment_buttons}
                        {input}
                    </div>
                    :
                    input
                }
            </Tooltip>;

        return (
            <React.Fragment>
                {!!prefix &&
                <div className={classNamePrefix}>
                    <span className={classNames(`${classNamePrefix}--symbol`, 'symbols', `symbols--${prefix.toLowerCase()}`)} />
                </div>
                }
                <div
                    className={classNames('input-field', className)}
                >
                    {this.props.icon &&
                    <Icon onClick={onClick} />
                    }
                    {input_tooltip}
                </div>
            </React.Fragment>
        );

    }
}

// ToDo: Refactor input_field
// supports more than two different types of 'value' as a prop.
// Quick Solution - Pass two different props to input field.
InputField.propTypes = {
    checked: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    className            : PropTypes.string,
    classNameInlinePrefix: PropTypes.string,
    classNameInput       : PropTypes.string,
    classNamePrefix      : PropTypes.string,
    currency             : PropTypes.string,
    error_messages       : MobxPropTypes.arrayOrObservableArray,
    fractional_digits    : PropTypes.number,
    helper               : PropTypes.string,
    icon                 : PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node,
    ]),
    id                      : PropTypes.string,
    inline_prefix           : PropTypes.string,
    is_autocomplete_disabled: PropTypes.bool,
    is_disabled             : PropTypes.string,
    is_float                : PropTypes.bool,
    is_hj_whitelisted       : PropTypes.bool,
    is_incrementable        : PropTypes.bool,
    is_negative_disabled    : PropTypes.bool,
    is_read_only            : PropTypes.bool,
    is_signed               : PropTypes.bool,
    is_unit_at_right        : PropTypes.bool,
    label                   : PropTypes.string,
    max_length              : PropTypes.number,
    name                    : PropTypes.string,
    onChange                : PropTypes.func,
    onClick                 : PropTypes.func,
    placeholder             : PropTypes.string,
    prefix                  : PropTypes.string,
    required                : PropTypes.bool,
    type                    : PropTypes.string,
    unit                    : PropTypes.string,
    value                   : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export default observer(InputField);
