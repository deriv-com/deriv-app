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
import { MultiplierOptionsWidget } from 'Modules/Trading/Components/Form/TradeParams/Multiplier/widgets.jsx';
import RiskManagementInfo from '../Elements/Multiplier/risk-management-info.jsx';
import MobileWidget from '../Elements/mobile-widget.jsx';
import ContractType from '../../Containers/contract-type.jsx';
import { BarrierMobile, LastDigitMobile } from '../../Containers/trade-params-mobile.jsx';
import Purchase from '../../Containers/purchase.jsx';
import 'Sass/app/_common/mobile-widget.scss';
import Strike from 'Modules/Trading/Components/Form/TradeParams/strike.jsx';
import VanillaTradeTypes from 'Modules/Trading/Components/Form/TradeParams/vanilla-trade-types.jsx';

const CollapsibleTradeParams = ({
    form_components,
    has_allow_equals,
    previous_symbol,
    is_allow_equal,
    is_trade_params_expanded,
    is_multiplier,
    is_vanilla,
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
            <div className='trade-params__contract-type-container'>
                <ContractType />
                {is_multiplier && <MultiplierOptionsWidget />}
                {is_vanilla && <VanillaTradeTypes />}
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
            {isVisible('strike') && (
                <div collapsible='true'>
                    <Strike />
                </div>
            )}
            <MobileWidget is_collapsed={is_collapsed} toggleDigitsWidget={toggleDigitsWidget} />
            {has_allow_equals && <AllowEqualsMobile collapsible='true' />}
            {is_multiplier && (
                <div collapsible='true'>
                    <RiskManagementInfo />
                </div>
            )}
            {is_vanilla ? (
                <Purchase />
            ) : (
                <div className='purchase-container'>
                    <Purchase />
                </div>
            )}
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
    is_allow_equal: !!modules.trade.is_equal,
    is_multiplier: modules.trade.is_multiplier,
    is_vanilla: modules.trade.is_vanilla,
    duration_unit: modules.trade.duration_unit,
    contract_types_list: modules.trade.contract_types_list,
    contract_type: modules.trade.contract_type,
    expiry_type: modules.trade.expiry_type,
    contract_start_type: modules.trade.contract_start_type,
    form_components: modules.trade.form_components,
    previous_symbol: modules.trade.previous_symbol,
    is_trade_params_expanded: modules.trade.is_trade_params_expanded,
    setIsTradeParamsExpanded: modules.trade.setIsTradeParamsExpanded,
}))(ScreenSmall);
