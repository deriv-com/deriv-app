import React, { useEffect, useState } from 'react';
import { Button, Icon, PageOverlay, Popover, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
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
    currency,
}: {
    togglePayoutWheelPicker: () => void;
    payoutChoices: number[];
    selectedBarrier: string;
    onPayoutClick: (val: number) => void;
    currency: string;
    payout_per_point?: number;
}) => {
    const [initialPayout, setInitialPayout] = useState<number | null>(null);

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

    const header_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            <Localize i18n_default_text='You receive a payout at expiry if the spot price never touches or breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.' />
        </div>
    );
    return (
        <PageOverlay onClickClose={onClose}>
            <div className='payout-per-point-mobile'>
                <Fieldset className='payout-per-point-mobile__header'>
                    <div className='payout-per-point-mobile__header__title'>
                        <Text size='xs' weight='bold' color='default' as='h1'>
                            {localize('Payout per Point')}
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
                    <div role='button' className='cross-icon' onClick={onClose}>
                        <Icon icon='IcCross' data_testid='dt_modal_close_icon' />
                    </div>
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
                        size={'xxs'}
                        line_height='l'
                        color={'default'}
                        align='center'
                        as='p'
                        className='distance-to-current-spot'
                    >
                        {localize('Distance to current spot')}{' '}
                        <Popover
                            alignment='top'
                            className='popover-icon'
                            is_bubble_hover_enabled
                            disable_target_icon
                            icon='info'
                            zIndex='9999'
                            message={header_tooltip_text}
                        >
                            <div className='barrier-value'>
                                {selectedBarrier}
                                {Number(selectedBarrier) < 0 ? (
                                    <LabelPairedChevronsDownCaptionRegularIcon
                                        width={12}
                                        height={12}
                                        className='indicator-icon'
                                    />
                                ) : (
                                    <LabelPairedChevronsUpCaptionRegularIcon
                                        width={12}
                                        height={12}
                                        className='indicator-icon'
                                    />
                                )}
                            </div>
                        </Popover>
                    </Text>
                </Fieldset>
                <Button className='save-button' onClick={onSave}>
                    {localize('Save')}
                </Button>
            </div>
        </PageOverlay>
    );
};

export default PayoutPerPointMobileInput;
