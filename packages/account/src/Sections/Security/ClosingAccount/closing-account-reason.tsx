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
    redirectToSteps: () => void;
};

type TFormError = FormikErrors<TClosingAccountFormValues> & {
    empty_reason?: string;
    characters_limits?: string;
};

type TCustomState = {
    is_account_closed: boolean;
    is_loading: boolean;
    is_modal_open: boolean;
    modal_type: string;
    reason: string;
    is_checkbox_disabled: boolean;
    total_checkbox_checked: number;
    remaining_characters: number;
    total_accumulated_characters: number;
    api_error_message: string;
    details: Record<string, unknown>;
};
type TAction =
    | { type: 'SET_ACCOUNT_CLOSED'; payload: boolean }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_MODAL'; payload: { is_modal_open: boolean; modal_type: string } }
    | { type: 'SET_REASON'; payload: string }
    | { type: 'SET_CHECKBOX_DISABLED'; payload: boolean }
    | { type: 'SET_TOTAL_CHECKBOX_CHECKED'; payload: number }
    | { type: 'SET_REMAINING_CHARACTERS'; payload: number }
    | { type: 'SET_TOTAL_ACCUMULATED_CHARACTERS'; payload: number }
    | { type: 'SET_API_ERROR_MESSAGE'; payload: string }
    | { type: 'SET_DETAILS'; payload: Record<string, unknown> };

const CHARACTER_LIMIT = 110;
const MAX_ALLOWED_REASONS = 3;

const SET_ACCOUNT_CLOSED = 'SET_ACCOUNT_CLOSED';
const SET_LOADING = 'SET_LOADING';
const SET_MODAL = 'SET_MODAL';
const SET_REASON = 'SET_REASON';
const SET_CHECKBOX_DISABLED = 'SET_CHECKBOX_DISABLED';
const SET_TOTAL_CHECKBOX_CHECKED = 'SET_TOTAL_CHECKBOX_CHECKED';
const SET_REMAINING_CHARACTERS = 'SET_REMAINING_CHARACTERS';
const SET_TOTAL_ACCUMULATED_CHARACTERS = 'SET_TOTAL_ACCUMULATED_CHARACTERS';
const SET_API_ERROR_MESSAGE = 'SET_API_ERROR_MESSAGE';
const SET_DETAILS = 'SET_DETAILS';

const initial_state = {
    is_account_closed: false,
    is_loading: false,
    is_modal_open: false,
    modal_type: '',
    reason: '',
    is_checkbox_disabled: false,
    total_checkbox_checked: 0,
    remaining_characters: CHARACTER_LIMIT,
    total_accumulated_characters: 0,
    api_error_message: '',
    details: {},
};

const reducer = (state: TCustomState, action: TAction) => {
    switch (action.type) {
        case SET_ACCOUNT_CLOSED:
            return { ...state, is_account_closed: action.payload };
        case SET_LOADING:
            return { ...state, is_loading: action.payload };
        case SET_MODAL:
            return {
                ...state,
                is_modal_open: action.payload.is_modal_open,
                modal_type: action.payload.modal_type,
            };
        case SET_REASON:
            return { ...state, reason: action.payload };
        case SET_CHECKBOX_DISABLED:
            return { ...state, is_checkbox_disabled: action.payload };
        case SET_TOTAL_CHECKBOX_CHECKED:
            return { ...state, total_checkbox_checked: action.payload };
        case SET_REMAINING_CHARACTERS:
            return { ...state, remaining_characters: action.payload };
        case SET_TOTAL_ACCUMULATED_CHARACTERS:
            return { ...state, total_accumulated_characters: action.payload };
        case SET_API_ERROR_MESSAGE:
            return { ...state, api_error_message: action.payload };
        case SET_DETAILS:
            return { ...state, details: action.payload };
        default:
            return state;
    }
};

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

