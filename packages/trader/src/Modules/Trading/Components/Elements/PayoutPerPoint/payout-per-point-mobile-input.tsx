import React, { useEffect, useState } from 'react';
import { Button, Icon, PageOverlay, Popover, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import WheelPickerMobile from '../../Form/WheelPicker/wheel-picker-mobile';
import './payout-per-point.scss';
import Fieldset from 'App/Components/Form/fieldset';
import { LabelPairedChevronsDownCaptionRegularIcon, LabelPairedChevronsUpCaptionRegularIcon } from '@deriv/quill-icons';

const PayoutPerPointMobileInput = ({
    togglePayoutWheelPicker,
    payoutChoices,
    onPayoutClick,
    selectedBarrier,
    payout_per_point,
    contract_type,
    currency,
}: {
    togglePayoutWheelPicker: () => void;
    payoutChoices: string[];
    selectedBarrier: string;
    onPayoutClick: (val: string) => void;
    currency: string;
    contract_type: string;
    payout_per_point?: string;
}) => {
    const [initialPayout, setInitialPayout] = useState<string | null>(null);

    const [payoutValue, setPayoutValue] = useState(payoutChoices[2] || payoutChoices[0]);

    useEffect(() => {
        if (initialPayout == null && payout_per_point) {
            setInitialPayout(payout_per_point);
        }
    }, []);

    const onSave = () => {
        togglePayoutWheelPicker();
        onPayoutClick(payoutValue);
    };

    const onClose = () => {
        togglePayoutWheelPicker();
        if (initialPayout) {
            onPayoutClick(initialPayout);
        }
    };

    const distance_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            <Localize i18n_default_text='You will receive a payout at expiry if the spot price never breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.' />
        </div>
    );
    const header_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            {contract_type === 'turboslong' ? (
                <Localize i18n_default_text='The amount you’ll receive at expiry for every point of change above the barrier' />
            ) : (
                <Localize i18n_default_text='The amount you’ll receive at expiry for every point of change below the barrier.' />
            )}
        </div>
    );

    return (
        <PageOverlay onClickClose={onClose}>
            <div className='payout-per-point-mobile'>
                <Fieldset className='payout-per-point-mobile__header'>
                    <div className='payout-per-point-mobile__header__title'>
                        <Text size='xs' weight='bold' color='prominent' as='h1'>
                            <Localize i18n_default_text='Payout per Point' />
                        </Text>
                        <Popover
                            alignment='bottom'
                            icon='info'
                            className='popover-icon'
                            is_bubble_hover_enabled
                            margin={0}
                            zIndex='9999'
                            message={header_tooltip_text}
                        />
                    </div>
                    <button className='cross-icon' onClick={onClose}>
                        <Icon icon='IcCross' data_testid='dt_modal_close_icon' />
                    </button>
                </Fieldset>
                <WheelPickerMobile
                    options={payoutChoices}
                    defaultValue={payout_per_point || payoutChoices[2]}
                    currency={currency}
                    onChange={val => {
                        setPayoutValue(val);
                        onPayoutClick(payoutValue);
                    }}
                />
                <Fieldset className='actions-wrapper'>
                    <Text
                        size='xxs'
                        line_height='l'
                        color='prominent'
                        align='center'
                        as='p'
                        className='distance-to-current-spot'
                    >
                        <Localize i18n_default_text='Distance to current spot:' />
                    </Text>
                    <Popover
                        alignment='top'
                        className='popover-icon'
                        is_bubble_hover_enabled
                        disable_target_icon
                        icon='info'
                        zIndex='9999'
                        message={distance_tooltip_text}
                    >
                        <div className='distance-to-current-spot__value'>
                            <Text size='xxs' line_height='xs' color='prominent' align='center' as='p'>
                                {selectedBarrier}
                            </Text>
                            {Number(selectedBarrier) < 0 ? (
                                <LabelPairedChevronsDownCaptionRegularIcon
                                    width={12}
                                    height={12}
                                    stroke='var(--text-prominent)'
                                    className='indicator-icon'
                                />
                            ) : (
                                <LabelPairedChevronsUpCaptionRegularIcon
                                    width={12}
                                    stroke='var(--text-prominent)'
                                    height={12}
                                    className='indicator-icon'
                                />
                            )}
                        </div>
                    </Popover>
                </Fieldset>
                <Button className='save-button' onClick={onSave}>
                    <Localize i18n_default_text='Save' />
                </Button>
            </div>
        </PageOverlay>
    );
};

export default PayoutPerPointMobileInput;
