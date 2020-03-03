import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@deriv/components';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getLimitOrderAmount } from 'Stores/Modules/Contract/Helpers/limit-orders';

class ContractUpdateForm extends React.Component {
    componentWillUnmount() {
        this.props.resetContractUpdate(this.props.contract_id);
    }

    get is_valid_contract_update() {
        const contract = this.props.getContractById(this.props.contract_id);

        const {
            contract_info: { is_valid_to_cancel, limit_order },
            contract_update: { has_stop_loss, has_take_profit, stop_loss, take_profit },
        } = contract;

        const { stop_loss: contract_info_stop_loss, take_profit: contract_info_take_profit } = getLimitOrderAmount(
            limit_order
        );

        const isValid = val => !(val === undefined || val === null);

        const is_take_profit_valid = has_take_profit ? take_profit > 0 : isValid(contract_info_take_profit);
        const is_stop_loss_valid = has_stop_loss ? stop_loss > 0 : isValid(contract_info_stop_loss);

        return is_valid_to_cancel ? false : !!(is_take_profit_valid || is_stop_loss_valid);
    }

    render() {
        const {
            contract_info: { buy_price, cancellation: { ask_price: cancellation_price = 0 } = {}, is_valid_to_cancel },
            contract_update: {
                currency,
                has_stop_loss,
                has_take_profit,
                onClickContractUpdate,
                onChangeContractUpdate,
                stop_loss,
                take_profit,
            },
        } = this.props.getContractById(this.props.contract_id);

        const onChange = e => {
            const { name, value } = e.target;

            const contract_update = {};
            if (name === 'contract_update_take_profit') {
                contract_update.take_profit = value;
            }
            if (name === 'contract_update_stop_loss') {
                contract_update.stop_loss = value;
            }
            if (name === 'has_contract_update_take_profit') {
                contract_update.has_take_profit = value;
            }
            if (name === 'has_contract_update_stop_loss') {
                contract_update.has_stop_loss = value;
            }

            if (onChangeContractUpdate) {
                onChangeContractUpdate(contract_update, this.props.contract_id);
            }
        };

        const onClick = () => {
            onClickContractUpdate();
            this.props.toggleDialog();
        };

        const {
            contract_update_stop_loss: stop_loss_error_messages,
            contract_update_take_profit: take_profit_error_messages,
        } = this.props.validation_errors;

        const has_error =
            (has_stop_loss && stop_loss_error_messages && stop_loss_error_messages.length) ||
            (has_take_profit && take_profit_error_messages && take_profit_error_messages.length);

        const take_profit_input = (
            <InputWithCheckbox
                classNameInlinePrefix='trade-container__currency'
                currency={currency}
                error_messages={has_take_profit ? take_profit_error_messages : undefined}
                is_single_currency={true}
                is_negative_disabled={true}
                defaultChecked={has_take_profit}
                label={localize('Take profit')}
                name='contract_update_take_profit'
                onChange={onChange}
                value={take_profit}
                is_disabled={!!is_valid_to_cancel}
            />
        );

        const stop_loss_input = (
            <InputWithCheckbox
                classNameInlinePrefix='trade-container__currency'
                currency={currency}
                defaultChecked={has_stop_loss}
                error_messages={has_stop_loss ? stop_loss_error_messages : undefined}
                is_single_currency={true}
                is_negative_disabled={true}
                label={localize('Stop loss')}
                max_value={buy_price - cancellation_price}
                name='contract_update_stop_loss'
                onChange={onChange}
                value={stop_loss}
                is_disabled={!!is_valid_to_cancel}
            />
        );

        return (
            <React.Fragment>
                <div className='positions-drawer-dialog__input'>
                    {is_valid_to_cancel ? (
                        <Popover
                            alignment='right'
                            margin={4}
                            message={localize(
                                'You may update your take profit amount after deal cancellation has expired.'
                            )}
                        >
                            {take_profit_input}
                        </Popover>
                    ) : (
                        <React.Fragment>{take_profit_input}</React.Fragment>
                    )}
                </div>
                <div className='positions-drawer-dialog__input'>
                    {is_valid_to_cancel ? (
                        <Popover
                            alignment='right'
                            margin={4}
                            message={localize(
                                'You may update your stop loss amount after deal cancellation has expired.'
                            )}
                        >
                            {stop_loss_input}
                        </Popover>
                    ) : (
                        <React.Fragment>{stop_loss_input}</React.Fragment>
                    )}
                </div>
                <div className='positions-drawer-dialog__button'>
                    <Button
                        text={localize('Apply')}
                        onClick={onClick}
                        primary
                        is_disabled={has_error || !this.is_valid_contract_update}
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
    getContractById: modules.contract_replay.getContractById,
    resetContractUpdate: modules.contract_replay.resetContractUpdate,
    validation_errors: modules.contract_trade.validation_errors,
}))(ContractUpdateForm);
