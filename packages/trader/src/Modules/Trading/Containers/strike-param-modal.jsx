import React from 'react';
import { localize } from '@deriv/translations';
import { Div100vhContainer, Money, Modal, ThemedScrollbars, Numpad } from '@deriv/components';
import { getDecimalPlaces } from '@deriv/shared';

const StrikeParamModal = ({ is_open, toggleModal, strike, currency, onChange }) => {
    const user_currency_decimal_places = getDecimalPlaces(currency);
    const zero_decimals = Number('0').toFixed(getDecimalPlaces(currency));
    const min_amount = parseFloat(zero_decimals.toString().replace(/.$/, '1'));

    const setBasisAndAmount = value => {
        onChange({ target: { value, name: 'strike' } });
        toggleModal();
    };

    const formatAmount = value =>
        !isNaN(value) && value !== '' ? Number(value).toFixed(user_currency_decimal_places) : value;
    return (
        <Modal
            className='trade-params'
            is_open={is_open}
            is_vertical_top
            toggleModal={toggleModal}
            height='auto'
            width='calc(100vw - 32px)'
            header={localize('Strike')}
        >
            <ThemedScrollbars>
                <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='120px'>
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
                </Div100vhContainer>
            </ThemedScrollbars>
        </Modal>
    );
};

export default StrikeParamModal;
