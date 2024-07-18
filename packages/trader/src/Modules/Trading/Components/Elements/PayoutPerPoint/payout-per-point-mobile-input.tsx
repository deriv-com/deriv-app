import React, { useState } from 'react';
import { Button, Icon, PageOverlay, Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import WheelPickerMobile from '../../Form/WheelPicker/wheel-picker-mobile';
import './payout-per-point.scss';

const PayoutPerPointMobileInput = ({
    togglePayoutWheelPicker,
    payoutChoices,
    onPayoutClick,
    payout_per_point,
    currency,
}: {
    togglePayoutWheelPicker: () => void;
    payoutChoices: number[];
    onPayoutClick: (val: number) => void;
    currency: string;
    payout_per_point?: number;
}) => {
    const [payoutValue, setPayoutValue] = useState(payoutChoices[2] || payoutChoices[0]);
    const onSave = () => {
        togglePayoutWheelPicker();
        onPayoutClick(payoutValue);
    };
    return (
        <PageOverlay onClickClose={togglePayoutWheelPicker}>
            <div className='payout-per-point-mobile'>
                <div className='payout-per-point-mobile__header'>
                    <Text size='xs' weight='bold' color='default' as='h1'>
                        {localize('Payout per Point')}
                    </Text>
                    <Popover
                        alignment='left'
                        icon='info'
                        className='popover-icon'
                        is_bubble_hover_enabled
                        message={'testing'}
                        margin={216}
                        relative_render
                    />
                    <div role='button' className='cross-icon' onClick={togglePayoutWheelPicker}>
                        <Icon icon='IcCross' data_testid='dt_modal_close_icon' />
                    </div>
                </div>
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
                    {localize('Distance to current spot:')}
                </Text>
                <Button className='save-button' onClick={onSave}>
                    {localize('Save')}
                </Button>
            </div>
        </PageOverlay>
    );
};

export default PayoutPerPointMobileInput;
