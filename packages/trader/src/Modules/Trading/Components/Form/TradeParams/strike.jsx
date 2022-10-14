import React from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
import { DesktopWrapper, InputField, MobileWrapper, Numpad, Money, Popover } from '@deriv/components';
import { getDecimalPlaces } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';

const Strike = ({ strike, current_focus, onChange, validation_errors, setCurrentFocus, currency }) => {
    const user_currency_decimal_places = getDecimalPlaces(currency);
    const zero_decimals = Number('0').toFixed(getDecimalPlaces(currency));
    const min_amount = parseFloat(zero_decimals.toString().replace(/.$/, '1'));
    const formatAmount = value =>
        !isNaN(value) && value !== '' ? Number(value).toFixed(user_currency_decimal_places) : value;

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Fieldset
                    className='trade-container__fieldset trade-container__barriers'
                    header={localize('Strike')}
                    header_tooltip={
                        <Localize i18n_default_text='Your gross profit is the percentage change in market price times your stake and the multiplier chosen here.' />
                    }
                >
                    <InputField
                        type='number'
                        name='strike'
                        value={strike}
                        className='trade-container__barriers-single'
                        classNameInput={classNames(
                            'trade-container__input',
                            'trade-container__barriers-input',
                            'trade-container__barriers-single-input'
                        )}
                        current_focus={current_focus}
                        onChange={onChange}
                        error_messages={validation_errors?.strike || []}
                        is_float
                        setCurrentFocus={setCurrentFocus}
                    />
                </Fieldset>
            </DesktopWrapper>
            {/* <MobileWrapper>
                <div className='trade-params__amount-keypad'>
                    <Numpad
                        value={strike}
                        format={formatAmount}
                        onSubmit={setBasisAndAmount}
                        currency={currency}
                        min={min_amount}
                        is_currency
                        render={({ value: v, className }) => {
                            return (
                                <div className={className}>
                                    {parseFloat(v) > 0 ? (
                                        <Money currency={currency} amount={v} should_format={false} />
                                    ) : (
                                        v
                                    )}
                                </div>
                            );
                        }}
                        reset_press_interval={450}
                        reset_value=''
                        pip_size={user_currency_decimal_places}
                        // onValidate={validateAmount}
                        submit_label={localize('OK')}
                        // onValueChange={onNumberChange}
                    />
                </div>
            </MobileWrapper> */}
        </React.Fragment>
    );
};

export default connect(({ client, modules, ui }) => ({
    current_focus: ui.current_focus,
    currency: client.currency,
    setCurrentFocus: ui.setCurrentFocus,
    onChange: modules.trade.onChange,
    validation_errors: modules.trade.validation_errors,
}))(Strike);
