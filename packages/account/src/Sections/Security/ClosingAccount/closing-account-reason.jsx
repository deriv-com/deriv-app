import React from 'react';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { routes, PlatformContext, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { FormSubmitButton, Modal, Icon, Loading, Text, Button } from '@deriv/components';
import { connect } from 'Stores/connect';
import AccountHasPendingConditions from './account-has-balance.jsx';
import ClosingAccountReasonFrom from './closing-account-reason-form.jsx';

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
            <Text size='xs' line_height='x' weight='bold' className='account-closure-warning-modal__warning-message'>
                {localize('Close your account?')}
            </Text>
            <div className='account-closure-warning-modal__content-wrapper'>
                <Text as='p' align='center' className='account-closure-warning-modal__content'>
                    {localize(
                        'Closing your account will automatically log you out. We shall delete your personal information as soon as our legal obligations are met.'
                    )}
                </Text>
            </div>
            <FormSubmitButton
                is_disabled={false}
                label={localize('Close account')}
                className='account-closure-warning-modal__close-account-button'
                has_cancel
                cancel_label={localize('Go Back')}
                onClick={() => props.startDeactivating()}
                onCancel={() => props.closeModal()}
            />
        </div>
    );
};

const GeneralErrorContent = ({ message, onClick }) => (
    <>
        <div className='closing-account-error__container closing-account-error__container-message'>
            <div className='closing-account-error__details closing-account-error__details-message'>{message}</div>
        </div>
        <div>
            <Button className='closing-account-error__button' primary onClick={onClick}>
                {localize('OK')}
            </Button>
        </div>
    </>
);

const character_limit_no = 110;
const max_allowed_reasons = 3;

