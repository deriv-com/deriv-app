import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@deriv/components';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getLimitOrderAmount } from 'Stores/Modules/Contract/Helpers/limit-orders';
import { getCancellationPrice } from 'Stores/Modules/Contract/Helpers/logic';

class ContractUpdateForm extends React.Component {
    componentWillUnmount() {
        this.props.clearContractUpdateConfigValues(this.props.contract_id);
    }

    get contract() {
        return this.props.getContractById(this.props.contract_id);
    }

    get contract_info() {
        return this.contract.contract_info;
    }

    get contract_update_config() {
        return this.contract.contract_update_config;
    }

    get limit_order() {
        const { stop_loss, take_profit } = getLimitOrderAmount(this.contract_info.limit_order);

        return {
            current_stop_loss: stop_loss,
            current_take_profit: take_profit,
        };
    }

    get is_valid_contract_update() {
        const {
            has_contract_update_take_profit,
            has_contract_update_stop_loss,
            contract_update_take_profit,
            contract_update_stop_loss,
        } = this.contract_update_config;
        const { current_take_profit, current_stop_loss } = this.limit_order;

        const is_take_profit_valid = has_contract_update_take_profit
            ? contract_update_take_profit > 0
            : this.isValid(current_take_profit);
        const is_stop_loss_valid = has_contract_update_stop_loss
            ? contract_update_stop_loss > 0
            : this.isValid(current_stop_loss);

        return this.contract_info.is_valid_to_cancel ? false : !!(is_take_profit_valid || is_stop_loss_valid);
    }

    get error_messages() {
        const { has_contract_update_stop_loss, has_contract_update_take_profit } = this.contract_update_config;

        const {
            contract_update_stop_loss: stop_loss,
            contract_update_take_profit: take_profit,
        } = this.props.validation_errors;

        return {
            take_profit: has_contract_update_take_profit ? take_profit : undefined,
            stop_loss: has_contract_update_stop_loss ? stop_loss : undefined,
        };
    }

    get has_validation_errors() {
        return Object.keys(this.error_messages).some(field => this.error_messages[field]?.length);
    }

    isValid = val => !(val === undefined || val === null);

    onChange = e => {
        const { name, value } = e.target;

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(
                {
                    name,
                    value,
                },
                this.props.contract_id
            );
        }
    };

    onClick = () => {
        this.props.updateLimitOrder(this.props.contract_id);
        this.props.toggleDialog();
    };

    render() {
        const { buy_price, is_valid_to_cancel } = this.contract_info;
        const cancellation_price = getCancellationPrice(this.contract_info);
        const {
            currency,
            has_contract_update_stop_loss,
            has_contract_update_take_profit,
            contract_update_stop_loss,
            contract_update_take_profit,
        } = this.contract_update_config;

        const take_profit_input = (
            <InputWithCheckbox
                classNameInlinePrefix='trade-container__currency'
                currency={currency}
                error_messages={this.error_messages.take_profit}
                is_single_currency={true}
                is_negative_disabled={true}
                defaultChecked={has_contract_update_take_profit}
                label={localize('Take profit')}
                name='contract_update_take_profit'
                onChange={this.onChange}
                error_message_alignment='right'
                value={contract_update_take_profit}
                is_disabled={!!is_valid_to_cancel}
            />
        );

        const stop_loss_input = (
            <InputWithCheckbox
                classNameInlinePrefix='trade-container__currency'
                currency={currency}
                defaultChecked={has_contract_update_stop_loss}
                error_messages={this.error_messages.stop_loss}
                is_single_currency={true}
                is_negative_disabled={true}
                label={localize('Stop loss')}
                max_value={buy_price - cancellation_price}
                name='contract_update_stop_loss'
                onChange={this.onChange}
                error_message_alignment='right'
                value={contract_update_stop_loss}
                is_disabled={!!is_valid_to_cancel}
            />
        );

        return (
            <React.Fragment>
                <div className='positions-drawer-dialog__input'>{take_profit_input}</div>
                <div className='positions-drawer-dialog__input'>{stop_loss_input}</div>
                <div className='positions-drawer-dialog__button'>
                    <Button
                        text={localize('Apply')}
                        onClick={this.onClick}
                        primary
                        is_disabled={this.has_validation_errors || !this.is_valid_contract_update}
                    />
                </div>
            </React.Fragment>
        );
    }
}

ContractUpdateForm.propTypes = {
    contract_id: PropTypes.number,
    getContractById: PropTypes.func,
    resetContractUpdate: PropTypes.func,
    toggleDialog: PropTypes.func,
    validation_errors: PropTypes.object,
};

export default connect(({ modules }) => ({
    clearContractUpdateConfigValues: modules.contract_trade.clearContractUpdateConfigValues,
    getContractById: modules.contract_trade.getContractById,
    onChange: modules.contract_trade.onChange,
    updateLimitOrder: modules.contract_trade.updateLimitOrder,
    validation_errors: modules.contract_trade.validation_errors,
}))(ContractUpdateForm);
