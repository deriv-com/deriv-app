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
import MobileWidget from '../Elements/mobile-widget.jsx';
import ContractType from '../../Containers/contract-type.jsx';
import Purchase from '../../Containers/purchase.jsx';
import 'Sass/app/_common/mobile-widget.scss';

const ScreenSmall = ({
    is_trade_enabled,
    duration_unit,
    contract_types_list,
    contract_type,
    expiry_type,
    contract_start_type,
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
        <Collapsible position='top' is_collapsed>
            <ContractType />
            <MobileWidget />
            {has_allow_equals && <AllowEqualsMobile collapsible />}
            <div className='purchase-container'>
                <Purchase />
            </div>
        </Collapsible>
    );
};

ScreenSmall.propTypes = {
    is_trade_enabled: PropTypes.bool,
};

export default connect(({ modules }) => ({
    is_allow_equal: !!modules.trade.is_equal,
    duration_unit: modules.trade.duration_unit,
    contract_types_list: modules.trade.contract_types_list,
    contract_type: modules.trade.contract_type,
    expiry_type: modules.trade.expiry_type,
    contract_start_type: modules.trade.contract_start_type,
}))(ScreenSmall);
