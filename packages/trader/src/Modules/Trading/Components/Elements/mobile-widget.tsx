import React from 'react';
import { Money } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { getExpiryType, getDurationMinMaxValues, getLocalizedBasis } from '@deriv/shared';
import { MultiplierAmountWidget } from 'Modules/Trading/Components/Form/TradeParams/Multiplier/widgets';
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

        if (contract_expiry_type === 'tick' && duration < Number(min_value)) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: min_value });
            onChange({ target: { name: 'duration', value: min_value } });
        }
        if (duration >= Number(min_value) && duration > Number(max_value)) {
            onChangeUiStore({ name: `duration_${duration_unit}`, value: max_value });
            onChange({ target: { name: 'duration', value: max_value } });
        }
    };

    // tab_index 0 is duration and 1 is amount
    const toggleWidget = (tab_index: number) => {
        setTabIndex(tab_index);
        setIsOpen(!is_open);
    };

    const getHumanReadableDuration = () => {
        if (!duration_unit) return '';
        const lookup = {
            t: [<Localize i18n_default_text='tick' key='t' />, <Localize i18n_default_text='ticks' key='ts' />],
            s: [<Localize i18n_default_text='second' key='s' />, <Localize i18n_default_text='seconds' key='ss' />],
            m: [<Localize i18n_default_text='min' key='m' />, <Localize i18n_default_text='mins' key='ms' />],
            h: [<Localize i18n_default_text='hour' key='h' />, <Localize i18n_default_text='hours' key='hs' />],
            d: [<Localize i18n_default_text='day' key='d' />, <Localize i18n_default_text='days' key='ds' />],
        };

        try {
            const formatted_duration_unit =
                +duration === 1
                    ? lookup[duration_unit as keyof typeof lookup][0]
                    : lookup[duration_unit as keyof typeof lookup][1];
            return [duration, ' ', formatted_duration_unit];
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
                    <button className='mobile-widget__duration mobile-widget__button' onClick={() => toggleWidget(0)}>
                        {getHumanReadableDuration()}
                    </button>
                    <button className='mobile-widget__amount mobile-widget__button' onClick={() => toggleWidget(1)}>
                        <Money amount={amount} currency={currency} show_currency />
                    </button>
                    <button className='mobile-widget__type mobile-widget__button' onClick={() => toggleWidget(1)}>
                        {stakeOrPayout()}
                    </button>
                </div>
            )}
            <TradeParamsModal is_open={is_open} toggleModal={() => toggleWidget(tab_index)} tab_index={tab_index} />
        </div>
    );
});

export default MobileWidget;
