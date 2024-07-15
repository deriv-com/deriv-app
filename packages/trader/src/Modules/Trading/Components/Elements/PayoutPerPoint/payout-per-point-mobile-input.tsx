import React from 'react';
import { Button, Icon, PageOverlay, Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import WheelPickerMobile from '../../Form/WheelPicker/wheel-picker-mobile';
import './payout-per-point.scss';

const defaultOptions = ['0.12', '0.21', '0.22', '0.34', '0.33', '0.38', '0.09', '0.76', '0.77', '0.78', '0.79', '0.22'];

const PayoutPerPointMobileInput = ({
    togglePayoutWheelPicker,
    currency,
}: {
    togglePayoutWheelPicker: () => void;
    currency: string;
}) => {
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
                    options={defaultOptions}
                    defaultValue={defaultOptions[2]}
                    currency={currency}
                    onChange={() => {
                        // eslint-disable-next-line no-console
                        console.log('onChange');
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
                <Button className='save-button'>{localize('Save')}</Button>
            </div>
        </PageOverlay>
    );
};

export default PayoutPerPointMobileInput;
