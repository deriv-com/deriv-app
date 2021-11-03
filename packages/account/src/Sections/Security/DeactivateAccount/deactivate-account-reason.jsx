import React from 'react';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { routes, PlatformContext, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { Formik, Field } from 'formik';
import { Checkbox, Input, FormSubmitButton, Modal, Icon, Loading, Text, Button } from '@deriv/components';
import { connect } from 'Stores/connect';
import AccountHasPendingConditions from './account-has-balance.jsx';

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
    other_trading_platforms: '',
    do_to_improve: '',
};

const preparingReason = values => {
    let selected_reasons = selectedReasons(values)
        .map(val => val[0])
        .toString();
    const is_other_trading_platform__has_value = !!values.other_trading_platforms.length;
    const is_to_do_improve_has_value = !!values.do_to_improve.length;
    if (is_other_trading_platform__has_value) {
        selected_reasons = `${selected_reasons}, ${values.other_trading_platforms}`;
    }
    if (is_to_do_improve_has_value) {
        selected_reasons = `${selected_reasons}, ${values.do_to_improve}`;
    }

    return selected_reasons.replace(/(\r\n|\n|\r)/gm, ' ');
};

const selectedReasons = values => {
    return Object.entries(values).filter(
        ([key, value]) => !['other_trading_platforms', 'do_to_improve'].includes(key) && value
    );
};

const WarningModal = props => {
    return (
        <div className='account-closure-warning-modal'>
            <Icon icon='IcRedWarning' size={96} />
            <Text as='p' weight='bold' color='loss-danger' className='account-closure-warning-modal__warning-message'>
                {localize('Warning!')}
            </Text>
            <Text size='xs' line_height='x' weight='bold'>
                {localize('Deactivate account?')}
            </Text>
            <div className='account-closure-warning-modal__content-wrapper'>
                <Text as='p' align='center' className='account-closure-warning-modal__content'>
                    {localize(
                        'Deactivating your account will automatically log you out. You can reactivate your account by logging in at any time.'
                    )}
                </Text>
            </div>
            <FormSubmitButton
                is_disabled={false}
                label={localize('Deactivate')}
                has_cancel
                cancel_label={localize('Go back')}
                onCancel={() => props.closeModal()}
                onClick={() => props.startDeactivating()}
            />
        </div>
    );
};

const GeneralErrorContent = ({ message, onClick }) => (
    <React.Fragment>
        <div className='deactivate-account-error__container deactivate-account-error__container-message'>
            <div className='deactivate-account-error__details deactivate-account-error__details-message'>{message}</div>
        </div>
        <div>
            <Button className='deactivate-account-error__button' primary onClick={onClick}>
                {localize('OK')}
            </Button>
        </div>
    </React.Fragment>
);

const character_limit_no = 110;
const max_allowed_reasons = 3;

class DeactivateAccountReason extends React.Component {
    static contextType = PlatformContext;

