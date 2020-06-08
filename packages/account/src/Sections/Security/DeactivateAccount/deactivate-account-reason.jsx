import React from 'react';
import { WS } from 'Services/ws-methods';
import { localize, Localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { Checkbox, Button, Input, FormSubmitButton, Modal, Icon, Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { object } from 'prop-types';

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

const validateFields = (values) => {
    const error = {};
    const selected_reason_count = selectedReasons(values).length;
    if (selected_reason_count === 0 && values.otherTradingPlatforms.length === 0 && values.doToImprove.length === 0) {
        error.empty_reason = 'please select at least one reason or share your opinion';
    } else {
        if (selected_reason_count > 0 && (values.otherTradingPlatforms + values.doToImprove).length === 0) {
            return error;
        } else if ((values.otherTradingPlatforms + values.doToImprove).length > 0) {
            const max_letter = 250;
            const selected_reasons = selectedReasons(values)
                .map((val) => val[0])
                .toString();
            const max_letter_can_use = max_letter - selected_reasons.length;
            const final_value = `${selected_reasons}, ${values.otherTradingPlatforms}, ${values.doToImprove}`;
            const regex_rule = `^[0-9A-Za-z .,'-]{9,${max_letter}}$`;
            if (!new RegExp(regex_rule).test(final_value)) {
                error.letter_limits = `please insert between 5-${max_letter_can_use} characters combine both fields.`;
            }
        }
    }
    return error;
};

const assertTotalCheckedItems = (should_check_for_limit, values) => {
    return !should_check_for_limit && selectedReasons(values).length === 3;
};

const handleChangeCheckbox = (values, name, setFieldValue) => {
    if (assertTotalCheckedItems(values[name], values)) {
        alert('please select up to 3');
    } else {
        setFieldValue(name, !values[name]);
    }
};
const WarningModal = (props) => {
    return (
        <div className='account-closure-warning-modal'>
            <Icon icon='IcRedWarning' size={96} />
            <p className='account-closure-warning-modal__warning-message'>{localize('Warning!')}</p>
            <span className='account-closure-warning-modal__content'>{localize('if you deactivate:')}</span>
            <div className='account-closure-warning-modal__content-wrapper'>
                <Icon icon='IcRedWarning' className='account-closure-warning-modal__warning-icon' size={16} />
                <p className='account-closure-warning-modal__content'>
                    {localize('You’ll be logged out automatically.')}
                </p>
            </div>
            <div className='account-closure-warning-modal__content-wrapper'>
                <Icon icon='IcRedWarning' className='account-closure-warning-modal__warning-icon' size={16} />
                <p className='account-closure-warning-modal__content'>
                    <Localize
                        i18n_default_text='You will NOT be able to log in again.'
                        components={[<span key={0} className='' />]}
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
const HaveOpenPositions = (accounts_with_open_positions_id, client_accounts, onBackClick) => {
    const accounts_with_open_positions = Object.keys(accounts_with_open_positions_id).map((open_position_id) =>
        client_accounts.filter((account) => account.loginid === open_position_id)
    );

    return (
        <div className='have-open-positions'>
            <p className='have-open-positions__title'>{localize('You have open positions in these Deriv accounts:')}</p>
            {accounts_with_open_positions.map((account) => (
                <div key={account[0].loginid} className='have-open-positions__accounts-wrapper'>
                    <Icon icon={`IcCurrency-${account[0].title.toLowerCase()}`} size={24} />
                    <div className='have-open-positions__accounts-data'>
                        <span className='have-open-positions__accounts-currency'>{account[0].title}</span>
                        <span className='have-open-positions__accounts-loginid'>{account[0].loginid}</span>
                    </div>
                </div>
            ))}
            <Button className='have-open-positions__accounts-button' primary onClick={() => onBackClick()}>
                {localize('OK')}
            </Button>
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
    } else if (/vanuatu/.test(value) || /svg_standard/.test(value)) {
        display_text = localize('Financial');
    } else if (/labuan/.test(value)) {
        display_text = localize('Financial STP');
    }

    return display_text;
};

const ExistingAccountHasBalance = (accounts_with_balance, client_accounts, mt5_login_list, onBackClick) => {
    const mt5_with_balance_id = Object.keys(accounts_with_balance).filter(
        (account_id) => !accounts_with_balance[account_id].currency
    );
    // ADD MT5 ACCOUNT ********************************************
    return (
        <div>
            {Object.keys(accounts_with_balance).map((account_id) => (
                <div key={account_id}>
                    {accounts_with_balance[account_id].currency ? (
                        <div>
                            <div>
                                <Icon
                                    icon={`IcCurrency-${accounts_with_balance[account_id].currency.toLowerCase()}`}
                                    size={24}
                                />
                                <div>
                                    <p>{accounts_with_balance[account_id].currency}</p>
                                    <p>{account_id}</p>
                                </div>
                            </div>
                            <div>
                                <Money
                                    currency={accounts_with_balance[account_id].currency}
                                    amount={CurrencyUtils.formatMoney(
                                        accounts_with_balance[account_id].currency,
                                        accounts_with_balance[account_id].balance,
                                        true
                                    )}
                                    should_format={false}
                                />
                            </div>
                        </div>
                    ) : (
                        mt5_with_balance_id.map()
                    )}
                </div>
            ))}
        </div>
    );
};
class DeactivateAccountReason extends React.Component {
    state = {
        is_modal_open: false,
        reason: null,
        accounts: undefined,
        which_modal_should_render: undefined,
    };

    handleSubmitForm = (values) => {
        const final_reason = preparingReason(values);
        this.setState({
            is_modal_open: true,
            which_modal_should_render: 'warning_modal',
            reason: final_reason,
        });
    };

    closeModal = () => {
        this.setState({ is_modal_open: false });
    };

    startDeactivating = () => {
        this.closeModal();
        WS.send({
            account_closure: 1,
            reason: this.state.reason,
        })
            .then((res) => {
                console.log(res.error);
                this.setState({
                    which_modal_should_render: res.error.code,
                    accounts: res.error.details.accounts,
                    is_modal_open: true,
                });
            })
            .catch((err) => console.log(err));
    };

    render() {
        return (
            <div className='deactivate-account-reasons'>
                <p className='deactivate-account-reasons__title'>
                    {localize('Please tell us why you’re leaving. (Select up to 3 reasons.)')}
                </p>
                <Formik initialValues={initial_form} validate={validateFields} onSubmit={this.handleSubmitForm}>
                    {({ values, setFieldValue, errors, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Field name='otherFinancialPriorities'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('I have other financial priorities.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='stopTrading'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('I want to stop myself from trading.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='notIntrested'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('I’m no longer interested in trading.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='anotherTradingWebsite'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('I prefer another trading website.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='notUserFriendly'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('The platforms aren’t user-friendly.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='isDifficult'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('Making deposits and withdrawals is difficult.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='lackFeaturesFunctionality'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('The platforms lack key features or functionality.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='unsatisfactoryCs'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('Customer service was unsatisfactory.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='otherReasons'>
                                {({ field }) => (
                                    <Checkbox
                                        {...field}
                                        label={localize('I’m deactivating my account for other reasons.')}
                                        onChange={() => handleChangeCheckbox(values, field.name, setFieldValue)}
                                    />
                                )}
                            </Field>
                            <Field name='otherTradingPlatforms'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        data-lpignore='true'
                                        autoComplete='off' // prevent chrome autocomplete
                                        type='text'
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
                                        data-lpignore='true'
                                        autoComplete='off' // prevent chrome autocomplete
                                        type='text'
                                        placeholder='What could we do to improve?'
                                        name='doToImprove'
                                        value={values.doToImprove}
                                        onChange={handleChange}
                                    />
                                )}
                            </Field>
                            {Object.keys(errors).length > 0 &&
                                Object.entries(errors).map(([key, value]) => <p key={key}>{value}</p>)}
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
                    {this.state.which_modal_should_render === 'AccountHasOpenPositions' &&
                        HaveOpenPositions(this.state.accounts, this.props.client_accounts, this.props.onBackClick)}
                    {this.state.which_modal_should_render === 'ExistingAccountHasBalance' &&
                        ExistingAccountHasBalance(
                            this.state.accounts,
                            this.props.client_accounts,
                            this.props.mt5_login_list,
                            this.props.onBackClick
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
