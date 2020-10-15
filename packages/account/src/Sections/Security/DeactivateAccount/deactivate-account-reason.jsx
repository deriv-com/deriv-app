import React from 'react';
import { Redirect } from 'react-router-dom';
import { routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { Checkbox, Input, FormSubmitButton, Modal, Icon, Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import { WS } from 'Services/ws-methods';
import AccountHasBalanceOrOpenPositions from './account-has-balance.jsx';

const initial_form = {
    'I have other financial priorities': false,
    'I want to stop myself from trading': false,
    "I'm no longer interested in trading": false,
    'I prefer another trading website': false,
    "The platforms aren't user-friendly": false,
    'Making deposits and withdrawals is difficult': false,
    'The platforms lack key features or functionality': false,
    'Customer service was unsatisfactory': false,
    "I'm deactivating my account for other reasons": false,
    otherTradingPlatforms: '',
    doToImprove: '',
};

const preparingReason = values => {
    let selected_reasons = selectedReasons(values)
        .map(val => val[0])
        .toString();
    const is_other_trading_platform__has_value = !!values.otherTradingPlatforms.length;
    const is_to_do_improve_has_value = !!values.doToImprove.length;
    if (is_other_trading_platform__has_value) {
        selected_reasons = `${selected_reasons}, ${values.otherTradingPlatforms}`;
    }
    if (is_to_do_improve_has_value) {
        selected_reasons = `${selected_reasons}, ${values.doToImprove}`;
    }
    return selected_reasons;
};

const selectedReasons = values => {
    return Object.entries(values).filter(
        ([key, value]) => !['otherTradingPlatforms', 'doToImprove'].includes(key) && value
    );
};

const WarningModal = props => {
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

class DeactivateAccountReason extends React.Component {
    state = {
        is_loading: false,
        is_account_deactivated: false,
        is_modal_open: false,
        reason: null,
        details: undefined,
        which_modal_should_render: undefined,
        is_checkbox_disabled: false,
        total_checkbox_checked: 0,
        remaining_characters: undefined,
    };
    validateFields = values => {
        const error = {};
        const selected_reason_count = selectedReasons(values).length;
        if (!selected_reason_count) {
            error.empty_reason = localize('please select at least one reason');
        }
        if ((values.otherTradingPlatforms + values.doToImprove).length > 0) {
            const max_characters = 250;
            const final_value = preparingReason(values);
            const selected_reasons = selectedReasons(values)
                .map(val => val[0])
                .toString();
            const is_other_trading_platform__has_value = !!values.otherTradingPlatforms.length;
            const is_to_do_improve_has_value = !!values.doToImprove.length;
            let max_input_characters_can_use = max_characters - selected_reasons.length;
            // by adding new fields, we are adding 2 more characters to the final value
            if (is_other_trading_platform__has_value) {
                max_input_characters_can_use -= 2;
            }
            if (is_to_do_improve_has_value) {
                max_input_characters_can_use -= 2;
            }
            const remaining_characters = max_characters - final_value.length;
            if (remaining_characters >= 0) {
                this.setState({ remaining_characters });
            } else {
                this.setState({ remaining_characters: undefined });
            }
            const regex_rule = `^[0-9A-Za-z .,'-]{0,${max_characters}}$`;
            if (!new RegExp(regex_rule).test(final_value)) {
                error.characters_limits = `please insert up to ${max_input_characters_can_use} characters combine both fields.`;
            }
        }
        return error;
    };
    handleSubmitForm = values => {
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
        if (account_closure_response.account_closure === 1) {
            this.setState({ is_account_deactivated: true });
        } else {
            this.setState({
                which_modal_should_render: account_closure_response.error.code,
                details: account_closure_response.error.details,
                is_modal_open: true,
            });
        }
    };
    render() {
        if (this.state.is_account_deactivated) return <Redirect to={routes.account_deactivated} />;
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
                            <Field name='I have other financial priorities'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I have other financial priorities.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name='I want to stop myself from trading'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I want to stop myself from trading.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name="I'm no longer interested in trading">
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I’m no longer interested in trading.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name='I prefer another trading website'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I prefer another trading website.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name="The platforms aren't user-friendly">
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('The platforms aren’t user-friendly.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name='Making deposits and withdrawals is difficult'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('Making deposits and withdrawals is difficult.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name='The platforms lack key features or functionality'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('The platforms lack key features or functionality.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name='Customer service was unsatisfactory'>
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('Customer service was unsatisfactory.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
                                    />
                                )}
                            </Field>
                            <Field name="I'm deactivating my account for other reasons">
                                {({ field }) => (
                                    <Checkbox
                                        disabled={this.state.is_checkbox_disabled && !values[field.name]}
                                        className='deactivate-account-reasons__checkbox'
                                        {...field}
                                        label={localize('I’m deactivating my account for other reasons.')}
                                        onChange={() => {
                                            this.handleChangeCheckbox(values, field.name, setFieldValue);
                                        }}
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
                                        placeholder={localize(
                                            'If you don’t mind sharing, which other trading platforms do you use?'
                                        )}
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
                                        placeholder={localize('What could we do to improve?')}
                                        name='doToImprove'
                                        value={values.doToImprove}
                                        onChange={handleChange}
                                    />
                                )}
                            </Field>
                            {this.state.remaining_characters >= 0 && (
                                <p>
                                    {localize('Remaining characters: {{remaining_characters}}', {
                                        remaining_characters: this.state.remaining_characters,
                                    })}
                                </p>
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
                            details={this.state.details}
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