    state = {
        api_error_message: '',
        is_loading: false,
        is_account_deactivated: false,
        is_modal_open: false,
        reason: null,
        details: undefined,
        which_modal_should_render: undefined,
        is_checkbox_disabled: false,
        total_checkbox_checked: 0,
        remaining_characters: character_limit_no,
        total_accumulated_characters: 0,
    };
    validateFields = values => {
        const error = {};
        const selected_reason_count = selectedReasons(values).length;
        const text_inputs_length = (values.other_trading_platforms + values.do_to_improve).length;
        let remaining_characters = character_limit_no - text_inputs_length;

        if (selected_reason_count) {
            const final_value = preparingReason(values);

            remaining_characters = remaining_characters >= 0 ? remaining_characters : 0;

            if (!/^[ a-zA-Z0-9.,'-\s]*$/.test(final_value)) {
                error.characters_limits = localize("Must be numbers, letters, and special characters . , ' -");
            }
        } else {
            error.empty_reason = localize('Please select at least one reason');
        }

        this.setState({
            total_accumulated_characters: text_inputs_length,
            remaining_characters,
        });

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
                if (this.state.total_checkbox_checked === max_allowed_reasons)
                    this.setState({ is_checkbox_disabled: true });
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

        if (account_closure_response.account_closure === 1) {
            this.setState({ is_account_deactivated: true });
        } else {
            const { code, message, details } = account_closure_response.error;
            const getModalToRender = () => {
                if (code === 'AccountHasPendingConditions') {
                    return 'AccountHasPendingConditions';
                }
                if (code === 'MT5AccountInaccessible') {
                    return 'inaccessible_modal';
                }
                return 'error_modal';
            };

            this.setState({
                which_modal_should_render: getModalToRender(),
                details,
                api_error_message: message,
                is_modal_open: true,
                is_loading: false,
            });
        }
    };

    handleChange = (e, old_value, onChange) => {
        const value = e.target.value;

        const { remaining_characters, total_accumulated_characters } = this.state;

        const is_delete_action = old_value.length > value.length;

        if ((remaining_characters <= 0 || total_accumulated_characters >= character_limit_no) && !is_delete_action) {
            e.preventDefault();
        } else {
            onChange(e);
        }
    };

    handleInputPaste = e => {
        const clipboardData = (e.clipboardData || window.clipboardData).getData('text');
        const remaining_chars = this.state.remaining_characters;

        if (this.state.remaining_characters <= 0 || clipboardData.length > remaining_chars) {
            e.preventDefault();
        }
    };

    render() {
        if (this.state.is_account_deactivated) return <Redirect to={routes.account_deactivated} />;

        const getModalTitle = () => {
            if (this.state.which_modal_should_render === 'error_modal') return localize('An error occurred');
            if (this.state.which_modal_should_render === 'inaccessible_modal')
                return localize('Inaccessible MT5 account(s)');
            return this.state.which_modal_should_render !== 'warning_modal' ? localize('Action required') : undefined;
        };
        const { is_dashboard } = this.context;

        return this.state.is_loading ? (
            <Loading is_fullscreen={false} />
        ) : (
            <div
                className={classNames('deactivate-account-reasons', {
                    'deactivate-account-reasons--dashboard': is_dashboard,
                })}
            >
                <Text weight='bold' size='xs' className='deactivate-account-reasons__title' as='p'>
                    {localize('Please tell us why you’re leaving. (Select up to {{ allowed_reasons }} reasons.)', {
                        allowed_reasons: max_allowed_reasons,
                    })}
                </Text>
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

                            <Field name='other_trading_platforms'>
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
                                        name='other_trading_platforms'
                                        value={values.other_trading_platforms}
                                        max_characters={character_limit_no}
                                        onChange={e =>
                                            this.handleChange(e, values.other_trading_platforms, handleChange)
                                        }
                                        onKeyDown={this.handleInputKeyDown}
                                        onPaste={this.handleInputPaste}
                                    />
                                )}
                            </Field>
                            <Field name='do_to_improve'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='deactivate-account-reasons__input'
                                        data-lpignore='true'
                                        autoComplete='off' // prevent chrome autocomplete
                                        type='textarea'
                                        placeholder={localize('What could we do to improve?')}
                                        name='do_to_improve'
                                        value={values.do_to_improve}
                                        max_characters={character_limit_no}
                                        onChange={e => this.handleChange(e, values.do_to_improve, handleChange)}
                                        onKeyDown={this.handleInputKeyDown}
                                        onPaste={this.handleInputPaste}
                                    />
                                )}
                            </Field>
                            <div className='deactivate-account-reasons__footer'>
                                <div className='deactivate-account-reasons__hint-wrapper'>
                                    <Text
                                        size='xxs'
                                        as='p'
                                        color='less-prominent'
                                        className='deactivate-account-reasons__hint'
                                    >
                                        {localize('Remaining characters: {{remaining_characters}}', {
                                            remaining_characters: this.state.remaining_characters,
                                        })}
                                    </Text>
                                    {Object.keys(errors).length > 0 &&
                                        Object.entries(errors).map(([key, value]) => (
                                            <Text
                                                as='p'
                                                weight='bold'
                                                size='xs'
                                                color={is_dashboard ? 'blue' : 'loss-danger'}
                                                className='deactivate-account-reasons__error'
                                                key={key}
                                            >
                                                {value}
                                            </Text>
                                        ))}
                                </div>
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
                            </div>
                        </form>
                    )}
                </Formik>
                <Modal
                    className='deactivate-account-reasons'
                    is_open={this.state.is_modal_open}
                    toggleModal={() => this.setState({ is_modal_open: !this.state.is_modal_open })}
                    title={getModalTitle()}
                >
                    {this.state.which_modal_should_render === 'warning_modal' && (
                        <WarningModal closeModal={this.closeModal} startDeactivating={this.startDeactivating} />
                    )}
                    {this.state.which_modal_should_render === 'AccountHasPendingConditions' && (
                        <AccountHasPendingConditions
                            details={this.state.details}
                            mt5_login_list={this.props.mt5_login_list}
                            client_accounts={this.props.client_accounts}
                            dxtrade_accounts_list={this.props.dxtrade_accounts_list}
                            onBackClick={this.props.onBackClick}
                            is_eu={this.props.is_eu}
                        />
                    )}
                    {this.state.which_modal_should_render === 'inaccessible_modal' && (
                        <GeneralErrorContent message={this.state.api_error_message} onClick={this.closeModal} />
                    )}
                </Modal>
            </div>
        );
    }
}

export default connect(({ client }) => ({
    client_accounts: client.account_list,
    mt5_login_list: client.mt5_login_list,
    dxtrade_accounts_list: client.dxtrade_accounts_list,
    is_eu: client.is_eu,
}))(DeactivateAccountReason);
