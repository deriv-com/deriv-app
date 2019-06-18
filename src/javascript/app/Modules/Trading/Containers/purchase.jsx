import PropTypes                   from 'prop-types';
import React                       from 'react';
import PurchaseFieldset            from 'Modules/Trading/Components/Elements/purchase-fieldset.jsx';
import { getContractTypePosition } from 'Constants/contract';
import { connect }                 from 'Stores/connect';

const Purchase = ({
    basis,
    contract_type,
    currency,
    is_contract_mode,
    is_client_allowed_to_visit,
    // is_purchase_confirm_on,
    is_purchase_enabled,
    // is_purchase_locked,
    is_trade_enabled,
    onClickPurchase,
    onHoverPurchase,
    // togglePurchaseLock,
    proposal_info,
    trade_types,
    validation_errors,
}) => {
    const is_high_low = /high_low/.test(contract_type.toLowerCase());
    const isLoading = info => {
        const has_validation_error = Object.values(validation_errors).some(e => e.length);
        return !has_validation_error && !info.has_error && !info.id;
    };

    const components = [];
    Object.keys(trade_types).map((type, index) => {
        const info              = proposal_info[type] || {};
        const is_disabled       = is_contract_mode || !is_purchase_enabled
            || !is_trade_enabled || !info.id || !is_client_allowed_to_visit;
        const is_proposal_error = info.has_error && !info.has_error_details;

        const purchase_fieldset = (
            <PurchaseFieldset
                basis={basis}
                currency={currency}
                info={info}
                key={index}
                index={index}
                is_contract_mode={is_contract_mode}
                is_disabled={is_disabled}
                is_high_low={is_high_low}
                is_loading={isLoading(info)}
                // is_purchase_confirm_on={is_purchase_confirm_on}
                is_proposal_error={is_proposal_error}
                // is_purchase_locked={is_purchase_locked}
                // togglePurchaseLock={togglePurchaseLock}
                onHoverPurchase={onHoverPurchase}
                onClickPurchase={onClickPurchase}
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
    basis                     : PropTypes.string,
    currency                  : PropTypes.string,
    is_client_allowed_to_visit: PropTypes.bool,
    is_contract_mode          : PropTypes.bool,
    // is_purchase_confirm_on    : PropTypes.bool,
    is_purchase_enabled       : PropTypes.bool,
    is_purchase_locked        : PropTypes.bool,
    is_trade_enabled          : PropTypes.bool,
    onClickPurchase           : PropTypes.func,
    onHoverPurchase           : PropTypes.func,
    proposal_info             : PropTypes.object,
    purchase_info             : PropTypes.object,
    // togglePurchaseLock        : PropTypes.func,
    trade_types               : PropTypes.object,
    validation_errors         : PropTypes.object,
};

export default connect(
    ({ client, modules }) => ({
        currency                  : client.currency,
        is_client_allowed_to_visit: client.is_client_allowed_to_visit,
        is_contract_mode          : modules.smart_chart.is_contract_mode,
        basis                     : modules.trade.basis,
        contract_type             : modules.trade.contract_type,
        is_purchase_enabled       : modules.trade.is_purchase_enabled,
        is_trade_enabled          : modules.trade.is_trade_enabled,
        onClickPurchase           : modules.trade.onPurchase,
        onHoverPurchase           : modules.trade.onHoverPurchase,
        proposal_info             : modules.trade.proposal_info,
        purchase_info             : modules.trade.purchase_info,
        trade_types               : modules.trade.trade_types,
        validation_errors         : modules.trade.validation_errors,
        // is_purchase_confirm_on    : ui.is_purchase_confirm_on,
        // is_purchase_locked        : ui.is_purchase_lock_on,
        // togglePurchaseLock        : ui.togglePurchaseLock,
    }),
)(Purchase);
