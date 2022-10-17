import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Div100vhContainer, Money, Modal, Popover, Numpad } from '@deriv/components';
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
            should_header_stick_body={false}
            is_title_centered
            toggleModal={toggleModal}
            height='auto'
            width='calc(100vw - 32px)'
            title={localize('Strike')}
        >
            <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                <div className='trade-params__multiplier-ic-info-wrapper'>
                    <Popover
                        alignment='bottom'
                        icon='info'
                        id='dt_multiplier-stake__tooltip'
                        zIndex={9999}
                        is_bubble_hover_enabled
                        message={<Localize i18n_default_text='Test message' />}
                    />
                </div>
                <div className='trade-params__amount-keypad'>
                    <Numpad
                        value={strike ?? 0}
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
                        onValidate={() => undefined}
                        submit_label={localize('OK')}
                        onValueChange={() => undefined}
                    />
                </div>
            </Div100vhContainer>
        </Modal>
    );
};

export default StrikeParamModal;
