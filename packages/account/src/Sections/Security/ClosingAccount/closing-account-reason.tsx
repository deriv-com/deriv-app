import React from 'react';
import { Redirect } from 'react-router-dom';
import { FormikValues, FormikErrors } from 'formik';
import { Loading, Modal, Text } from '@deriv/components';
import { routes, WS } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { TClosingAccountFormValues } from 'Types';
import ClosingAccountHasPendingConditions from './closing-account-pending-conditions/closing-account-has-pending-conditions';
import ClosingAccountReasonForm from './closing-account-reason-form';
import ClosingAccountWarningModal from './closing-account-warning-modal';
import ClosingAccountGeneralErrorContent from './closing-account-general-error-content';

type TClosingAccountReasonProps = {
    onBackClick: () => void;
};

const CHARACTER_LIMIT = 110;
const MAX_ALLOWED_REASONS = 3;

const formatReasonsForCloseAccount = (values: TClosingAccountFormValues) => {
    let selected_reasons = selectedReasonsForCloseAccount(values)
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

const selectedReasonsForCloseAccount = (values: TClosingAccountFormValues) =>
    Object.entries(values).filter(
        ([key, value]) => !['other_trading_platforms', 'do_to_improve'].includes(key) && value
    );

const ClosingAccountReason = ({ onBackClick }: TClosingAccountReasonProps) => {
    const [is_account_closed, setIsAccountClosed] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(false);
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [modal_type, setModalType] = React.useState<string>('');
    const [reason, setReason] = React.useState('');
    const [is_checkbox_disabled, setIsCheckboxDisabled] = React.useState(false);
    const [total_checkbox_checked, setTotalCheckboxChecked] = React.useState(0);
    const [remaining_characters, setRemainingCharacters] = React.useState(CHARACTER_LIMIT);
    const [total_accumulated_characters, setTotalAccumulatedCharacters] = React.useState(0);
    const [api_error_message, setApiErrorMessage] = React.useState('');
    const [details, setDetails] = React.useState();

    React.useEffect(() => {
        if (total_checkbox_checked === MAX_ALLOWED_REASONS) setIsCheckboxDisabled(true);
        else if (is_checkbox_disabled) setIsCheckboxDisabled(false);
    }, [total_checkbox_checked, is_checkbox_disabled]);

    const validateFields = (values: TClosingAccountFormValues) => {
        const error: FormikErrors<FormikValues> = {};
        const selected_reason_count = selectedReasonsForCloseAccount(values).length;
        const text_inputs_length = (values.other_trading_platforms + values.do_to_improve).length;
        let remaining_chars = CHARACTER_LIMIT - text_inputs_length;

        if (selected_reason_count) {
            const final_value = formatReasonsForCloseAccount(values);
            remaining_chars = remaining_chars >= 0 ? remaining_chars : 0;

            if (!/^[a-zA-Z0-9.,'\-\s]*$/.test(final_value)) {
                error.characters_limits = localize("Must be numbers, letters, and special characters . , ' -");
            }
        } else {
            error.empty_reason = localize('Please select at least one reason');
        }

        setTotalAccumulatedCharacters(text_inputs_length);
        setRemainingCharacters(remaining_chars);

        return error;
    };

    const handleSubmitForm = (values: TClosingAccountFormValues) => {
        const final_reason = formatReasonsForCloseAccount(values);

        setIsModalOpen(true);
        setModalType('warning_modal');
        setReason(final_reason);
    };

    const handleChangeCheckbox = (
        values: FormikValues,
        name: string,
        setFieldValue: (name: string, values: string | boolean) => void
    ) => {
        if (!values[name]) {
            setTotalCheckboxChecked(total_checkbox_checked + 1);
            setFieldValue(name, !values[name]);
        } else {
            setTotalCheckboxChecked(total_checkbox_checked - 1);
            setFieldValue(name, !values[name]);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        old_value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    ) => {
        const value = e.target.value;
        const is_delete_action = old_value.length > value.length;

        if ((remaining_characters <= 0 || total_accumulated_characters >= CHARACTER_LIMIT) && !is_delete_action) {
            e.preventDefault();
        } else {
            onChange(e);
        }
    };

    const handleInputPaste = async (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const clipboardData = e.clipboardData.getData('text') || (await navigator.clipboard.readText());

        if (remaining_characters <= 0 || clipboardData.length > remaining_characters) {
            e.preventDefault();
        }
    };

    const getModalTitle = () => {
        if (modal_type === 'error_modal') return <Localize i18n_default_text='An error occurred' />;
        else if (modal_type === 'inaccessible_modal')
            return <Localize i18n_default_text='Inaccessible MT5 account(s)' />;
        else if (modal_type !== 'warning_modal') return <Localize i18n_default_text='Action required' />;
        return '';
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

            setModalType(getModalToRender());
            setDetails(errorDetails);
            setApiErrorMessage(message);
            setIsModalOpen(true);
            setIsLoading(false);
        }
    };

    if (is_account_closed) return <Redirect to={routes.account_closed} />;

    if (is_loading) return <Loading is_fullscreen={false} />;

    return (
        <div className='closing-account-reasons'>
            <Text weight='bold' size='xs' className='closing-account-reasons__title' as='p'>
                <Localize
                    i18n_default_text='Please tell us why you’re leaving. (Select up to {{ allowed_reasons }} reasons.)'
                    values={{ allowed_reasons: MAX_ALLOWED_REASONS }}
                />
            </Text>
            <ClosingAccountReasonForm
                validateFields={validateFields}
                onSubmit={handleSubmitForm}
                is_checkbox_disabled={is_checkbox_disabled}
                onChangeCheckbox={handleChangeCheckbox}
                character_limit_no={CHARACTER_LIMIT}
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
                {modal_type === 'warning_modal' && (
                    <ClosingAccountWarningModal
                        closeModal={() => setIsModalOpen(false)}
                        startDeactivating={startDeactivating}
                    />
                )}
                {modal_type === 'AccountHasPendingConditions' && (
                    <ClosingAccountHasPendingConditions details={details} onBackClick={onBackClick} />
                )}
                {modal_type === 'inaccessible_modal' && (
                    <ClosingAccountGeneralErrorContent
                        message={api_error_message}
                        onClick={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ClosingAccountReason;
