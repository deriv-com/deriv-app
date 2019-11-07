import React             from 'react';
import PropTypes         from 'prop-types';
import { Button }        from 'deriv-components';
import InputWithCheckbox from 'App/Components/Form/InputField/input-with-checkbox.jsx';
import { localize }      from 'App/i18n';

const ContractUpdateForm = ({
    contract_id,
    currency,
    has_stop_loss,
    has_take_profit,
    onClickContractUpdate,
    onChangeContractUpdate,
    stop_loss,
    take_profit,
    validation_errors,
}) => {
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

        onChangeContractUpdate(contract_id, limit_order);
    };
    
    const is_disabled = !((has_stop_loss && stop_loss > 0) || (has_take_profit && take_profit > 0));

    const {
        contract_update_stop_loss  : stop_loss_error_messages,
        contract_update_take_profit: take_profit_error_messages,
    } = validation_errors;

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
                    onClick={() => onClickContractUpdate(contract_id)}
                    primary
                    is_disabled={is_disabled}
                />
            </div>
        </React.Fragment>
    );
};

ContractUpdateForm.PropTypes = {
    currency              : PropTypes.string,
    contract_id           : PropTypes.string,
    has_stop_loss         : PropTypes.bool,
    has_take_profit       : PropTypes.bool,
    stop_loss             : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    take_profit           : PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChangeContractUpdate: PropTypes.func,
    onClickContractUpdate : PropTypes.func,
    validation_errors     : PropTypes.object,
};

export default ContractUpdateForm;