const ClosingAccountReason = ({ redirectToSteps }: TClosingAccountReasonProps) => {
    const [state, dispatch] = React.useReducer(reducer, initial_state);

    const {
        is_account_closed,
        is_loading,
        is_modal_open,
        modal_type,
        reason,
        is_checkbox_disabled,
        total_checkbox_checked,
        remaining_characters,
        total_accumulated_characters,
        api_error_message,
        details,
    } = state;

    React.useEffect(() => {
        if (total_checkbox_checked === MAX_ALLOWED_REASONS) {
            dispatch({ type: SET_CHECKBOX_DISABLED, payload: true });
        } else if (is_checkbox_disabled) dispatch({ type: SET_CHECKBOX_DISABLED, payload: false });
    }, [total_checkbox_checked, is_checkbox_disabled]);

    const validateFields = (values: TClosingAccountFormValues) => {
        const error: TFormError = {};
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

        dispatch({ type: SET_TOTAL_ACCUMULATED_CHARACTERS, payload: text_inputs_length });
        dispatch({ type: SET_REMAINING_CHARACTERS, payload: remaining_chars });

        return error;
    };

    const handleSubmitForm = (values: TClosingAccountFormValues) => {
        const final_reason = formatReasonsForCloseAccount(values);

        dispatch({ type: SET_MODAL, payload: { is_modal_open: true, modal_type: 'warning_modal' } });
        dispatch({ type: SET_REASON, payload: final_reason });
    };

    const handleChangeCheckbox = (
        values: FormikValues,
        name: string,
        setFieldValue: (name: string, values: string | boolean) => void
    ) => {
        if (!values[name]) {
            dispatch({ type: SET_TOTAL_CHECKBOX_CHECKED, payload: total_checkbox_checked + 1 });

            setFieldValue(name, !values[name]);
        } else {
            dispatch({ type: SET_TOTAL_CHECKBOX_CHECKED, payload: total_checkbox_checked - 1 });

            setFieldValue(name, !values[name]);
        }
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        old_value: string,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    ) => {
        const value = event.target.value;
        const is_delete_action = old_value.length > value.length;

        if ((remaining_characters <= 0 || total_accumulated_characters >= CHARACTER_LIMIT) && !is_delete_action) {
            event.preventDefault();
        } else {
            onChange(event);
        }
    };

    const handleInputPaste = async (e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
        const clipboardData = e.clipboardData.getData('text') || (await navigator.clipboard.readText());

        if (remaining_characters <= 0 || clipboardData.length > remaining_characters) {
            e.preventDefault();
        }
    };

    const getModalTitle = () => {
        switch (modal_type) {
            case 'error_modal':
                return <Localize i18n_default_text='An error occurred' />;
            case 'inaccessible_modal':
                return <Localize i18n_default_text='Inaccessible MT5 account(s)' />;
            case 'warning_modal':
                return '';
            default:
                return <Localize i18n_default_text='Action required' />;
        }
    };
    const getModalContent = () => {
        switch (modal_type) {
            case 'warning_modal':
                return <ClosingAccountWarningModal closeModal={closeModal} startDeactivating={startDeactivating} />;
            case 'account_has_pending_conditions_modal':
                return <ClosingAccountHasPendingConditions details={details} onConfirm={redirectToSteps} />;
            case 'inaccessible_modal':
                return <ClosingAccountGeneralErrorContent message={api_error_message} onClick={closeModal} />;
            default:
                return null;
        }
    };

    const closeModal = () => {
        dispatch({ type: SET_MODAL, payload: { is_modal_open: false, modal_type: '' } });
    };

    const startDeactivating = async () => {
        closeModal();
        dispatch({ type: SET_LOADING, payload: true });
        const account_closure_response = await WS.authorized.accountClosure({
            account_closure: 1,
            reason,
        });

        if (account_closure_response.account_closure === 1) {
            dispatch({ type: SET_ACCOUNT_CLOSED, payload: true });
        } else {
            const { code, message, details } = account_closure_response.error;
            const getModalToRender = () => {
                if (code === 'AccountHasPendingConditions') {
                    return 'account_has_pending_conditions_modal';
                }
                if (code === 'MT5AccountInaccessible') {
                    return 'inaccessible_modal';
                }
                return 'error_modal';
            };

            dispatch({ type: SET_MODAL, payload: { is_modal_open: true, modal_type: getModalToRender() } });
            dispatch({ type: SET_DETAILS, payload: details });
            dispatch({ type: SET_API_ERROR_MESSAGE, payload: message });
            dispatch({ type: SET_LOADING, payload: false });
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
                onBackClick={redirectToSteps}
            />
            {is_modal_open && modal_type && (
                <Modal
                    className='closing-account-reasons'
                    is_open={is_modal_open}
                    toggleModal={closeModal}
                    title={getModalTitle()}
                >
                    {getModalContent()}
                </Modal>
            )}
        </div>
    );
};

export default ClosingAccountReason;
