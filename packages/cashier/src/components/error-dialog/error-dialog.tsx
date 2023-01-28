import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { useStore, observer } from '@deriv/stores';
import { TError, TReactElement } from 'Types';

type TErrorDialogProps = {
    className: string;
    error: TError | Record<string, never>;
};

type TSetDetails = {
    title: string;
    cancel_button_text: undefined | string;
    confirm_button_text: undefined | string;
    onConfirm: undefined | (() => void);
    message: undefined | string | TReactElement;
    has_close_icon?: boolean;
};

const ErrorDialog = observer(({ className, error = {} }: TErrorDialogProps) => {
    const {
        ui: { disableApp, enableApp },
    } = useStore();

    const history = useHistory();
    const [is_visible, setIsVisible] = React.useState(false);
    const [details, setDetails] = React.useState<TSetDetails>({
        title: '',
        cancel_button_text: undefined,
        confirm_button_text: '',
        onConfirm: undefined,
        message: '',
    });

    const dismissError = React.useCallback(() => {
        if (error.setErrorMessage) {
            error.setErrorMessage({ code: '', message: '' }, null, false);
        }
        setErrorVisibility(false);
    }, [error]);

    const mapErrorToDetails = React.useCallback(
        (error_code?: string, error_message?: string) => {
            if (
                error_code &&
                [
                    'Fiat2CryptoTransferOverLimit',
                    'Crypto2FiatTransferOverLimit',
                    'Crypto2CryptoTransferOverLimit',
                ].includes(error_code)
            ) {
                setDetails({
                    title: localize('Please verify your identity'),
                    cancel_button_text: localize('Cancel'),
                    confirm_button_text: localize('Verify identity'),
                    onConfirm: () => history.push(routes.proof_of_identity),
                    message: error_message,
                });
            } else if (error_code === 'FinancialAssessmentRequired') {
                setDetails({
                    title: localize('Cashier Error'),
                    cancel_button_text: undefined,
                    confirm_button_text: localize('OK'),
                    onConfirm: undefined,
                    message: (
                        <Localize
                            i18n_default_text='Please complete your <0>financial assessment</0>.'
                            components={[
                                <Link
                                    to={routes.financial_assessment}
                                    key={0}
                                    className='link'
                                    onClick={dismissError}
                                />,
                            ]}
                        />
                    ),
                });
            } else if (error_code === 'CryptoWithdrawalError') {
                setDetails({
                    title: localize('Error'),
                    cancel_button_text: undefined,
                    confirm_button_text: localize('Retry'),
                    onConfirm: undefined,
                    message: error_message,
                    has_close_icon: true,
                });
            } else if (error_code === 'CryptoWithdrawalReadMore') {
                setDetails({
                    title: '',
                    cancel_button_text: undefined,
                    confirm_button_text: localize('OK'),
                    onConfirm: undefined,
                    message: error_message,
                });
            } else {
                setDetails({
                    title: localize('Cashier Error'),
                    cancel_button_text: undefined,
                    confirm_button_text: localize('OK'),
                    onConfirm: undefined,
                    message: error_message,
                });
            }
        },
        [dismissError, history]
    );

    React.useEffect(() => {
        // avoid resetting the text when dismissing the pop up
        if (error.message) {
            mapErrorToDetails(error.code, error.message);
        }
    }, [error.code, error.message, mapErrorToDetails]);

    React.useEffect(() => {
        setErrorVisibility(!!error.message);
    }, [error.message]);

    const setErrorVisibility = (is_error_visible: boolean) => {
        setIsVisible(is_error_visible);
    };

    return (
        <Dialog
            title={details.title}
            confirm_button_text={details.confirm_button_text}
            cancel_button_text={details.cancel_button_text}
            className={className}
            onConfirm={() => {
                if (typeof details.onConfirm === 'function') {
                    details.onConfirm();
                }
                dismissError();
            }}
            onEscapeButtonCancel={dismissError}
            onCancel={details.cancel_button_text ? dismissError : undefined}
            disableApp={disableApp}
            enableApp={enableApp}
            is_visible={is_visible}
            portal_element_id='modal_root'
            has_close_icon={details.has_close_icon}
        >
            {/* to avoid the message disappearing before the pop-up */}
            {/* use details.message instead of error.message */}
            {/* since the setErrorVisibility hook gets called after error.message is removed */}
            {details.message}
        </Dialog>
    );
});

export default ErrorDialog;
