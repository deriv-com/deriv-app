import PropTypes from 'prop-types';
import React from 'react';
import { Collapsible } from '@deriv/components';
import { TradeParamsLoader } from 'App/Components/Elements/ContentLoader';
import AllowEqualsMobile from 'Modules/Trading/Containers/allow-equals.jsx';
import {
    hasCallPutEqual,
    hasDurationForCallPutEqual,
    isRiseFallEqual,
} from 'Stores/Modules/Trading/Helpers/allow-equals';
import {
    AccumulatorOptionsWidget,
    MultiplierOptionsWidget,
} from 'Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx';
import AccumulatorsAmountMobile from 'Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-amount-mobile.jsx';
import AccumulatorsInfoDisplay from 'Modules/Trading/Components/Form/TradeParams/Accumulator/accumulators-info-display.jsx';
import { BarrierMobile, LastDigitMobile } from 'Modules/Trading/Containers/trade-params-mobile.jsx';
import ContractType from 'Modules/Trading/Containers/contract-type.jsx';
import MobileWidget from 'Modules/Trading/Components/Elements/mobile-widget.jsx';
import Purchase from 'Modules/Trading/Containers/purchase.jsx';
import RiskManagementInfo from 'Modules/Trading/Components/Elements/Multiplier/risk-management-info.jsx';
import TakeProfit from 'Modules/Trading/Components/Form/TradeParams/Multiplier/take-profit.jsx';
import 'Sass/app/_common/mobile-widget.scss';
import classNames from 'classnames';
import AccumulatorsStats from 'Modules/Contract/Components/AccumulatorsStats';
import Strike from 'Modules/Trading/Components/Form/TradeParams/strike.jsx';
import VanillaTradeTypes from 'Modules/Trading/Components/Form/TradeParams/vanilla-trade-types.jsx';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const CollapsibleTradeParams = ({
    form_components,
    has_allow_equals,
    has_take_profit,
    previous_symbol,
    is_allow_equal,
    is_accumulator,
    is_trade_params_expanded,
    is_multiplier,
    is_vanilla,
    onChange,
    take_profit,
    setIsTradeParamsExpanded,
}) => {
    React.useEffect(() => {
        if (previous_symbol && is_allow_equal && has_allow_equals) setIsTradeParamsExpanded(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previous_symbol]);

    const is_collapsed = !is_trade_params_expanded;

    const onClick = e => {
        setIsTradeParamsExpanded(e);
    };

    const toggleDigitsWidget = () => {
        setIsTradeParamsExpanded(true);
    };

    const isVisible = component => form_components.includes(component);

    return (
        <Collapsible position='top' is_collapsed={is_collapsed} onClick={onClick}>
            {is_accumulator && is_collapsed && <AccumulatorsStats />}
            <div className='trade-params__contract-type-container'>
                <ContractType />
                {is_multiplier && <MultiplierOptionsWidget />}
                {is_accumulator && <AccumulatorOptionsWidget />}
                {is_vanilla && <VanillaTradeTypes />}
            </div>
            {isVisible('last_digit') && (
                <div data-collapsible='true'>
                    <LastDigitMobile />
                </div>
            )}
            {isVisible('barrier') && (
                <div data-collapsible='true'>
                    <BarrierMobile />
                </div>
            )}
            {isVisible('strike') && (
                <div data-collapsible='true'>
                    <Strike />
                </div>
            )}

            {!is_accumulator && <MobileWidget is_collapsed={is_collapsed} toggleDigitsWidget={toggleDigitsWidget} />}
            {has_allow_equals && (
                <div data-collapsible='true'>
                    <AllowEqualsMobile />
                </div>
            )}
            {is_multiplier && (
                <div data-collapsible='true'>
                    <RiskManagementInfo />
                </div>
            )}
            {is_accumulator && [
                <AccumulatorsAmountMobile key='accu_amount' />,
                <div
                    data-collapsible='true'
                    key='accu_take_profit'
                    className={classNames('take-profit', 'mobile-widget')}
                >
                    <TakeProfit
                        take_profit={take_profit}
                        has_take_profit={has_take_profit}
                        onChange={onChange}
                        has_info={false}
                    />
                </div>,
                <div data-collapsible='true' key='accu_info'>
                    <AccumulatorsInfoDisplay />
                </div>,
            ]}
            {is_vanilla ? (
                <Purchase />
            ) : (
                <div className={`purchase-container${is_accumulator ? '--accumulator' : ''}`}>
                    <Purchase />
                </div>
            )}
        </Collapsible>
    );
};

const ScreenSmall = observer(({ is_trade_enabled }) => {
    const trade_store = useTraderStore();
    const {
        is_accumulator,
        is_multiplier,
        is_vanilla,
        duration_unit,
        contract_types_list,
        contract_type,
        expiry_type,
        contract_start_type,
        form_components,
        has_take_profit,
        onChange,
        previous_symbol,
        is_trade_params_expanded,
        setIsTradeParamsExpanded,
        take_profit,
    } = trade_store;
    const is_allow_equal = !!trade_store.is_equal;

    const collapsible_trade_params_props = {
        is_accumulator,
        is_multiplier,
        is_vanilla,
        form_components,
        has_take_profit,
        onChange,
        previous_symbol,
        is_trade_params_expanded,
        setIsTradeParamsExpanded,
        take_profit,
        is_allow_equal,
    };

    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );

    const has_callputequal = hasCallPutEqual(contract_types_list);
    const has_allow_equals =
        isRiseFallEqual(contract_type) && (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    return !is_trade_enabled ? (
        <div className='mobile-wrapper__content-loader'>
            <TradeParamsLoader speed={2} />
        </div>
    ) : (
        <CollapsibleTradeParams has_allow_equals={has_allow_equals} {...collapsible_trade_params_props} />
    );
});

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default ScreenSmall;
