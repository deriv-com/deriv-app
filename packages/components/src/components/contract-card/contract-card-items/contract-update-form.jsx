import React from 'react';
import PropTypes from 'prop-types';
import { getCancellationPrice, getContractUpdateConfig, getLimitOrderAmount, isDeepEqual, pick } from '@deriv/shared';
import Button from '../../button';
import InputWithCheckbox from '../../input-wth-checkbox';

class ContractUpdateForm extends React.Component {
    componentWillUnmount() {
        this.props.contract.clearContractUpdateConfigValues();
    }

    get contract_info() {
        return this.props.contract.contract_info;
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
            contract_update_take_profit,
            has_contract_update_take_profit,
            contract_update_stop_loss,
            has_contract_update_stop_loss,
        } = this.props.contract;

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
        const { has_contract_update_take_profit, has_contract_update_stop_loss } = this.props.contract;

        const {
            contract_update_stop_loss: stop_loss,
            contract_update_take_profit: take_profit,
        } = this.props.contract.validation_errors;

        return {
            take_profit: has_contract_update_take_profit ? take_profit : undefined,
            stop_loss: has_contract_update_stop_loss ? stop_loss : undefined,
        };
    }

    get has_validation_errors() {
        return Object.keys(this.error_messages).some(field => this.error_messages[field]?.length);
    }

    getStateToCompare = _state => {
        const props_to_pick = [
            'has_contract_update_take_profit',
            'has_contract_update_stop_loss',
            _state.has_contract_update_take_profit && 'contract_update_take_profit',
            _state.has_contract_update_stop_loss && 'contract_update_stop_loss',
        ];

        return pick(_state, props_to_pick);
    };

    isStateUnchanged() {
        return isDeepEqual(
            this.getStateToCompare(getContractUpdateConfig(this.props.contract.contract_info)),
            this.getStateToCompare(this.props)
        );
    }

    isValid = val => !(val === undefined || val === null);

    onChange = e => {
        const { name, value } = e.target;

        if (typeof this.props.contract.onChange === 'function') {
            this.props.contract.onChange({
                name,
                value,
            });
        }
    };

    onClick = e => {
        this.props.contract.updateLimitOrder();
        this.props.toggleDialog(e);
    };

    render() {
        const { addToast, removeToast, getCardLabels } = this.props;
        const {
            contract_update_take_profit,
            has_contract_update_take_profit,
            contract_update_stop_loss,
            has_contract_update_stop_loss,
        } = this.props.contract;
        const { buy_price, currency, is_valid_to_cancel } = this.contract_info;
        const cancellation_price = getCancellationPrice(this.contract_info);
        const take_profit_input = (
            <InputWithCheckbox
                addToast={addToast}
                removeToast={removeToast}
                classNameInlinePrefix='trade-container__currency'
                currency={currency}
                error_messages={this.error_messages.take_profit}
                is_single_currency={true}
                is_negative_disabled={true}
                defaultChecked={has_contract_update_take_profit}
                label={getCardLabels().TAKE_PROFIT}
                name='contract_update_take_profit'
                onChange={this.onChange}
                error_message_alignment='right'
                value={contract_update_take_profit}
                is_disabled={!!is_valid_to_cancel}
            />
        );

        const stop_loss_input = (
            <InputWithCheckbox
                addToast={addToast}
                removeToast={removeToast}
                classNameInlinePrefix='trade-container__currency'
                currency={currency}
                defaultChecked={has_contract_update_stop_loss}
                error_messages={this.error_messages.stop_loss}
                is_single_currency={true}
                is_negative_disabled={true}
                label={getCardLabels().STOP_LOSS}
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
                <div className='dc-contract-card-dialog__input'>{take_profit_input}</div>
                <div className='dc-contract-card-dialog__input'>{stop_loss_input}</div>
                <div className='dc-contract-card-dialog__button'>
                    <Button
                        text={getCardLabels().APPLY}
                        onClick={this.onClick}
                        primary
                        is_disabled={
                            this.has_validation_errors || !this.is_valid_contract_update || this.isStateUnchanged()
                        }
                    />
                </div>
            </React.Fragment>
        );
    }
}

ContractUpdateForm.propTypes = {
    contract: PropTypes.object,
    currency: PropTypes.string,
    getContractById: PropTypes.func,
    resetContractUpdate: PropTypes.func,
    toggleDialog: PropTypes.func,
    validation_errors: PropTypes.object,
};

export default ContractUpdateForm;
