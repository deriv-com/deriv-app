import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik } from 'formik';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal, ThemedScrollbars } from '@deriv/components';
import { isMobile, isDesktop, reorderCurrencies, PlatformContext } from '@deriv/shared';
import { localize } from '@deriv/translations';
import RadioButtonGroup from './radio-button-group.jsx';
import RadioButton from './radio-button.jsx';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

export const Hr = () => <div className='currency-hr' />;

const CurrencySelector = ({
    getCurrentStep,
    goToNextStep,
    has_currency,
    has_real_account,
    legal_allowed_currencies,
    onSubmit,
    onSave,
    onCancel,
    goToPreviousStep,
    real_account_signup,
    resetRealAccountSignupParams,
    set_currency,
    validate,
    has_cancel = false,
    selected_step_ref,
    onSubmitEnabledChange,
    has_wallet_account,
    ...props
}) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const crypto = legal_allowed_currencies.filter(currency => currency.type === 'crypto');
    const fiat = legal_allowed_currencies.filter(currency => currency.type === 'fiat');
    const [is_bypass_step, setIsBypassStep] = React.useState(false);
    const is_submit_disabled_ref = React.useRef(true);

    const isSubmitDisabled = values => {
        return selected_step_ref?.current?.isSubmitting || !values.currency;
    };

    const checkSubmitStatus = values => {
        const is_submit_disabled = isSubmitDisabled(values);

        if (is_submit_disabled_ref.current !== is_submit_disabled) {
            is_submit_disabled_ref.current = is_submit_disabled;
            onSubmitEnabledChange?.(!is_submit_disabled);
        }
    };

    const handleCancel = values => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleValidate = values => {
        checkSubmitStatus(values);
        const { errors } = splitValidationResultTypes(validate(values));
        return errors;
    };

    // In case of form error bypass to update personal data
    React.useEffect(() => {
        if (real_account_signup?.error_code) {
            setIsBypassStep(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (is_bypass_step) {
            goToNextStep();
            resetRealAccountSignupParams();
            setIsBypassStep(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_bypass_step]);

    const getHeightOffset = () => {
        if (is_dashboard) {
            return '242px';
        } else if (!has_currency && has_real_account) {
            return '109px';
        }
        return '179px';
    };

    const getSubmitLabel = () => {
        if (set_currency) {
            return localize('Set currency');
        } else if (has_wallet_account) {
            return localize('Finish');
        }
        return localize('Next');
    };

    return (
        <Formik
            innerRef={selected_step_ref}
            initialValues={props.value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep ? getCurrentStep() - 1 : null, values, actions.setSubmitting, goToNextStep);
            }}
            validate={handleValidate}
        >
            {({ handleSubmit, values, errors, touched }) => (
                <AutoHeightWrapper default_height={450}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit} className='currency-selector'>
                            <Div100vhContainer
                                className={classNames('currency-selector__container', {
                                    'currency-selector__container--no-top-margin':
                                        !has_currency && has_real_account && isMobile(),
                                })}
                                height_offset={getHeightOffset()}
                                is_disabled={isDesktop()}
                            >
                                <ThemedScrollbars is_bypassed={isMobile()} height={height}>
                                    {reorderCurrencies(fiat).length > 0 && (
                                        <React.Fragment>
                                            <RadioButtonGroup
                                                id='currency'
                                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                label={localize('Fiat currencies')}
                                                is_fiat
                                                value={values.currency}
                                                error={errors.currency}
                                                touched={touched.currency}
                                                item_count={reorderCurrencies(fiat).length}
                                            >
                                                {reorderCurrencies(fiat).map(currency => (
                                                    <Field
                                                        key={currency.value}
                                                        component={RadioButton}
                                                        name='currency'
                                                        id={currency.value}
                                                        label={currency.name}
                                                    />
                                                ))}
                                            </RadioButtonGroup>
                                            {reorderCurrencies(crypto, 'crypto').length > 0 && <Hr />}
                                        </React.Fragment>
                                    )}
                                    {reorderCurrencies(crypto, 'crypto').length > 0 && (
                                        <React.Fragment>
                                            <RadioButtonGroup
                                                id='currency'
                                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                label={localize('Cryptocurrencies')}
                                                value={values.currency}
                                                error={errors.currency}
                                                touched={touched.currency}
                                                item_count={reorderCurrencies(crypto, 'crypto').length}
                                            >
                                                {reorderCurrencies(crypto, 'crypto').map(currency => (
                                                    <Field
                                                        key={currency.value}
                                                        component={RadioButton}
                                                        name='currency'
                                                        id={currency.value}
                                                        label={currency.name}
                                                    />
                                                ))}
                                            </RadioButtonGroup>
                                        </React.Fragment>
                                    )}
                                </ThemedScrollbars>
                            </Div100vhContainer>
                            <Modal.Footer is_bypassed={isMobile()}>
                                <FormSubmitButton
                                    className={
                                        set_currency
                                            ? 'currency-selector--set-currency'
                                            : 'currency-selector--deriv-account'
                                    }
                                    is_disabled={isSubmitDisabled(values)}
                                    is_center={!has_currency}
                                    is_absolute={set_currency || is_dashboard}
                                    label={getSubmitLabel()}
                                    {...(has_cancel
                                        ? {
                                              cancel_label: localize('Previous'),
                                              has_cancel: true,
                                              onCancel: () => handleCancel(values),
                                          }
                                        : {})}
                                />
                            </Modal.Footer>
                        </form>
                    )}
                </AutoHeightWrapper>
            )}
        </Formik>
    );
};

CurrencySelector.propTypes = {
    controls: PropTypes.object,
    has_currency: PropTypes.bool,
    has_real_account: PropTypes.bool,
    onSubmit: PropTypes.func,
    value: PropTypes.any,
    is_dashboard: PropTypes.bool,
};

export default CurrencySelector;
