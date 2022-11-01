import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React from 'react';
import { InputField, Text } from '@deriv/components';
import { formatMoney, isMobile, mobileOSDetect } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { setDecimalPlaces, removeTrailingZeros, percentOf, roundOffDecimal } from 'Utils/format-value';
import './floating-rate.scss';

const FloatingRate = ({
    change_handler,
    className,
    error_messages,
    fiat_currency,
    local_currency,
    onChange,
    offset,
    data_testid,
    ...props
}) => {
    const { floating_rate_store, general_store } = useStores();
    const os = mobileOSDetect();
    const { name, value, required } = props;
    const market_feed = value ? percentOf(floating_rate_store.market_rate, value) : floating_rate_store.market_rate;
    const decimal_place = setDecimalPlaces(market_feed, 6);

    // Input mask for formatting value on blur of floating rate field
    const onBlurHandler = e => {
        let float_rate = e.target.value;
        if (!isNaN(float_rate) && float_rate.trim().length) {
            float_rate = parseFloat(float_rate).toFixed(2);
            if (/^\d+/.test(float_rate) && float_rate > 0) {
                // Assign + symbol for positive rate
                e.target.value = `+${float_rate}`;
            } else {
                e.target.value = float_rate;
            }
        }
        onChange(e);
    };
    return (
        <div className={classNames(className, 'floating-rate')}>
            <section className={classNames('floating-rate__field', { 'mobile-layout': isMobile() })}>
                <Text as='div' size='s' weight='normal' line_height='xs' className='floating-rate__field--prefix'>
                    {localize('at')}
                </Text>
                <InputField
                    ariaLabel='Floating rate'
                    classNameInlinePrefix='floating-rate__percent'
                    classNameInput={classNames('floating-rate__input', {
                        'floating-rate__input--error-field': error_messages,
                    })}
                    classNameDynamicSuffix='dc-input-suffix'
                    classNameWrapper={classNames({ 'dc-input-wrapper--error': error_messages })}
                    current_focus={general_store.current_focus}
                    decimal_point_change={2}
                    id='floating_rate_input'
                    inline_prefix='%'
                    is_autocomplete_disabled
                    is_float
                    is_incrementable
                    is_signed
                    increment_button_type='button'
                    name={name}
                    onBlur={onBlurHandler}
                    onChange={change_handler}
                    setCurrentFocus={general_store.setCurrentFocus}
                    required={required}
                    type={isMobile() && os !== 'iOS' ? 'tel' : 'number'}
                    value={value}
                    data_testid={data_testid}
                />
                <div className='floating-rate__mkt-rate'>
                    <Text
                        as='span'
                        size='xxs'
                        color='hint'
                        weight='normal'
                        line_height='xxs'
                        className='floating-rate__mkt-rate--label'
                    >
                        {localize('of the market rate')}
                    </Text>
                    <Text
                        as='span'
                        size='xxs'
                        color='prominent'
                        weight='normal'
                        line_height='xs'
                        className='floating-rate__mkt-rate--msg'
                    >
                        1 {fiat_currency} ={' '}
                        {removeTrailingZeros(formatMoney(local_currency, floating_rate_store.market_rate, true, 6))}
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
                    {localize('Your rate is')} ={' '}
                    {removeTrailingZeros(
                        formatMoney(local_currency, roundOffDecimal(market_feed, decimal_place), true, decimal_place)
                    )}{' '}
                    {local_currency}
                </Text>
            )}
        </div>
    );
};

FloatingRate.propTypes = {
    change_handler: PropTypes.func,
    className: PropTypes.string,
    data_testid: PropTypes.string,
    error_messages: PropTypes.string,
    fiat_currency: PropTypes.string,
    local_currency: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    offset: PropTypes.object,
    required: PropTypes.bool,
    value: PropTypes.string,
};

export default observer(FloatingRate);
