/* eslint-disable react-hooks/exhaustive-deps */
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
    real_account_signup,
    resetRealAccountSignupParams,
    set_currency,
    validate,
    submit_button_props = {},
    ...props
}) => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const crypto = legal_allowed_currencies.filter(currency => currency.type === 'crypto');
    const fiat = legal_allowed_currencies.filter(currency => currency.type === 'fiat');
    const [is_bypass_step, setIsBypassStep] = React.useState(false);

    const handleValidate = values => {
        const { errors } = splitValidationResultTypes(validate(values));
        return errors;
    };

    // In case of form error bypass to update personal data
    React.useEffect(() => {
        if (real_account_signup?.error_code) {
            setIsBypassStep(true);
        }
    }, []);

    React.useEffect(() => {
        if (is_bypass_step) {
            goToNextStep();
            resetRealAccountSignupParams();
            setIsBypassStep(false);
        }
    }, [is_bypass_step]);

    return (
        <Formik
            initialValues={props.value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep ? getCurrentStep() - 1 : null, values, actions.setSubmitting, goToNextStep);
            }}
            validate={handleValidate}
        >
            {({ handleSubmit, values, errors, touched, isSubmitting }) => (
                <AutoHeightWrapper default_height={450}>
                    {({ setRef, height }) => (
                        <form ref={setRef} onSubmit={handleSubmit} className='currency-selector'>
                            <Div100vhContainer
                                className={classNames('currency-selector__container', {
                                    'currency-selector__container--no-top-margin':
                                        !has_currency && has_real_account && isMobile(),
                                })}
                                height_offset={!has_currency && has_real_account ? '109px' : '179px'}
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
                                            <Hr />
                                        </React.Fragment>
                                    )}
                                    {reorderCurrencies(crypto, 'crypto').length > 0 && (
                                        <React.Fragment>
                                            <RadioButtonGroup
                                                id='currency'
                                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                label={is_deriv_crypto ? '' : localize('Cryptocurrencies')}
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
                                    is_disabled={isSubmitting || !values.currency}
                                    is_center={!has_currency}
                                    is_absolute={set_currency}
                                    label={set_currency ? localize('Set currency') : localize('Next')}
                                    {...submit_button_props}
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
};

export default CurrencySelector;
