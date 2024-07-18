import React from 'react';
import BarriersList from '../barriers-list';
import { Icon, Text, Popover } from '@deriv/components';
import Fieldset from 'App/Components/Form/fieldset';
import { Localize, localize } from '@deriv/translations';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { useDevice } from '@deriv-com/ui';
import PayoutPerPointInput from 'Modules/Trading/Components/Elements/PayoutPerPoint/payout-per-point-input';

const BarrierSelector = observer(() => {
    const { barrier_1, payout_choices, setPayoutWheelPicker, togglePayoutWheelPicker, payout_per_point, currency } =
        useTraderStore();
    const [selected_barrier, setSelectedBarrier] = React.useState(barrier_1);
    const { isMobile } = useDevice();

    const toggleBarriersTable = () => {
        togglePayoutWheelPicker();
    };

    const onPayoutClick = (value: number) => {
        setPayoutWheelPicker(value);
    };

    React.useEffect(() => {
        setSelectedBarrier(barrier_1);
    }, [barrier_1]);

    const header_tooltip_text = (
        <div className='trade-container__barriers-tooltip'>
            <Localize i18n_default_text='You receive a payout at expiry if the spot price never touches or breaches the barrier throughout the contract duration. Otherwise, your contract will be terminated early.' />
        </div>
    );

    if (isMobile) {
        return (
            <React.Fragment>
                <div className='mobile-widget' onClick={toggleBarriersTable}>
                    <Text size='xs' color='prominent' align='center'>
                        {payout_per_point}
                    </Text>
                    <Text size='xs' color='prominent' align='center' weight='bold'>
                        {barrier_1}
                    </Text>
                    <Text size='xs' color='less-prominent' align='center'>
                        {localize('Payout per point')}
                    </Text>
                </div>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <PayoutPerPointInput
                currency={currency}
                defaultPayout={payout_per_point}
                barriersList={payout_choices}
                onPayoutClick={onPayoutClick}
                tooltipText={header_tooltip_text}
                selectedBarrier={selected_barrier}
            />
        </React.Fragment>
    );
});

export default BarrierSelector;
