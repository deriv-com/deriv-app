import React from 'react';
import { getTradeParams } from 'AppV2/Utils/trade-params-utils';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import { useTraderStore } from 'Stores/useTraderStores';
import AllowEquals from './AllowEquals';
import Duration from './Duration';
import Stake from './Stake';
import Barrier from './Barrier';
import GrowthRate from './GrowthRate';
import TakeProfit from './TakeProfit';
import AccumulatorsInformation from './AccumulatorsInformation';
import Multiplier from './Multiplier';
import RiskManagement from './RiskManagement';
import MultipliersInformation from './MultipliersInformation';
import TradeTypeTabs from './TradeTypeTabs';
import Strike from './Strike';
import PayoutPerPoint from './PayoutPerPoint';
import LastDigitPrediction from './LastDigitPrediction';

type TTradeParametersProps = {
    is_minimized?: boolean;
};

const TradeParameters = observer(({ is_minimized }: TTradeParametersProps) => {
    const { contract_type, symbol } = useTraderStore();
    const isVisible = (component_key: string) => {
        return getTradeParams(symbol)[contract_type].includes(component_key);
    };

    return (
        <div
            className={clsx(
                'trade-params__options__wrapper',
                is_minimized && 'trade-params__options__wrapper--minimized'
            )}
        >
            {isVisible('trade_type_tabs') && <TradeTypeTabs is_minimized={is_minimized} key='trade_type_tabs' />}
            {isVisible('last_digit') && <LastDigitPrediction is_minimized={is_minimized} key='last_digit' />}
            {isVisible('duration') && <Duration is_minimized={is_minimized} key='duration' />}
            {isVisible('strike') && <Strike is_minimized={is_minimized} key='strike' />}
            {isVisible('payout_per_point') && <PayoutPerPoint is_minimized={is_minimized} key='payout_per_point' />}
            {isVisible('barrier') && <Barrier is_minimized={is_minimized} key='barrier' />}
            {isVisible('growth_rate') && <GrowthRate is_minimized={is_minimized} key='growth_rate' />}
            {isVisible('multiplier') && <Multiplier is_minimized={is_minimized} key='multiplier' />}
            {isVisible('stake') && <Stake is_minimized={is_minimized} key='stake' />}
            {isVisible('allow_equals') && <AllowEquals is_minimized={is_minimized} key='allow_equals' />}
            {isVisible('take_profit') && <TakeProfit is_minimized={is_minimized} key='take_profit' />}
            {isVisible('risk_management') && <RiskManagement is_minimized={is_minimized} key='risk_management' />}
            {/* {isVisible('expiration') && <MultipliersExpirationInfo key='expiration' />} */}
            {isVisible('accu_info_display') && (
                <AccumulatorsInformation is_minimized={is_minimized} key='accu_info_display' />
            )}
            {isVisible('mult_info_display') && (
                <MultipliersInformation is_minimized={is_minimized} key='mult_info_display' />
            )}
        </div>
    );
});

export default TradeParameters;
