import React from 'react';
import { localize, Localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { Checkbox, Button, Input, FormSubmitButton, Modal, Icon, Money, Loading } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';

const initial_form = {
    otherFinancialPriorities: false,
    stopTrading: false,
    notIntrested: false,
    anotherTradingWebsite: false,
    notUserFriendly: false,
    isDifficult: false,
    lackFeaturesFunctionality: false,
    unsatisfactoryCs: false,
    otherReasons: false,
    otherTradingPlatforms: '',
    doToImprove: '',
};

const preparingReason = (values) => {
    const selected_reasons = selectedReasons(values)
        .map((val) => val[0])
        .toString();
    return `${selected_reasons}, ${values.otherTradingPlatforms}, ${values.doToImprove}`;
};

const selectedReasons = (values) => {
    return Object.entries(values).filter(
        ([key, value]) => !['otherTradingPlatforms', 'doToImprove'].includes(key) && value
    );
};

const WarningModal = (props) => {
    return (
        <div className='account-closure-warning-modal'>
            <Icon icon='IcRedWarning' size={96} />
            <p className='account-closure-warning-modal__warning-message'>{localize('Warning!')}</p>
            <span className='account-closure-warning-modal__content'>{localize('if you deactivate:')}</span>
            <div className='account-closure-warning-modal__content-wrapper'>
                <p className='account-closure-warning-modal__content'>
                    {localize('You’ll be logged out automatically.')}
                </p>
            </div>
            <div className='account-closure-warning-modal__content-wrapper'>
                <p className='account-closure-warning-modal__content'>
                    <Localize
                        i18n_default_text='You will <0>NOT</0> be able to log in again.'
                        components={[<span key={0} style={{ color: 'var(--text-loss-danger)', fontWeight: 'bold' }} />]}
                    />
                </p>
            </div>
            <FormSubmitButton
                is_disabled={false}
                label={localize('Deactivate')}
                has_cancel
                cancel_label={localize('Back')}
                onCancel={() => props.closeModal()}
                onClick={() => props.startDeactivating()}
            />
        </div>
    );
};
const getMT5AccountType = (group) => (group ? group.replace('\\', '_').replace(/_(\d+|master|EUR|GBP)/, '') : '');

const getMT5AccountDisplay = (group) => {
    if (!group) return {};

    const value = getMT5AccountType(group);
    let display_text = localize('MT5');
    if (/svg$/.test(value)) {
        display_text = localize('Synthetic');
    } else if (/vanuatu/.test(value) || /svg_(standard|financial)/.test(value)) {
        display_text = localize('Financial');
    } else if (/labuan/.test(value)) {
        display_text = localize('Financial STP');
    }

    return display_text;
};

const AccountHasBalanceOrOpenPositions = ({
    accounts_with_balance_or_open_positions,
    mt5_login_list,
    client_accounts,
    onBackClick,
}) => {
    const deriv_accounts_open_positions = [];
    const deriv_accounts_with_balance = [];
    const mt5_accounts_id = [];
    const mt5_accounts_with_balance_or_open_positions = [];

    accounts_with_balance_or_open_positions.hasOwnProperty('open_positions') &&
        Object.keys(accounts_with_balance_or_open_positions.open_positions).forEach((account_name) => {
            if (!accounts_with_balance_or_open_positions.open_positions[account_name].hasOwnProperty('total')) {
                // accounts without [total] are deriv accounts.
                const deriv_account_with_open_position = client_accounts.find(
                    (client_account) => client_account.loginid === account_name
                );
                deriv_account_with_open_position &&
                    deriv_accounts_open_positions.push(deriv_account_with_open_position);
            } else {
                // accounts with [total] are mt5 accounts.
                // const mt5_account_with_open_position = mt5_login_list.find((account_obj) => account_obj.login === account_name);
                // mt5_account_with_open_position && mt5_accounts_with_balance_or_open_positions.push(mt5_account_with_open_position);
                mt5_accounts_id.push(account_name);
            }
        });
    accounts_with_balance_or_open_positions.hasOwnProperty('balance') &&
        Object.keys(accounts_with_balance_or_open_positions.balance).forEach((account_name) => {
            const is_deriv_account = client_accounts.find((client_account) => client_account.loginid === account_name);
            if (is_deriv_account) {
                const deriv_account = accounts_with_balance_or_open_positions.balance[account_name];
                deriv_account.id = account_name;
                deriv_accounts_with_balance.push(deriv_account);
            } else {
                // const mt5_account_with_balance = mt5_login_list.find((account_obj) => account_obj.login === account_name);
                // mt5_account_with_balance && mt5_accounts_with_balance_or_open_positions.push(mt5_account_with_balance);
                mt5_accounts_id.push(account_name);
            }
        });
    [...new Set(mt5_accounts_id)].forEach((account_name) => {
        const mt5_account_with_balance = mt5_login_list.find((account_obj) => account_obj.login === account_name);
        mt5_account_with_balance && mt5_accounts_with_balance_or_open_positions.push(mt5_account_with_balance);
    });
    console.log({ mt5_accounts_with_balance_or_open_positions });
    return (
        <React.Fragment>
            <div className='have-open-positions-or-balance'>
                <p className='have-open-positions-or-balance__title'>
                    {localize('You have open positions in these Deriv accounts:')}
                </p>
                {deriv_accounts_open_positions.map((account) => (
                    <div key={account.loginid} className='have-open-positions-or-balance__accounts-wrapper'>
                        <Icon icon={`IcCurrency-${account.title.toLowerCase()}`} size={24} />
                        <div className='have-open-positions-or-balance__accounts-data'>
                            <span className='have-open-positions-or-balance__accounts-currency'>{account.title}</span>
                            <span className='have-open-positions-or-balance__accounts-loginid'>{account.loginid}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className='have-open-positions-or-balance'>
                <p className='have-open-positions-or-balance__title'>
                    {localize('You have funds in these Deriv accounts:')}
                </p>
                {deriv_accounts_with_balance.map((account) => (
                    <div key={account.id}>
                        {account.currency && (
                            <div className='have-open-positions-or-balance__container'>
                                <div className='have-open-positions-or-balance__account-details'>
                                    <div className='have-open-positions-or-balance__account-details__icon'>
                                        <Icon icon={`IcCurrency-${account.currency.toLowerCase()}`} size={24} />
                                    </div>
                                    <div className='have-open-positions-or-balance__balance'>
                                        <span className='have-open-positions-or-balance__balance--currency'>
                                            {account.currency}
                                        </span>
                                        <span className='have-open-positions-or-balance__balance--id'>
                                            {account.id}
                                        </span>
                                    </div>
                                </div>
                                <div className='have-open-positions-or-balance__money'>
                                    <Money
                                        currency={account.currency}
                                        amount={CurrencyUtils.formatMoney(account.currency, account.balance, true)}
                                        should_format={false}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='have-open-positions-or-balance'>
                <p className='have-open-positions-or-balance__action'>
                    {localize('You have funds in these Deriv accounts:')}
                </p>
                {mt5_accounts_with_balance_or_open_positions.map((account) => (
                    <div key={account.login} className='have-open-positions-or-balance__container'>
                        <div className='have-open-positions-or-balance__account-details'>
                            <div className='have-open-positions-or-balance__container__account-details__icon'>
                                <Icon icon={`IcMt5-${getMT5AccountDisplay(account.group)}`} size={24} />
                            </div>
                            <div className='have-open-positions-or-balance__balance'>
                                <span className='have-open-positions-or-balance__balance--currency'>
                                    {getMT5AccountDisplay(account.group)}
                                </span>
                                <span className='have-open-positions-or-balance__balance--id'>{account.login}</span>
                            </div>
                        </div>
                        <div className='have-open-positions-or-balance__money'>
                            <Money
                                currency={account.currency}
                                amount={CurrencyUtils.formatMoney(account.currency, account.balance, true)}
                                should_format={false}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <Button className='have-open-positions-or-balance__button' primary onClick={() => onBackClick()}>
                {localize('OK')}
            </Button>
        </React.Fragment>
    );
};
class DeactivateAccountReason extends React.Component {
    state = {
        is_loading: false,
        is_modal_open: false,
        reason: null,
        accounts: undefined,
        which_modal_should_render: undefined,
        is_checkbox_disabled: false,
        total_checkbox_checked: 0,
        remaining_characters: undefined,
    };
    validateFields = (values) => {
        const error = {};
        const selected_reason_count = selectedReasons(values).length;
        if (!selected_reason_count) {
            error.empty_reason = 'please select at least one reason';
        }
        if ((values.otherTradingPlatforms + values.doToImprove).length > 0) {
            const max_characters = 250;
            const selected_reasons = selectedReasons(values)
                .map((val) => val[0])
                .toString();
            const max_characters_can_use = max_characters - selected_reasons.length;
            // The nuumber 4 subtraction is for two commas and two spaces on the final result
            const remaining_characters =
                max_characters_can_use - values.otherTradingPlatforms.length - values.doToImprove.length - 4;
            if (remaining_characters >= 0) {
                this.setState({ remaining_characters });
            } else {
                this.setState({ remaining_characters: undefined });
            }
            const final_value = `${selected_reasons}, ${values.otherTradingPlatforms}, ${values.doToImprove}`;
            const regex_rule = `^[0-9A-Za-z .,'-]{0,${max_characters}}$`;
            if (!new RegExp(regex_rule).test(final_value)) {
                error.characters_limits = `please insert up to ${max_characters_can_use} characters combine both fields.`;
            }
        }
        return error;
    };
    handleSubmitForm = (values) => {
        const final_reason = preparingReason(values);
        this.setState({
            is_modal_open: true,
            which_modal_should_render: 'warning_modal',
            reason: final_reason,
        });
    };

    handleChangeCheckbox = (values, name, setFieldValue) => {
        if (!values[name]) {
            this.setState({ total_checkbox_checked: this.state.total_checkbox_checked + 1 }, () => {
                setFieldValue(name, !values[name]);
                if (this.state.total_checkbox_checked === 3) this.setState({ is_checkbox_disabled: true });
            });
        } else {
            this.setState({ total_checkbox_checked: this.state.total_checkbox_checked - 1 }, () => {
                setFieldValue(name, !values[name]);
                if (this.state.is_checkbox_disabled) this.setState({ is_checkbox_disabled: false });
            });
        }
    };

    closeModal = () => {
        this.setState({ is_modal_open: false });
    };

    startDeactivating = async () => {
        this.closeModal();
        this.setState({ is_loading: true });
        const account_closure_response = await WS.authorized.accountClosure({
            account_closure: 1,
            reason: this.state.reason,
        });
        this.setState({ is_loading: false });
        console.log(account_closure_response);
        if (account_closure_response.account_closure === 1) {
            window.location.href = '/account-deactivated';
            return;
        } else {
            this.setState({
                which_modal_should_render: account_closure_response.error.code,
                accounts: account_closure_response.error.details,
                is_modal_open: true,
            });
        }
    };
    render() {
        return this.state.is_loading ? (
            <Loading is_fullscreen={false} />
        ) : (
            <div className='deactivate-account-reasons'>
                <p className='deactivate-account-reasons__title'>
                    {localize('Please tell us why you’re leaving. (Select up to 3 reasons.)')}
                </p>
                <Formik initialValues={initial_form} validate={this.validateFields} onSubmit={this.handleSubmitForm}>
                    {({ values, setFieldValue, errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Field name='otherFinancialPriorities'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I have other financial priorities.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='stopTrading'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I want to stop myself from trading.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='notIntrested'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I’m no longer interested in trading.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='anotherTradingWebsite'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I prefer another trading website.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='notUserFriendly'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('The platforms aren’t user-friendly.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='isDifficult'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('Making deposits and withdrawals is difficult.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='lackFeaturesFunctionality'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('The platforms lack key features or functionality.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='unsatisfactoryCs'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('Customer service was unsatisfactory.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='otherReasons'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I’m deactivating my account for other reasons.')}
                                        onChange={() => this.handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='otherTradingPlatforms'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='deactivate-account-reasons__input'
                                        data-lpignore='true'
                                        autoComplete='off' // prevent chrome autocomplete
                                        type='textarea'
                                        placeholder='If you don’t mind sharing, which other trading platforms do you use?'
                                        name='otherTradingPlatforms'
                                        value={values.otherTradingPlatforms}
                                        onChange={handleChange}
                                    />
                                )}
                            </Field>
                            <Field name='doToImprove'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='deactivate-account-reasons__input'
                                        data-lpignore='true'
                                        autoComplete='off' // prevent chrome autocomplete
                                        type='textarea'
                                        placeholder='What could we do to improve?'
                                        name='doToImprove'
                                        value={values.doToImprove}
                                        onChange={handleChange}
                                    />
                                )}
                            </Field>
                            {this.state.remaining_characters >= 0 && (
                                <p>{`Remaining characters: ${this.state.remaining_characters}`}</p>
                            )}
                            {Object.keys(errors).length > 0 &&
                                Object.entries(errors).map(([key, value]) => (
                                    <p className='deactivate-account-reasons__error' key={key}>
                                        {value}
                                    </p>
                                ))}
                            {errors.characters_limits && (
                                <p className='deactivate-account-reasons__error'>
                                    {localize("Must be numbers, letters, and special characters . , ' -")}
                                </p>
                            )}
                            <FormSubmitButton
                                is_disabled={
                                    // eslint-disable-next-line no-unused-vars
                                    Object.keys(errors).length > 0
                                }
                                label={localize('Continue')}
                                has_cancel
                                cancel_label={localize('Back')}
                                onCancel={() => this.props.onBackClick()}
                            />
                        </form>
                    )}
                </Formik>
                <Modal
                    className='deactivate-account-reasons'
                    is_open={this.state.is_modal_open}
                    toggleModal={() => this.setState({ is_modal_open: !this.state.is_modal_open })}
                    title={
                        this.state.which_modal_should_render !== 'warning_modal'
                            ? localize('Action required')
                            : undefined
                    }
                >
                    {this.state.which_modal_should_render === 'warning_modal' && (
                        <WarningModal closeModal={this.closeModal} startDeactivating={this.startDeactivating} />
                    )}
                    {this.state.which_modal_should_render === 'AccountHasBalanceOrOpenPositions' && (
                        <AccountHasBalanceOrOpenPositions
                            accounts_with_balance_or_open_positions={this.state.accounts}
                            mt5_login_list={this.props.mt5_login_list}
                            client_accounts={this.props.client_accounts}
                            onBackClick={this.props.onBackClick}
                        />
                    )}
                </Modal>
            </div>
        );
    }
}

export default connect(({ client }) => ({
    client_accounts: client.account_list,
    mt5_login_list: client.mt5_login_list,
}))(DeactivateAccountReason);
