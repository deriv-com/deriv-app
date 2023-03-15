import { AMOUNT_MAX_LENGTH, addComma, getDecimalPlaces } from '@deriv/shared';
import { ButtonToggle, Dropdown, InputField, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

import AllowEquals from './allow-equals.jsx';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import Multiplier from './Multiplier/multiplier.jsx';
import MultipliersInfo from './Multiplier/info.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { connect } from 'Stores/connect';

export const Input = ({
    amount,
    currency,
    current_focus,
    error_messages,
    is_nativepicker,
    is_single_currency,
    onChange,
    setCurrentFocus,
}) => (
    <InputField
        className='trade-container__amount'
        classNameInlinePrefix='trade-container__currency'
        classNameInput='trade-container__input'
        currency={currency}
        current_focus={current_focus}
        error_messages={error_messages}
        fractional_digits={getDecimalPlaces(currency)}
        id='dt_amount_input'
        inline_prefix={is_single_currency ? currency : null}
        is_autocomplete_disabled
        is_float
        is_hj_whitelisted
        is_incrementable
        is_nativepicker={is_nativepicker}
        is_negative_disabled
        max_length={AMOUNT_MAX_LENGTH}
        name='amount'
        onChange={onChange}
        type='tel'
        value={amount}
        ariaLabel={localize('Amount')}
        setCurrentFocus={setCurrentFocus}
    />
);

const Amount = ({
    amount,
    basis,
    basis_list,
    contract_start_type,
    contract_type,
    contract_types_list,
    currencies_list,
    currency,
    current_focus,
    duration_unit,
    expiry_type,
    is_accumulator,
    is_equal,
    is_minimized,
    is_multiplier,
    is_nativepicker,
    is_single_currency,
    has_equals_only,
    onChange,
    setCurrentFocus,
    validation_errors,
    stake_boundary,
    vanilla_trade_type,
}) => {
    if (is_minimized) {
        return (
            <div className='fieldset-minimized fieldset-minimized__amount'>
                <span className='fieldset-minimized__basis'>
                    {(basis_list.find(o => o.value === basis) || {}).text}
                </span>
                &nbsp;
                <i>
                    <span
                        className={classNames('fieldset-minimized__currency', 'symbols', {
                            [`symbols--${(currency || '').toLowerCase()}`]: currency,
                        })}
                    />
                </i>
                {addComma(amount, 2)}
            </div>
        );
    }

    const error_messages = validation_errors.amount;

    const getBasisList = () => basis_list.map(item => ({ text: item.text, value: item.value }));

    const setTooltipContent = () => {
        if (is_multiplier) {
            return (
                <Localize i18n_default_text='Your gross profit is the percentage change in market price times your stake and the multiplier chosen here.' />
            );
        } else if (contract_type === 'vanilla') {
            return (
                <Localize i18n_default_text='Your stake is a non-refundable one-time premium to purchase this contract. Your total profit/loss equals the contract value minus your stake.' />
            );
        }
        return null;
    };

    return (
        <Fieldset
            className='trade-container__fieldset center-text'
            header={
                is_multiplier || ['high_low', 'vanilla'].includes(contract_type) || is_accumulator
                    ? localize('Stake')
                    : undefined
            }
            header_tooltip={setTooltipContent()}
        >
            {basis_list.length > 1 && (
                <ButtonToggle
                    id='dt_amount_toggle'
                    buttons_arr={getBasisList()}
                    className='dropdown--no-margin'
                    is_animated
                    name='basis'
                    onChange={onChange}
                    value={basis}
                />
            )}
            {!is_single_currency ? (
                <div className='trade-container__currency-options'>
                    <Input
                        amount={amount}
                        currency={currency}
                        current_focus={current_focus}
                        error_messages={error_messages}
                        is_single_currency={is_single_currency}
                        is_nativepicker={is_nativepicker}
                        onChange={onChange}
                        setCurrentFocus={setCurrentFocus}
                    />
                    <Dropdown
                        id='amount'
                        className={classNames({ 'dc-dropdown-container__currency': !is_single_currency })}
                        is_alignment_left
                        is_nativepicker={false}
                        list={currencies_list}
                        name='currency'
                        initial_offset={256}
                        no_border={true}
                        value={currency}
                        onChange={onChange}
                    />
                </div>
            ) : (
                <Input
                    amount={amount}
                    currency={currency}
                    current_focus={current_focus}
                    error_messages={error_messages}
                    is_single_currency={is_single_currency}
                    is_nativepicker={is_nativepicker}
                    onChange={onChange}
                    setCurrentFocus={setCurrentFocus}
                />
            )}
            <AllowEquals
                contract_start_type={contract_start_type}
                contract_type={contract_type}
                contract_types_list={contract_types_list}
                duration_unit={duration_unit}
                expiry_type={expiry_type}
                onChange={onChange}
                value={parseInt(is_equal)}
                has_equals_only={has_equals_only}
            />
            {is_multiplier && (
                <React.Fragment>
                    <Multiplier />
                    <MultipliersInfo
                        className='trade-container__multipliers-trade-info'
                        should_show_tooltip
                        is_tooltip_relative
                    />
                </React.Fragment>
            )}
            {contract_type === 'vanilla' && (
                <section className='trade-container__stake-field'>
                    <div className='trade-container__stake-field--min'>
                        <Text size='xxxs'>{localize('Min. stake')}</Text>
                        <Text size='xxs'>
                            {stake_boundary[vanilla_trade_type].min_stake} {currency}
                        </Text>
                    </div>
                    <div className='trade-container__stake-field--max'>
                        <Text size='xxxs'>{localize('Max. stake')}</Text>
                        <Text size='xxs'>
                            {stake_boundary[vanilla_trade_type].max_stake} {currency}
                        </Text>
                    </div>
                </section>
            )}
        </Fieldset>
    );
};

Amount.propTypes = {
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    basis: PropTypes.string,
    basis_list: MobxPropTypes.arrayOrObservableArray,
    contract_start_type: PropTypes.string,
    contract_type: PropTypes.string,
    contract_types_list: MobxPropTypes.observableObject,
    currencies_list: MobxPropTypes.observableObject,
    currency: PropTypes.string,
    current_focus: PropTypes.string,
    duration_unit: PropTypes.string,
    expiry_type: PropTypes.string,
    is_accumulator: PropTypes.bool,
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    is_minimized: PropTypes.bool,
    is_multiplier: PropTypes.bool,
    is_nativepicker: PropTypes.bool,
    is_single_currency: PropTypes.bool,
    has_equals_only: PropTypes.bool,
    setCurrentFocus: PropTypes.func,
    onChange: PropTypes.func,
    validation_errors: PropTypes.object,
    stake_boundary: PropTypes.object,
    vanilla_trade_type: PropTypes.object,
};

export default connect(({ modules, client, ui }) => ({
    amount: modules.trade.amount,
    basis: modules.trade.basis,
    basis_list: modules.trade.basis_list,
    contract_start_type: modules.trade.contract_start_type,
    contract_type: modules.trade.contract_type,
    contract_types_list: modules.trade.contract_types_list,
    currencies_list: client.currencies_list,
    currency: modules.trade.currency,
    current_focus: ui.current_focus,
    duration_unit: modules.trade.duration_unit,
    expiry_type: modules.trade.expiry_type,
    is_accumulator: modules.trade.is_accumulator,
    is_equal: modules.trade.is_equal,
    is_single_currency: client.is_single_currency,
    is_multiplier: modules.trade.is_multiplier,
    has_equals_only: modules.trade.has_equals_only,
    stop_out: modules.trade.stop_out,
    onChange: modules.trade.onChange,
    setCurrentFocus: ui.setCurrentFocus,
    vanilla_trade_type: ui.vanilla_trade_type,
    validation_errors: modules.trade.validation_errors,
    stake_boundary: modules.trade.stake_boundary,
}))(Amount);
