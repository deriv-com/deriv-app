import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv-com/ui';
import PayoutPerPointInput from 'Modules/Trading/Components/Elements/PayoutPerPoint/payout-per-point-input';
import { LabelPairedChevronsDownCaptionRegularIcon, LabelPairedChevronsUpCaptionRegularIcon } from '@deriv/quill-icons';
import './payout-selector.scss';

const PayoutSelector = observer(() => {
    const {
        barrier_1,
        payout_choices,
        setPayoutPerPoint,
        togglePayoutWheelPicker,
        payout_per_point,
        currency,
        contract_type,
    } = useTraderStore();
    const { isMobile } = useDevice();

    const header_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            <Localize i18n_default_text='You will receive a payout at expiry if the spot price never breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.' />
        </div>
    );
    if (isMobile) {
        return (
            <button role='button' className='mobile-widget payout-selector' onClick={togglePayoutWheelPicker}>
                <Text size='xs' color='prominent' align='center' className='payout-field'>
                    {barrier_1}
                    {Number(barrier_1) < 0 ? (
                        <LabelPairedChevronsDownCaptionRegularIcon
                            className='indicator-icon'
                            stroke='var(--text-prominent)'
                        />
                    ) : (
                        <LabelPairedChevronsUpCaptionRegularIcon
                            className='indicator-icon'
                            stroke='var(--text-prominent)'
                        />
                    )}
                </Text>
                <Text size='xs' className='payout-value' color='prominent' align='center' weight='bold'>
                    {payout_per_point} {currency}
                </Text>
                <Text size='xs' color='less-prominent' align='center'>
                    <Localize i18n_default_text='Payout per point' />
                </Text>
            </button>
        );
    }

    return (
        <PayoutPerPointInput
            contract_type={contract_type}
            currency={currency}
            defaultPayout={payout_per_point}
            payoutOptions={payout_choices}
            onPayoutClick={value => setPayoutPerPoint(value)}
            tooltipText={header_tooltip_text}
            selectedBarrier={barrier_1}
        />
    );
});

export default PayoutSelector;
