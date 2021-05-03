import PropTypes from 'prop-types';
import React from 'react';
import { isEmptyObject } from '@deriv/shared';
import PurchaseFieldset from 'Modules/Trading/Components/Elements/purchase-fieldset.jsx';
import { getContractTypePosition } from 'Constants/contract';
import { connect } from 'Stores/connect';

const Purchase = ({
    basis,
    contract_type,
    currency,
    has_cancellation,
    is_multiplier,
    is_mobile,
    is_purchase_enabled,
    // is_purchase_confirm_on,
    purchased_states_arr,
    // is_purchase_locked,
    is_trade_enabled,
    onClickPurchase,
    onHoverPurchase,
    // togglePurchaseLock,
    purchase_info,
    proposal_info,
    setPurchaseState,
    trade_types,
    validation_errors,
}) => {
    const is_high_low = /^high_low$/.test(contract_type.toLowerCase());
    const isLoading = info => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return !has_validation_error && !info.has_error && !info.id;
    };
    const is_proposal_empty = isEmptyObject(proposal_info);

    const components = [];
    Object.keys(trade_types).map((type, index) => {
        const getSortedIndex = () => {
            if (getContractTypePosition(type) === 'top') return 0;
            if (getContractTypePosition(type) === 'bottom') return 1;
            return index;
        };
        const info = proposal_info[type] || {};
        const is_disabled = !is_trade_enabled || !info.id || !is_purchase_enabled;
        const is_proposal_error = is_multiplier ? info.has_error && !info.has_error_details : info.has_error;
        const is_market_close =
            is_proposal_error && info.error_code === 'ContractBuyValidationError' && info.error_field === 'symbol';
        const purchase_fieldset = (
            <PurchaseFieldset
                basis={basis}
                buy_info={purchase_info}
                currency={currency}
                info={info}
                key={index}
                index={getSortedIndex(index, type)}
                has_cancellation={has_cancellation}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={isLoading(info)}
                is_market_close={is_market_close}
                is_mobile={is_mobile}
                is_multiplier={is_multiplier}
                // is_purchase_confirm_on={is_purchase_confirm_on}
                is_proposal_empty={is_proposal_empty}
                is_proposal_error={is_proposal_error}
                purchased_states_arr={purchased_states_arr}
                // is_purchase_locked={is_purchase_locked}
                // togglePurchaseLock={togglePurchaseLock}
                onHoverPurchase={onHoverPurchase}
                onClickPurchase={onClickPurchase}
                setPurchaseState={setPurchaseState}
                type={type}
            />
        );

        switch (getContractTypePosition(type)) {
            case 'top':
                components.unshift(purchase_fieldset);
                break;
            case 'bottom':
                components.push(purchase_fieldset);
                break;
            default:
                components.push(purchase_fieldset);
                break;
        }
    });
    return components;
};

Purchase.propTypes = {
    basis: PropTypes.string,
    currency: PropTypes.string,
    has_cancellation: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_mobile: PropTypes.bool,
    // is_purchase_confirm_on    : PropTypes.bool,
    is_purchase_locked: PropTypes.bool,
    is_trade_enabled: PropTypes.bool,
    onClickPurchase: PropTypes.func,
    onHoverPurchase: PropTypes.func,
    proposal_info: PropTypes.object,
    purchase_info: PropTypes.object,
    purchased_states_arr: PropTypes.array,
    setPurchaseState: PropTypes.func,
    // togglePurchaseLock        : PropTypes.func,
    trade_types: PropTypes.object,
    validation_errors: PropTypes.object,
};

export default connect(({ modules, ui }) => ({
    currency: modules.trade.currency,
    basis: modules.trade.basis,
    contract_type: modules.trade.contract_type,
    has_cancellation: modules.trade.has_cancellation,
    is_purchase_enabled: modules.trade.is_purchase_enabled,
    is_trade_enabled: modules.trade.is_trade_enabled,
    is_multiplier: modules.trade.is_multiplier,
    onClickPurchase: modules.trade.onPurchase,
    onHoverPurchase: modules.trade.onHoverPurchase,
    proposal_info: modules.trade.proposal_info,
    purchase_info: modules.trade.purchase_info,
    trade_types: modules.trade.trade_types,
    validation_errors: modules.trade.validation_errors,
    is_mobile: ui.is_mobile,
    purchased_states_arr: ui.purchase_states,
    setPurchaseState: ui.setPurchaseState,
    // is_purchase_confirm_on    : ui.is_purchase_confirm_on,
    // is_purchase_locked        : ui.is_purchase_lock_on,
    // togglePurchaseLock        : ui.togglePurchaseLock,
}))(Purchase);
