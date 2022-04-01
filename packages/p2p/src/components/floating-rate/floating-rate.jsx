import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { InputField, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './floating-rate.scss';

const FloatingRate = ({
    change_handler,
    className,
    exchange_rate,
    error_messages,
    fiat_currency,
    local_currency,
    offset,
    placeholder,
    ...props
}) => {
    const { general_store } = useStores();
    const { name, value, required } = props;
    const market_feed = value ? parseFloat(exchange_rate * (1 + value / 100)).toFixed(2) : exchange_rate;

    return (
        <div className={classNames(className, 'floating-rate')}>
            <section className={classNames('floating-rate__field', { 'mobile-layout': isMobile() })}>
                <InputField
                    ariaLabel='Floating rate'
                    classNameInlinePrefix='floating-rate__percent'
                    classNameInput={classNames('floating-rate__input', {
                        'floating-rate__input--error-field': error_messages,
                    })}
                    current_focus={general_store.current_focus}
                    decimal_point_change={2}
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
                    onChange={change_handler}
                    placeholder={placeholder}
                    setCurrentFocus={general_store.setCurrentFocus}
                    required={required}
                    type='number'
                    value={value}
                />
                <div className='floating-rate__mkt-rate'>
                    <Text
                        as='span'
                        size='xxxs'
                        color='prominent'
                        weight='normal'
                        line_height='xxs'
                        className='floating-rate__mkt-rate--label'
                    >
                        {localize('of the market rate')}
                    </Text>
                    <Text
                        as='span'
                        size='xs'
                        color='prominent'
                        weight='normal'
                        line_height='xs'
                        className='floating-rate__mkt-rate--msg'
                    >
                        {localize('1')} {fiat_currency} = {exchange_rate} {local_currency}
                    </Text>
                </div>
            </section>
            {error_messages ? (
                <Text
                    as='div'
                    size='xxs'
                    color='loss-danger'
                    weight='normal'
                    line_height='xs'
                    className='floating-rate__error-message'
                >
                    {error_messages}
                </Text>
            ) : (
                <Text
                    as='div'
                    size='xxs'
                    color='status-info-blue'
                    weight='normal'
                    line_height='xs'
                    className='floating-rate__hint'
                >
                    {localize('Your rate is')} = {market_feed} {local_currency}
                </Text>
            )}
        </div>
    );
};

FloatingRate.propTypes = {
    change_handler: PropTypes.func,
    className: PropTypes.string,
    exchange_rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    error_messages: PropTypes.string,
    fiat_currency: PropTypes.string,
    local_currency: PropTypes.string,
    offset: PropTypes.object,
    placeholder: PropTypes.string,
};

export default FloatingRate;