const ClosingAccountReason = ({ onBackClick, mt5_login_list, client_accounts, dxtrade_accounts_list }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const [is_account_closed, setIsAccountClosed] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [which_modal_should_render, setWhichModalShouldRender] = React.useState();
    const [reason, setReason] = React.useState(null);
    const [is_checkbox_disabled, setIsCheckboxDisabled] = React.useState(false);
    const [total_checkbox_checked, setTotalCheckboxChecked] = React.useState(0);
    const [remaining_characters, setRemainingCharacters] = React.useState(character_limit_no);
    const [total_accumulated_characters, setTotalAccumulatedCharacters] = React.useState(0);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [details, setDetails] = React.useState();

    const validateFields = values => {
        const error = {};
        const selected_reason_count = selectedReasons(values).length;
        const text_inputs_length = (values.other_trading_platforms + values.do_to_improve).length;
        let remaining_chars = character_limit_no - text_inputs_length;

        if (selected_reason_count) {
            const final_value = preparingReason(values);
            remaining_chars = remaining_chars >= 0 ? remaining_chars : 0;

            if (!/^[ a-zA-Z0-9.,'-\s]*$/.test(final_value)) {
                error.characters_limits = localize("Must be numbers, letters, and special characters . , ' -");
            }
        } else {
            error.empty_reason = localize('Please select at least one reason');
        }

        setTotalAccumulatedCharacters(text_inputs_length);
        setRemainingCharacters(remaining_chars);

        return error;
    };

    const handleSubmitForm = values => {
        const final_reason = preparingReason(values);

        setIsModalOpen(true);
        setWhichModalShouldRender('warning_modal');
        setReason(final_reason);
    };

    React.useEffect(() => {
        if (total_checkbox_checked === max_allowed_reasons) setIsCheckboxDisabled(true);
        else if (is_checkbox_disabled) setIsCheckboxDisabled(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [total_checkbox_checked]);

    const handleChangeCheckbox = (values, name, setFieldValue) => {
        if (!values[name]) {
            setTotalCheckboxChecked(total_checkbox_checked + 1);
            setFieldValue(name, !values[name]);
        } else {
            setTotalCheckboxChecked(total_checkbox_checked - 1);
            setFieldValue(name, !values[name]);
        }
    };

    const handleInputChange = (e, old_value, onChange) => {
        const value = e.target.value;
        const is_delete_action = old_value.length > value.length;

        if ((remaining_characters <= 0 || total_accumulated_characters >= character_limit_no) && !is_delete_action) {
            e.preventDefault();
        } else {
            onChange(e);
        }
    };

    const handleInputPaste = e => {
        const clipboardData = (e.clipboardData || window.clipboardData).getData('text');

        if (remaining_characters <= 0 || clipboardData.length > remaining_characters) {
            e.preventDefault();
        }
    };

    const getModalTitle = () => {
        if (which_modal_should_render === 'error_modal') return localize('An error occurred');
        if (which_modal_should_render === 'inaccessible_modal') return localize('Inaccessible MT5 account(s)');
        return which_modal_should_render !== 'warning_modal' ? localize('Action required') : undefined;
    };

    const startDeactivating = async () => {
        setIsModalOpen(false);
        setIsLoading(true);
        const account_closure_response = await WS.authorized.accountClosure({
            account_closure: 1,
            reason,
        });

        if (account_closure_response.account_closure === 1) {
            setIsAccountClosed(true);
        } else {
            const { code, message, details: errorDetails } = account_closure_response.error;
            const getModalToRender = () => {
                if (code === 'AccountHasPendingConditions') {
                    return 'AccountHasPendingConditions';
                }
                if (code === 'MT5AccountInaccessible') {
                    return 'inaccessible_modal';
                }
                return 'error_modal';
            };

            setWhichModalShouldRender(getModalToRender());
            setDetails(errorDetails);
            setApiErrorMessage(message);
            setIsModalOpen(true);
            setIsLoading(false);
        }
    };

    if (is_account_closed) return <Redirect to={routes.account_closed} />;

    if (is_loading) return <Loading is_fullscreen={false} />;

    return (
        <div
            className={classNames('closing-account-reasons', {
                'closing-account-reasons--dashboard': is_appstore,
            })}
        >
            <Text weight='bold' size='xs' className='closing-account-reasons__title' as='p'>
                {localize('Please tell us why you’re leaving. (Select up to {{ allowed_reasons }} reasons.)', {
                    allowed_reasons: max_allowed_reasons,
                })}
            </Text>
            <ClosingAccountReasonFrom
                validateFields={validateFields}
                onSubmit={handleSubmitForm}
                is_checkbox_disabled={is_checkbox_disabled}
                onChangeCheckbox={handleChangeCheckbox}
                character_limit_no={character_limit_no}
                onInputChange={handleInputChange}
                onInputPaste={handleInputPaste}
                remaining_characters={remaining_characters}
                onBackClick={onBackClick}
            />
            <Modal
                className='closing-account-reasons'
                is_open={is_modal_open}
                toggleModal={() => setIsModalOpen(!is_modal_open)}
                title={getModalTitle()}
            >
                {which_modal_should_render === 'warning_modal' && (
                    <WarningModal closeModal={() => setIsModalOpen(false)} startDeactivating={startDeactivating} />
                )}
                {which_modal_should_render === 'AccountHasPendingConditions' && (
                    <AccountHasPendingConditions
                        details={details}
                        mt5_login_list={mt5_login_list}
                        client_accounts={client_accounts}
                        dxtrade_accounts_list={dxtrade_accounts_list}
                        onBackClick={onBackClick}
                    />
                )}
                {which_modal_should_render === 'inaccessible_modal' && (
                    <GeneralErrorContent message={api_error_message} onClick={() => setIsModalOpen(false)} />
                )}
            </Modal>
        </div>
    );
};

export default connect(({ client }) => ({
    client_accounts: client.account_list,
    mt5_login_list: client.mt5_login_list,
    dxtrade_accounts_list: client.dxtrade_accounts_list,
}))(ClosingAccountReason);
