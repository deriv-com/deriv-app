import PropTypes from 'prop-types';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Dialog } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { connect } from 'Stores/connect';

const FormError = ({ disableApp, enableApp, error = {} }) => {
    const history = useHistory();
    const [is_visible, setIsVisible] = React.useState(false);
    const [details, setDetails] = React.useState({
        title: '',
        cancel_button_text: undefined,
        confirm_button_text: '',
        onConfirm: undefined,
        message: '',
    });

    React.useEffect(() => {
        // avoid resetting the text when dismissing the pop up
        if (error.message) {
            mapErrorToDetails(error.code, error.message);
        }
    }, [error.code, error.message, mapErrorToDetails]);

    React.useEffect(() => {
        setErrorVisibility(!!error.message);
    }, [error.message]);

    const mapErrorToDetails = React.useCallback(
        (error_code, error_message) => {
            if (
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
        [history]
    );

    const setErrorVisibility = is_error_visible => {
        setIsVisible(is_error_visible);
    };

    const dismissError = () => {
        error.setErrorMessage('');
        setErrorVisibility(false);
    };

    return (
        <Dialog
            title={details.title}
            confirm_button_text={details.confirm_button_text}
            cancel_button_text={details.cancel_button_text}
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
        >
            {/* to avoid the message disappearing before the pop-up */}
            {/* use details.message instead of error.message */}
            {/* since the setErrorVisibility hook gets called after error.message is removed */}
            {details.message}
        </Dialog>
    );
};

FormError.propTypes = {
    error: PropTypes.object,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
};

export default connect(({ ui }) => ({
    disableApp: ui.disableApp,
    enableApp: ui.enableApp,
}))(FormError);
