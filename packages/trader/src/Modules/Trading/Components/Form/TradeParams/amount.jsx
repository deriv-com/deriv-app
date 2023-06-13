import { AMOUNT_MAX_LENGTH, addComma, getDecimalPlaces } from '@deriv/shared';
import { ButtonToggle, Dropdown, InputField, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

import AllowEquals from './allow-equals.jsx';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import Multiplier from './Multiplier/multiplier.jsx';
import MultipliersInfo from './Multiplier/info.jsx';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

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

const Amount = observer(({ is_minimized, is_nativepicker }) => {
    const { ui, client } = useStore();
    const { currencies_list, is_single_currency } = client;
    const { setCurrentFocus, vanilla_trade_type, current_focus } = ui;
    const {
        amount,
        basis,
        basis_list,
        contract_start_type,
        contract_type,
        contract_types_list,
        currency,
        duration_unit,
        expiry_type,
        is_accumulator,
        is_equal,
        is_multiplier,
        has_equals_only,
        onChange,
        validation_errors,
        stake_boundary,
    } = useTraderStore();

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
});

Amount.propTypes = {
    is_minimized: PropTypes.bool,
    is_nativepicker: PropTypes.bool,
};

export default Amount;
