import React from 'react';
import { Button, FadeWrapper, Icon, MobileWrapper, PageOverlay, Popover, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import WheelPickerMobile from '../../Form/WheelPicker/wheel-picker-mobile';
import './payout-per-point.scss';

const defaultOptions = ['0.12', '0.21', '0.22', '0.34', '0.33', '0.38', '0.09', '0.76', '0.77', '0.78', '0.79', '80'];

const PayoutPerPointMobileInput = ({
    open_payout_wheelpicker,
    togglePayoutWheelPicker,
}: {
    open_payout_wheelpicker: boolean;
    togglePayoutWheelPicker: () => void;
}) => {
    return (
        <PageOverlay onClickClose={togglePayoutWheelPicker}>
            <div className='payout-per-point-mobile'>
                <div className='payout-per-point-mobile-header'>
                    <Text size='xs' weight='bold' color='default' as='h1'>
                        {localize('Payout per Point')}
                    </Text>
                    <Popover
                        alignment='left'
                        icon='info'
                        className='popover-icon'
                        is_bubble_hover_enabled
                        message={'dasdasdasdasd dsa d das asd as'}
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
                    onChange={() => {
                        // eslint-disable-next-line no-console
                        console.log('das');
                    }}
                />
                <Text
                    size={'xxs'}
                    className='distance'
                    line_height='l'
                    weight={'bold'}
                    color={'default'}
                    align='center'
                    as='p'
                >
                    Distance to current spot:
                </Text>
                <Button className='save-button'>{localize('Save')}</Button>
            </div>
        </PageOverlay>
    );
};

export default PayoutPerPointMobileInput;
