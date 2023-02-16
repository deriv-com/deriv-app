import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Div100vhContainer, Modal, Popover, RadioGroup } from '@deriv/components';
import classNames from 'classnames';

const StrikeParamModal = ({ is_open, toggleModal, strike, onChange, name, strike_price_list, vanilla_trade_type }) => (
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
                    message={
                        <Localize
                            i18n_default_text='<0>{{trade_type}}:</0> You will get a payout if the market is {{payout_status}} this price <0>at the expiry time.</0> Otherwise, your payout will be zero.'
                            components={[<strong key={0} />]}
                            values={{
                                trade_type:
                                    vanilla_trade_type === 'VANILLALONGCALL'
                                        ? localize('For Call')
                                        : localize('For Put'),
                                payout_status:
                                    vanilla_trade_type === 'VANILLALONGCALL' ? localize('above') : localize('below'),
                            }}
                        />
                    }
                    classNameWrapper='trade-params--modal-wrapper'
                    classNameBubble='trade-params--modal-wrapper__content'
                />
            </div>
            <div className={classNames('trade-params__amount-keypad', 'trade-params--mobile-strike')}>
                <RadioGroup name={name} className='trade-params__amount--mobile' onToggle={onChange} selected={strike}>
                    {strike_price_list.map(item => (
                        <RadioGroup.Item key={item.key} value={String(item.value)} label={item.value} />
                    ))}
                </RadioGroup>
            </div>
        </Div100vhContainer>
    </Modal>
);

export default StrikeParamModal;
