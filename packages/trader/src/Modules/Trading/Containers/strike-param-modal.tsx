import React from 'react';
import { Localize, localize } from '@deriv/translations';
import { Div100vhContainer, Modal, Popover, RadioGroup } from '@deriv/components';
import { TRADE_TYPES } from '@deriv/shared';
import classNames from 'classnames';

type TStrikeParamModalProps = {
    contract_type: string;
    is_open: boolean;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    strike: string;
    strike_price_list: { text: string; value: string }[];
    toggleModal: () => void;
};

const StrikeParamModal = ({
    contract_type,
    is_open,
    toggleModal,
    strike,
    onChange,
    name,
    strike_price_list,
}: TStrikeParamModalProps) => {
    return (
        <Modal
            className='trade-params dc-modal-header--title-bar'
            is_open={is_open}
            should_header_stick_body={false}
            is_title_centered
            toggleModal={toggleModal}
            height='auto'
            width='calc(100vw - 32px)'
            title={localize('Strike')}
        >
            <Div100vhContainer className='mobile-widget-dialog__wrapper' max_autoheight_offset='48px'>
                <div className='trade-params__vanilla-ic-info-wrapper'>
                    <Popover
                        alignment='bottom'
                        icon='info'
                        id='dt_vanilla-stake__tooltip'
                        zIndex='9999'
                        is_bubble_hover_enabled
                        message={
                            <Localize
                                i18n_default_text='If you buy a "<0>{{trade_type}}</0>" option, you receive a payout at expiry if the final price is {{payout_status}} the strike price. Otherwise, your “<0>{{trade_type}}</0>” option will expire worthless.'
                                components={[<strong key={0} />]}
                                values={{
                                    trade_type:
                                        contract_type === TRADE_TYPES.VANILLA.CALL ? localize('Call') : localize('Put'),
                                    payout_status:
                                        contract_type === TRADE_TYPES.VANILLA.CALL
                                            ? localize('above')
                                            : localize('below'),
                                }}
                            />
                        }
                        classNameBubble='trade-params--modal-wrapper__content'
                    />
                </div>
                <div className={classNames('trade-params__amount-keypad', 'trade-params--mobile-strike')}>
                    <RadioGroup
                        name={name}
                        className='trade-params__amount--mobile'
                        onToggle={onChange}
                        selected={strike}
                    >
                        {strike_price_list.map(item => (
                            <RadioGroup.Item key={item.value} value={String(item.value)} label={item.value} />
                        ))}
                    </RadioGroup>
                </div>
            </Div100vhContainer>
        </Modal>
    );
};

export default StrikeParamModal;
