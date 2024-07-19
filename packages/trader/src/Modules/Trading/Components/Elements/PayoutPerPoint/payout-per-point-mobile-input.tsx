import React, { useState } from 'react';
import { Button, Icon, PageOverlay, Popover, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import WheelPickerMobile from '../../Form/WheelPicker/wheel-picker-mobile';
import './payout-per-point.scss';
import PayoutPerPointMobile from '../payout-per-point-mobile';
import Fieldset from 'App/Components/Form/fieldset';

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
    const [payoutValue, setPayoutValue] = useState(payoutChoices[2] || payoutChoices[0]);
    const onSave = () => {
        togglePayoutWheelPicker();
        onPayoutClick(payoutValue);
    };
    const turbos_payout_message = (
        <Localize i18n_default_text='This is the amount you’ll receive at expiry for every point of change in the underlying price, if the spot price never touches or breaches the barrier throughout the contract duration.' />
    );
    return (
        <PageOverlay onClickClose={togglePayoutWheelPicker}>
            <div className='payout-per-point-mobile'>
                <Fieldset className='payout-per-point-mobile__header'>
                    <div className='payout-per-point__label-wrapper'>
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
                            message={turbos_payout_message}
                        />
                    </div>
                    <div role='button' className='cross-icon' onClick={togglePayoutWheelPicker}>
                        <Icon icon='IcCross' data_testid='dt_modal_close_icon' />
                    </div>
                </Fieldset>
                <WheelPickerMobile
                    options={payoutChoices}
                    defaultValue={payout_per_point || payoutChoices[2]}
                    currency={currency}
                    onChange={val => {
                        setPayoutValue(val);
                    }}
                />
                <Text
                    size={'xxs'}
                    className='distance-to-spot'
                    line_height='l'
                    weight={'bold'}
                    color={'default'}
                    align='center'
                    as='p'
                >
                    {localize('Distance to current spot: ')} {selectedBarrier}
                </Text>
                <Button className='save-button' onClick={onSave}>
                    {localize('Save')}
                </Button>
            </div>
        </PageOverlay>
    );
};

export default PayoutPerPointMobileInput;
