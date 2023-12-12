import React from 'react';
import classNames from 'classnames';
import Amount from 'Modules/Trading/Components/Form/TradeParams/amount';
import Barrier from 'Modules/Trading/Components/Form/TradeParams/barrier';
import BarrierSelector from 'Modules/Trading/Components/Form/TradeParams/Turbos/barrier-selector';
import Duration from 'Modules/Trading/Components/Form/TradeParams/Duration';
import LastDigit from 'Modules/Trading/Components/Form/TradeParams/last-digit';
import CancelDeal from 'Modules/Trading/Components/Form/TradeParams/Multiplier/cancel-deal';
import Accumulator from 'Modules/Trading/Components/Form/TradeParams/Accumulator/accumulator';
import StopLoss from 'Modules/Trading/Components/Form/TradeParams/Multiplier/stop-loss';
import TakeProfit from 'Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit';
import Expiration from 'Modules/Trading/Components/Form/TradeParams/Multiplier/expiration';
import AccumulatorsInfoDisplay from 'Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-info-display';
import Strike from 'Modules/Trading/Components/Form/TradeParams/strike';
import TradeTypeTabs from 'Modules/Trading/Components/Form/TradeParams/trade-type-tabs';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import Fieldset from 'App/Components/Form/fieldset';

type TTradeParams = {
    is_minimized?: boolean;
};

const TradeParams = observer(({ is_minimized = false }: TTradeParams) => {
    const { form_components } = useTraderStore();
    const isVisible = (component_key: string) => {
        return form_components.includes(component_key);
    };

    return (
        <React.Fragment>
            {isVisible('duration') && <Duration key={'duration'} is_minimized={is_minimized} />}
            {isVisible('barrier') && <Barrier key={'barrier'} is_minimized={is_minimized} />}
            {isVisible('last_digit') && <LastDigit key={'last_digit'} is_minimized={is_minimized} />}
            {isVisible('accumulator') && <Accumulator key={'accumulator'} />}
            {(isVisible('trade_type_tabs') || isVisible('strike') || isVisible('barrier_selector')) && (
                <Fieldset className={classNames('trade-container__fieldset', 'trade-container__fieldset--no-padding')}>
                    {isVisible('trade_type_tabs') && <TradeTypeTabs key={'trade_type_tabs'} />}
                    {isVisible('strike') && <Strike key={'strike'} />}
                    {isVisible('barrier_selector') && <BarrierSelector key={'barrier_selector'} />}
                </Fieldset>
            )}
            {isVisible('amount') && <Amount key={'amount'} is_minimized={is_minimized} />}
            {isVisible('take_profit') && <TakeProfit key={'take_profit'} />}
            {isVisible('stop_loss') && <StopLoss key={'stop_loss'} />}
            {isVisible('cancellation') && <CancelDeal key={'cancellation'} />}
            {isVisible('expiration') && <Expiration key={'expiration'} />}
            {isVisible('accu_info_display') && <AccumulatorsInfoDisplay key={'accu_info_display'} />}
        </React.Fragment>
    );
});

export default TradeParams;
