import React from 'react';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import { isTradeParamVisible } from 'AppV2/Utils/layout-utils';
import AllowEquals from './AllowEquals';
import Duration from './Duration';
import Stake from './Stake';
import Barrier from './Barrier';
import GrowthRate from './GrowthRate';
import TakeProfit from './TakeProfit';
import AccumulatorsInformation from './AccumulatorsInformation';
import Multiplier from './Multiplier';
import RiskManagement from './RiskManagement';
import MultipliersDealCancellationInfo from './MultipliersDealCancellationInfo';
import TradeTypeTabs from './TradeTypeTabs';
import Strike from './Strike';
import PayoutPerPoint from './PayoutPerPoint';
import LastDigitPrediction from './LastDigitPrediction';
import MultipliersExpirationInfo from './MultipliersExpirationInfo';
import BarrierInfo from './BarrierInfo';
import PayoutPerPointInfo from './PayoutPerPointInfo';
import PayoutInfo from './PayoutInfo';

export type TTradeParametersProps = {
    is_minimized?: boolean;
    is_disabled?: boolean;
};

const TradeParameters = observer(({ is_minimized, is_disabled }: TTradeParametersProps) => {
    const { contract_type, has_cancellation, symbol } = useTraderStore();
    const isVisible = (component_key: string) =>
        isTradeParamVisible({ component_key, contract_type, has_cancellation, symbol });

    const renderComponentIfVisible = (
        component_key: string,
        Component: React.ComponentType<TTradeParametersProps>,
        extraCondition = true
    ) => {
        return (
            isVisible(component_key) &&
            extraCondition && <Component is_minimized={is_minimized} is_disabled={is_disabled} />
        );
    };

    return (
        <div
            className={clsx(
                'trade-params__options__wrapper',
                is_minimized && 'trade-params__options__wrapper--minimized'
            )}
        >
            {is_minimized && (
                <React.Fragment>
                    {isVisible('expiration') && <MultipliersExpirationInfo is_disabled={is_disabled} />}
                    {isVisible('mult_info_display') && <MultipliersDealCancellationInfo is_disabled={is_disabled} />}
                    {isVisible('payout_per_point_info') && <PayoutPerPointInfo is_disabled={is_disabled} />}
                    {isVisible('allow_equals') && <AllowEquals is_disabled={is_disabled} />}
                    {isVisible('payout') && <PayoutInfo is_disabled={is_disabled} />}
                </React.Fragment>
            )}
            <div
                className={clsx(
                    'trade-params__options__wrapper',
                    is_minimized && 'trade-params__options__wrapper--horizontal'
                )}
            >
                {renderComponentIfVisible('trade_type_tabs', TradeTypeTabs)}
                {renderComponentIfVisible('last_digit', LastDigitPrediction)}
                {renderComponentIfVisible('duration', Duration)}
                {renderComponentIfVisible('strike', Strike)}
                {renderComponentIfVisible('barrier', Barrier)}
                {renderComponentIfVisible('growth_rate', GrowthRate)}
                {renderComponentIfVisible('multiplier', Multiplier)}
                {renderComponentIfVisible('stake', Stake)}
                {renderComponentIfVisible('payout_per_point', PayoutPerPoint)}
                {/* Special cases: only renders when not minimized */}
                {renderComponentIfVisible('allow_equals', AllowEquals, !is_minimized)}
                {renderComponentIfVisible('take_profit', TakeProfit)}
                {renderComponentIfVisible('risk_management', RiskManagement)}
                {renderComponentIfVisible('expiration', MultipliersExpirationInfo, !is_minimized)}
                {renderComponentIfVisible('accu_info_display', AccumulatorsInformation, !is_minimized)}
                {renderComponentIfVisible('barrier_info', BarrierInfo, !is_minimized)}
                {renderComponentIfVisible('payout_per_point_info', PayoutPerPointInfo, !is_minimized)}
                {renderComponentIfVisible('payout', PayoutInfo, !is_minimized)}
                {renderComponentIfVisible('mult_info_display', MultipliersDealCancellationInfo, !is_minimized)}
            </div>
        </div>
    );
});

export default TradeParameters;
