import React from 'react';
import { Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getExpiryType, getDurationMinMaxValues, getLocalizedBasis } from '@deriv/shared';
import { MultiplierAmountWidget } from 'Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx';
import TradeParamsModal from '../../Containers/trade-params-mobile';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const MobileWidget = observer(() => {
    const { ui } = useStore();
    const { onChangeUiStore } = ui;
    const trade_store = useTraderStore();
    const { amount, basis, currency, duration, duration_min_max, duration_unit, is_multiplier, onChange } = trade_store;

    const [is_open, setIsOpen] = React.useState(false);
    const [tab_index, setTabIndex] = React.useState(0);

    React.useEffect(() => {
        assertDurationIsWithinBoundary();
    });

    const assertDurationIsWithinBoundary = () => {
        const contract_expiry_type = getExpiryType(trade_store);
        const [min_value, max_value] = getDurationMinMaxValues(duration_min_max, contract_expiry_type, duration_unit);

        if (contract_expiry_type === 'tick' && duration < min_value) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: min_value });
            onChange({ target: { name: 'duration', value: min_value } });
        }
        if (!(duration < min_value) && duration > max_value) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: max_value });
            onChange({ target: { name: 'duration', value: max_value } });
        }
    };

    // tab_index 0 is duration and 1 is amount
    const toggleWidget = tab_index => {
        setTabIndex(tab_index);
        setIsOpen(!is_open);
    };

    const getHumanReadableDuration = () => {
        if (!duration_unit) return '';
        const lookup = {
            t: [localize('tick'), localize('ticks')],
            s: [localize('second'), localize('seconds')],
            m: [localize('min'), localize('mins')],
            h: [localize('hour'), localize('hours')],
            d: [localize('day'), localize('days')],
        };

        try {
            if (!duration_unit) return '';
            const formatted_duration_unit = +duration === 1 ? lookup[duration_unit][0] : lookup[duration_unit][1];

            return `${duration} ${formatted_duration_unit}`;
        } catch (e) {
            return '';
        }
    };

    const localized_basis = getLocalizedBasis();

    const stakeOrPayout = () => {
        switch (basis) {
            case 'stake':
                return localized_basis.stake;
            case 'payout':
                return localized_basis.payout;
            default:
                return basis;
        }
    };

    return (
        <div className='mobile-widget__wrapper'>
            {is_multiplier ? (
                <MultiplierAmountWidget />
            ) : (
                <div id='duration_amount_selector' className='mobile-widget duration_amount_selector'>
                    <div className='mobile-widget__duration' onClick={() => toggleWidget(0)}>
                        {getHumanReadableDuration()}
                    </div>
                    <div className='mobile-widget__amount' onClick={() => toggleWidget(1)}>
                        <Money amount={amount} currency={currency} show_currency />
                    </div>
                    <div className='mobile-widget__type' onClick={() => toggleWidget(1)}>
                        {stakeOrPayout()}
                    </div>
                </div>
            )}
            <TradeParamsModal is_open={is_open} toggleModal={() => toggleWidget(tab_index)} tab_index={tab_index} />
        </div>
    );
});

export default MobileWidget;
