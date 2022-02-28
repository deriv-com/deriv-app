import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { InputField } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './floating-rate.scss';

const FloatingRate = ({
    changeHandler,
    class_name,
    exchange_rate,
    error_messages,
    fiat_currency,
    local_currency,
    offset,
    place_holder,
    ...props
}) => {
    const { general_store } = useStores();
    const { name, value, required } = props;
    const market_feed = value ? parseFloat(exchange_rate * (1 + value / 100)).toFixed(2) : exchange_rate;

    return (
        <div className={classNames(class_name, 'floating-rate')}>
            <section className={classNames('floating-rate__field', isMobile() ? 'mobile-layout' : '')}>
                <InputField
                    ariaLabel='Floating rate'
                    classNameInlinePrefix='floating-rate__percent'
                    classNameInput={classNames(
                        'floating-rate__input',
                        error_messages ? 'floating-rate__input__error_field' : ''
                    )}
                    id='floating_rate_input'
                    inline_prefix='%'
                    is_autocomplete_disabled
                    is_float
                    is_incrementable
                    is_signed
                    inputmode='decimal'
                    increment_button_type='button'
                    max_value={offset.upper_limit}
                    min_value={offset.lower_limit}
                    name={name}
                    onChange={changeHandler}
                    placeholder={place_holder}
                    setCurrentFocus={general_store.setCurrentFocus}
                    required={required}
                    type='number'
                    value={value}
                />
                <div className='floating-rate__mkt-rate'>
                    <span className='floating-rate__mkt-rate__label'> {localize('of the market rate')}</span>
                    <span className='floating-rate__mkt-rate__msg'>
                        {localize('1')} {fiat_currency} = {exchange_rate} {local_currency}
                    </span>
                </div>
            </section>
            {error_messages ? (
                <div className='floating-rate__error_message'>{error_messages}</div>
            ) : (
                <div className='floating-rate__hint'>
                    {localize('Your rate is')} = {market_feed} {local_currency}
                </div>
            )}
        </div>
    );
};

FloatingRate.propTypes = {
    changeHandler: PropTypes.func,
    class_name: PropTypes.string,
    exchange_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    error_messages: PropTypes.string,
    fiat_currency: PropTypes.string,
    local_currency: PropTypes.string,
    offset: PropTypes.object,
    place_holder: PropTypes.string,
};

export default FloatingRate;
