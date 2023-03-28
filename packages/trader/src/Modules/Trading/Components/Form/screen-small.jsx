import PropTypes from 'prop-types';
import React from 'react';
import { Collapsible } from '@deriv/components';
import { TradeParamsLoader } from 'App/Components/Elements/ContentLoader';
import AllowEqualsMobile from 'Modules/Trading/Containers/allow-equals.jsx';
import { connect } from 'Stores/connect';
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
import BarrierSelector from 'Modules/Trading/Components/Form/TradeParams/Turbos/barrier-selector';
import PayoutPerPointMobile from 'Modules/Trading/Components/Elements/payout-per-point-mobile';
import TradeTypeTabs from 'Modules/Trading/Components/Form/TradeParams/trade-type-tabs';

const CollapsibleTradeParams = ({
    form_components,
    has_allow_equals,
    has_take_profit,
    previous_symbol,
    is_allow_equal,
    is_accumulator,
    is_multiplier,
    is_trade_params_expanded,
    is_turbos,
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
                {isVisible('trade_type_tabs') && <TradeTypeTabs />}
                {is_accumulator && <AccumulatorOptionsWidget />}
            </div>
            {isVisible('last_digit') && (
                <div collapsible='true'>
                    <LastDigitMobile />
                </div>
            )}
            {isVisible('barrier') && (
                <div collapsible='true'>
                    <BarrierMobile />
                </div>
            )}
            {isVisible('barrier_selector') && (
                <div collapsible='true'>
                    <BarrierSelector />
                </div>
            )}
            {isVisible('strike') && (
                <div collapsible='true'>
                    <Strike />
                </div>
            )}
            {!is_accumulator && <MobileWidget is_collapsed={is_collapsed} toggleDigitsWidget={toggleDigitsWidget} />}
            {has_allow_equals && <AllowEqualsMobile collapsible='true' />}
            {(is_multiplier || is_turbos) && (
                <div collapsible='true'>
                    <RiskManagementInfo />
                </div>
            )}
            {is_accumulator && [
                <AccumulatorsAmountMobile key='accu_amount' />,
                <div collapsible='true' key='accu_take_profit' className={classNames('take-profit', 'mobile-widget')}>
                    <TakeProfit
                        take_profit={take_profit}
                        has_take_profit={has_take_profit}
                        onChange={onChange}
                        has_info={false}
                    />
                </div>,
                <div collapsible='true' key='accu_info'>
                    <AccumulatorsInfoDisplay />
                </div>,
            ]}
            {(is_turbos || is_vanilla) && <PayoutPerPointMobile />}
            <div
                className={classNames({
                    'purchase-container': !is_vanilla,
                    [`purchase-container__${is_accumulator ? 'accumulator' : 'turbos'}`]: is_accumulator || is_turbos,
                })}
            >
                <Purchase />
            </div>
        </Collapsible>
    );
};

const ScreenSmall = ({
    is_trade_enabled,
    duration_unit,
    contract_types_list,
    contract_type,
    expiry_type,
    contract_start_type,
    ...props
}) => {
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
        <CollapsibleTradeParams has_allow_equals={has_allow_equals} {...props} />
    );
};

ScreenSmall.propTypes = {
    contract_start_type: PropTypes.string,
    contract_type: PropTypes.string,
    contract_types_list: PropTypes.object,
    duration_unit: PropTypes.string,
    expiry_type: PropTypes.string,
    is_trade_enabled: PropTypes.bool,
};

export default connect(({ modules }) => ({
    is_accumulator: modules.trade.is_accumulator,
    is_allow_equal: !!modules.trade.is_equal,
    is_multiplier: modules.trade.is_multiplier,
    is_turbos: modules.trade.is_turbos,
    is_vanilla: modules.trade.is_vanilla,
    duration_unit: modules.trade.duration_unit,
    contract_types_list: modules.trade.contract_types_list,
    contract_type: modules.trade.contract_type,
    expiry_type: modules.trade.expiry_type,
    contract_start_type: modules.trade.contract_start_type,
    form_components: modules.trade.form_components,
    has_take_profit: modules.trade.has_take_profit,
    onChange: modules.trade.onChange,
    previous_symbol: modules.trade.previous_symbol,
    is_trade_params_expanded: modules.trade.is_trade_params_expanded,
    setIsTradeParamsExpanded: modules.trade.setIsTradeParamsExpanded,
    take_profit: modules.trade.take_profit,
}))(ScreenSmall);
