import React             from 'react';
import PropTypes         from 'prop-types';
import { Button }        from 'deriv-components';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { localize }      from 'deriv-translations';
import { connect }       from 'Stores/connect';

class ContractUpdateForm extends React.Component {
    componentWillUnmount() {
        this.props.resetContractUpdate(this.props.contract_id);
    }

    render() {
        const {
            currency,
            has_stop_loss,
            has_take_profit,
            onClickContractUpdate,
            onChangeContractUpdate,
            stop_loss,
            take_profit,
        } = this.props.getContractById(this.props.contract_id).contract_update;

        const onChange = (e) => {
            const { name, value } = e.target;

            const limit_order = {};
            if (name === 'contract_update_take_profit') {
                limit_order.take_profit = value;
            }
            if (name === 'contract_update_stop_loss') {
                limit_order.stop_loss = value;
            }
            if (name === 'has_contract_update_take_profit') {
                limit_order.has_take_profit = value;
            }
            if (name === 'has_contract_update_stop_loss') {
                limit_order.has_stop_loss = value;
            }

            if (onChangeContractUpdate) {
                onChangeContractUpdate(limit_order, this.props.contract_id);
            }
        };

        const onClick = () => {
            onClickContractUpdate(this.props.contract_id);
            this.props.toggleDialog();
        };

        const {
            contract_update_stop_loss  : stop_loss_error_messages,
            contract_update_take_profit: take_profit_error_messages,
        } = this.props.validation_errors;

        const has_error = ((has_stop_loss && stop_loss_error_messages && stop_loss_error_messages.length)
            || (has_take_profit && take_profit_error_messages && take_profit_error_messages.length)
        );

        return (
            <React.Fragment>
                <div className='positions-drawer-dialog__input'>
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
                    />
                </div>
                <div className='positions-drawer-dialog__input'>
                    <InputWithCheckbox
                        classNameInlinePrefix='trade-container__currency'
                        currency={currency}
                        defaultChecked={has_stop_loss}
                        error_messages={has_stop_loss ? stop_loss_error_messages : undefined}
                        is_single_currency={true}
                        is_negative_disabled={true}
                        label={localize('Stop loss')}
                        name='contract_update_stop_loss'
                        onChange={onChange}
                        value={stop_loss}
                    />
                </div>
                <div className='positions-drawer-dialog__button'>
                    <Button
                        text={localize('Apply')}
                        onClick={onClick}
                        primary
                        is_disabled={has_error || !this.props.isValidContractUpdate(this.props.contract_id)}
                    />
                </div>
            </React.Fragment>
        );
    }
}

ContractUpdateForm.propTypes = {
    contract_id          : PropTypes.number,
    getContractById      : PropTypes.func,
    isValidContractUpdate: PropTypes.func,
    resetContractUpdate  : PropTypes.func,
    toggleDialog         : PropTypes.func,
    validation_errors    : PropTypes.object,
};

export default connect(
    ({ modules }) => ({
        getContractById      : modules.contract_replay.getContractById,
        isValidContractUpdate: modules.contract_replay.isValidContractUpdate,
        resetContractUpdate  : modules.contract_replay.resetContractUpdate,
        validation_errors    : modules.contract_trade.validation_errors,
    })
)(ContractUpdateForm);
