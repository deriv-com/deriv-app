import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import React from 'react';
import { InputField, Text } from '@deriv/components';
import { formatMoney, isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './floating-rate.scss';

// Compute the absolute position for the prefix based on the user input
const calculateDynamicWidth = element_width => {
    const absolute_font_size = window.getComputedStyle(document.documentElement, null).getPropertyValue('font-size');
    const prefix_position = element_width / parseFloat(absolute_font_size) + 4;
    if (!isMobile()) {
        if (element_width > 33) {
            return prefix_position < 8.7 ? prefix_position : 8.7;
        }
        return 7.5;
    }
    if (element_width > 45) {
        return 17.5;
    }
    return 16.5;
};

const FloatingRate = ({
    change_handler,
    className,
    exchange_rate,
    error_messages,
    fiat_currency,
    local_currency,
    onChange,
    offset,
    ...props
}) => {
    const { general_store } = useStores();
    const { name, value, required } = props;

    const market_feed = value ? parseFloat(exchange_rate * (1 + value / 100)) : exchange_rate;

    const ref = React.useRef(null);
    const tracker_ref = React.useRef(null); // Creates a DOM element that is used for keeping trach of the width of user input

    React.useEffect(() => {
        const input_width = tracker_ref.current?.offsetWidth;
        const fixed = calculateDynamicWidth(input_width);
        ref.current.style.left = `${fixed}rem`;
    }, [tracker_ref?.current?.innerHTML]);

    const onBlurHandler = e => {
        let float_rate = e.target.value;
        if (float_rate && float_rate.trim().length) {
            float_rate = parseFloat(float_rate).toFixed(2);
            if (/^\d+/.test(float_rate) && float_rate > 0) {
                // Assign + symbol for positive rate
                e.target.value = `+${float_rate}`;
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
                    current_focus={general_store.current_focus}
                    decimal_point_change={2}
                    id='floating_rate_input'
                    inline_prefix='%'
                    inline_prefix_ref={ref}
                    is_autocomplete_disabled
                    is_float
                    is_incrementable
                    is_signed
                    inputmode='decimal'
                    increment_button_type='button'
                    max_value={offset?.upper_limit}
                    min_value={offset?.lower_limit}
                    name={name}
                    onBlur={onBlurHandler}
                    onChange={change_handler}
                    setCurrentFocus={general_store.setCurrentFocus}
                    required={required}
                    type='number'
                    value={value}
                />
                <div className='floating-rate__mkt-rate'>
                    <Text
                        as='span'
                        size='xxs'
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
                        1 {fiat_currency} = {formatMoney(local_currency, exchange_rate, true)} {local_currency}
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
                    {localize('Your rate is')} = {formatMoney(local_currency, market_feed, true)} {local_currency}
                </Text>
            )}
            <div className='tracker' ref={tracker_ref}>
                {value}
            </div>
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
    onChange: PropTypes.func,
    offset: PropTypes.object,
};

export default observer(FloatingRate);
