import React from 'react';
import { Money } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getExpiryType, getDurationMinMaxValues, getLocalizedBasis } from '@deriv/shared';
import { MultiplierAmountWidget } from 'Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx';
import TradeParamsModal from '../../Containers/trade-params-mobile.jsx';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const MobileWidget = observer(({ toggleDigitsWidget, is_collapsed }) => {
    const { ui } = useStore();
    const { onChangeUiStore } = ui;
    const trade_store = useTraderStore();
    const {
        amount,
        basis,
        currency,
        duration,
        duration_min_max,
        duration_unit,
        form_components,
        is_multiplier,
        last_digit,
        onChange,
    } = trade_store;

    const [is_open, setIsOpen] = React.useState(false);

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

    const toggleWidget = () => setIsOpen(!is_open);

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

    const isVisible = component => {
        return form_components.includes(component);
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
                <div id='duration_amount_selector' className='mobile-widget' onClick={toggleWidget}>
                    <div className='mobile-widget__duration'>{getHumanReadableDuration()}</div>
                    <div className='mobile-widget__amount'>
                        <Money amount={amount} currency={currency} show_currency />
                    </div>
                    <div className='mobile-widget__type'>{stakeOrPayout()}</div>
                </div>
            )}
            <TradeParamsModal is_open={is_open} toggleModal={toggleWidget} />
            {isVisible('last_digit') && is_collapsed && (
                <div className='mobile-widget' onClick={toggleDigitsWidget}>
                    <div className='mobile-widget__amount'>
                        <Localize i18n_default_text='Digit: {{last_digit}} ' values={{ last_digit }} />
                    </div>
                </div>
            )}
        </div>
    );
});

export default MobileWidget;
