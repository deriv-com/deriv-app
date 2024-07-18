import React from 'react';
import WheelPicker from '../../Form/WheelPicker';
import { Text, useDevice } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import { localize } from '@deriv/translations';
import './payout-per-point.scss';

const PayoutPerPointInput = ({
    barriersList,
    onPayoutClick,
    selectedBarrier,
    defaultPayout,
    currency,
    tooltipText,
}: {
    barriersList: number[];
    onPayoutClick: (option: number) => void;
    selectedBarrier: string;
    defaultPayout: number;
    currency: string;
    tooltipText?: React.ReactNode;
}) => {
    const { is_desktop } = useDevice();

    return is_desktop ? (
        <Fieldset
            className={'trade-container__fieldset payout-per-point-input'}
            header={localize('Payout per Point')}
            header_tooltip={tooltipText}
        >
            <WheelPicker
                options={barriersList}
                defaultValue={defaultPayout}
                onClick={onPayoutClick}
                currency={currency}
            />
            <div className='actions-wrapper'>
                <Text size={'xxs'} line_height='l' color={'default'} align='center' as='p'>
                    {localize('Distance to current spot')}
                </Text>
                <Text
                    size={'xxxs'}
                    line_height='l'
                    color={'default'}
                    align='center'
                    as='p'
                    className='learn-more_title'
                >
                    {selectedBarrier}
                </Text>
            </div>
        </Fieldset>
    ) : (
        <></>
    );
};

export default PayoutPerPointInput;
