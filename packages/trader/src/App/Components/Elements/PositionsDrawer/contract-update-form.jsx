import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, MobileWrapper, Money } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDeepEqual, isCryptocurrency, pick } from '@deriv/shared';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { connect } from 'Stores/connect';
import { getLimitOrderAmount } from 'Stores/Modules/Contract/Helpers/limit-orders';
import { getCancellationPrice, getContractUpdateConfig } from 'Stores/Modules/Contract/Helpers/logic';

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
        } = this.props;

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
        const { has_contract_update_take_profit, has_contract_update_stop_loss } = this.props;

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
            this.getStateToCompare(getContractUpdateConfig(this.props.contract_info)),
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
        const {
            addToast,
            removeToast,
            contract_update_take_profit,
            has_contract_update_take_profit,
            contract_update_stop_loss,
            has_contract_update_stop_loss,
            status,
        } = this.props;
        const { buy_price, currency, is_valid_to_cancel, bid_price, is_sold } = this.contract_info;
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
                addToast={addToast}
                removeToast={removeToast}
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

        const total_profit = bid_price - buy_price;

        return (
            <React.Fragment>
                <MobileWrapper>
                    <div className='positions-drawer-dialog__total-profit'>
                        <span>{localize('Total profit/loss:')}</span>
                        <div
                            className={classNames(
                                'positions-drawer-card__profit-loss positions-drawer-card__total-profit-loss-value',
                                {
                                    'positions-drawer-card__profit-loss--is-crypto': isCryptocurrency(currency),
                                    'positions-drawer-card__profit-loss--negative': total_profit < 0,
                                    'positions-drawer-card__profit-loss--positive': total_profit > 0,
                                }
                            )}
                        >
                            <Money amount={total_profit} currency={currency} />
                            <div
                                className={classNames('positions-drawer-card__indicative--movement', {
                                    'positions-drawer-card__indicative--movement-complete': is_sold,
                                })}
                            >
                                {status === 'profit' && <Icon icon='IcProfit' />}
                                {status === 'loss' && <Icon icon='IcLoss' />}
                            </div>
                        </div>
                    </div>
                </MobileWrapper>
                <div className='positions-drawer-dialog__form'>
                    <div className='positions-drawer-dialog__input'>{take_profit_input}</div>
                    <div className='positions-drawer-dialog__input'>{stop_loss_input}</div>
                    <div className='positions-drawer-dialog__button'>
                        <Button
                            text={localize('Apply')}
                            onClick={this.onClick}
                            primary
                            is_disabled={
                                this.has_validation_errors || !this.is_valid_contract_update || this.isStateUnchanged()
                            }
                        />
                    </div>
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

export default connect(({ modules, ui }, props) => {
    const contract = props.contract;
    return {
        addToast: ui.addToast,
        removeToast: ui.removeToast,
        getContractById: modules.contract_trade.getContractById,
        updateLimitOrder: modules.contract_trade.updateLimitOrder,
        contract_info: contract.contract_info,
        validation_errors: contract.validation_errors,
        contract_update_take_profit: contract.contract_update_take_profit,
        contract_update_stop_loss: contract.contract_update_stop_loss,
        has_contract_update_take_profit: contract.has_contract_update_take_profit,
        has_contract_update_stop_loss: contract.has_contract_update_stop_loss,
        status: modules.portfolio.positions_map[contract.contract_id]?.status,
    };
})(ContractUpdateForm);
