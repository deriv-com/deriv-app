import React from 'react';
import { Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv-com/ui';
import PayoutPerPointInput from 'Modules/Trading/Components/Elements/PayoutPerPoint/payout-per-point-input';
import { LabelPairedChevronsDownCaptionRegularIcon, LabelPairedChevronsUpCaptionRegularIcon } from '@deriv/quill-icons';
import './payout-selector.scss';

const PayoutSelector = observer(() => {
    const { barrier_1, payout_choices, setPayoutPerPoint, togglePayoutWheelPicker, payout_per_point, currency } =
        useTraderStore();
    const { isMobile } = useDevice();

    const toggleBarriersTable = () => {
        togglePayoutWheelPicker();
    };

    const onPayoutClick = (value: number) => {
        setPayoutPerPoint(value);
    };

    const header_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            <Localize i18n_default_text='You receive a payout at expiry if the spot price never touches or breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.' />
        </div>
    );
    if (isMobile) {
        return (
            <div className='mobile-widget payout-selector' onClick={toggleBarriersTable}>
                <Text size='xs' color='prominent' align='center' className='payout-field'>
                    {payout_per_point}
                    {Number(payout_per_point) < 0 ? (
                        <LabelPairedChevronsDownCaptionRegularIcon className='indicator-icon' />
                    ) : (
                        <LabelPairedChevronsUpCaptionRegularIcon className='indicator-icon' />
                    )}
                </Text>
                <Text size='xs' color='prominent' align='center' weight='bold'>
                    {barrier_1} {currency}
                </Text>
                <Text size='xs' color='less-prominent' align='center'>
                    {localize('Payout per point')}
                </Text>
            </div>
        );
    }

    return (
        <PayoutPerPointInput
            currency={currency}
            defaultPayout={payout_per_point}
            payoutOptions={payout_choices}
            onPayoutClick={onPayoutClick}
            tooltipText={header_tooltip_text}
            selectedBarrier={barrier_1}
        />
    );
});

export default PayoutSelector;
