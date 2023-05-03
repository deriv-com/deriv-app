import classNames from 'classnames';
import React, { HTMLAttributes, RefObject } from 'react';
import { Field, Formik, FormikHandlers, FormikProps, FormikState, FormikValues } from 'formik';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal, ThemedScrollbars } from '@deriv/components';
import {
    getPlatformSettings,
    isMobile,
    isDesktop,
    reorderCurrencies,
    PlatformContext,
    getAddressDetailsFields,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import RadioButtonGroup from './radio-button-group';
import RadioButton from './radio-button';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';
import { TAuthAccountInfo, TCurrencyConfig, TRealAccount, TFormValidation } from 'Types';

export const Hr = () => <div className='currency-hr' />;

type TCurrencySelectorExtend = {
    accounts: { [key: string]: TAuthAccountInfo };
    available_crypto_currencies: TCurrencyConfig[];
    getCurrentStep: () => number;
    goToNextStep: () => void;
    goToStep: (step: number) => void;
    goToPreviousStep: () => void;
    has_cancel: boolean;
    has_currency: boolean;
    has_fiat: boolean;
    has_real_account: boolean;
    has_wallet_account: boolean;
    is_appstore: boolean;
    is_dxtrade_allowed: boolean;
    is_eu: boolean;
    is_virtual: boolean;
    is_mt5_allowed: boolean;
    legal_allowed_currencies: TCurrencyConfig[];
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSave: (current_step: number, values: FormikValues) => void;
    onSubmit: (
        current_step: number | null,
        values: FormikValues,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    onSubmitEnabledChange: (is_submit_disabled: boolean) => void;
    real_account_signup: TRealAccount;
    real_account_signup_target: string;
    resetRealAccountSignupParams: () => void;
    selected_step_ref?: RefObject<FormikProps<FormikValues>>;
    set_currency: boolean;
    validate: (values: FormikValues) => FormikValues;
    value: FormikValues;
};

type TCurrencySelector = HTMLAttributes<HTMLInputElement | HTMLLabelElement> & TCurrencySelectorExtend;

const CurrencySelector = ({
    getCurrentStep,
    goToNextStep,
    goToStep,
    has_currency,
    has_real_account,
    legal_allowed_currencies,
    onSubmit,
    onSave,
    onCancel,
    goToPreviousStep,
    real_account_signup,
    real_account_signup_target,
    resetRealAccountSignupParams,
    set_currency,
    validate,
    has_cancel = false,
    selected_step_ref,
    onSubmitEnabledChange,
    has_wallet_account,
    is_dxtrade_allowed,
    is_mt5_allowed,
    available_crypto_currencies,
    has_fiat,
    accounts,
    is_eu,
    ...props
}: TCurrencySelector) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const crypto = legal_allowed_currencies.filter((currency: TCurrencyConfig) => currency.type === 'crypto');
    const fiat = legal_allowed_currencies.filter((currency: TCurrencyConfig) => currency.type === 'fiat');
    const [is_bypass_step, setIsBypassStep] = React.useState<boolean>(false);
    const is_submit_disabled_ref = React.useRef<boolean>(true);

    const should_disable_fiat = !!Object.values(accounts).filter(
        item => item.landing_company_shortcode === real_account_signup_target
    ).length;

    const isSubmitDisabled = (values: FormikValues) => {
        return selected_step_ref?.current?.isSubmitting || !values.currency;
    };

    const checkSubmitStatus = (values: FormikValues) => {
        const is_submit_disabled = isSubmitDisabled(values);

        if (is_submit_disabled_ref.current !== is_submit_disabled) {
            is_submit_disabled_ref.current = is_submit_disabled;
            onSubmitEnabledChange?.(!is_submit_disabled);
        }
    };

    const handleCancel = (values: FormikValues) => {
        const current_step = getCurrentStep() - 1;
        onSave(current_step, values);
        onCancel(current_step, goToPreviousStep);
    };

    const handleValidate = (values: FormikValues) => {
        checkSubmitStatus(values);
        const { errors }: Partial<TFormValidation> = splitValidationResultTypes(validate(values));
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
        if (is_bypass_step && real_account_signup?.error_details) {
            const keys = Object.keys(real_account_signup?.error_details);
            const route_to_address_details = Object.keys(getAddressDetailsFields()).filter(item => keys.includes(item));
            if (route_to_address_details?.length > 0) goToStep(3);
            else {
                goToNextStep();
            }
            resetRealAccountSignupParams();
            setIsBypassStep(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_bypass_step]);

    const getHeightOffset = () => {
        if (is_appstore) {
            return '222px';
        } else if (!has_currency && has_real_account) {
            return '89px';
        }
        return '159px';
    };

    const getSubmitLabel = () => {
        if (set_currency) {
            return localize('Set currency');
        } else if (has_wallet_account) {
            return localize('Finish');
        }
        return localize('Next');
    };

    const description = React.useMemo(() => {
        const dmt5_label = is_eu ? localize('CFDs') : localize('Deriv MT5');
        const platform_name_dxtrade = getPlatformSettings('dxtrade').name;

        if (is_dxtrade_allowed && is_mt5_allowed) {
            return (
                <Localize
                    i18n_default_text='You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit or created a real {{dmt5_label}} or {{platform_name_dxtrade}} account.'
                    values={{ dmt5_label, platform_name_dxtrade }}
                />
            );
        } else if (!is_dxtrade_allowed && is_mt5_allowed) {
            return (
                <Localize
                    i18n_default_text='You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit or created a real {{dmt5_label}} account.'
                    values={{ dmt5_label }}
                />
            );
        }

        return (
            <Localize i18n_default_text='You are limited to one fiat account. You won’t be able to change your account currency if you have already made your first deposit.' />
        );
    }, [is_eu, is_dxtrade_allowed, is_mt5_allowed]);

    return (
        <Formik
            innerRef={selected_step_ref}
            initialValues={props.value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep ? getCurrentStep() - 1 : null, values, actions.setSubmitting, goToNextStep);
            }}
            validate={handleValidate}
        >
            {({ handleSubmit, values }: FormikState<FormikValues> & FormikHandlers) => (
                <AutoHeightWrapper default_height={450}>
                    {({ setRef, height }: { setRef: (instance: HTMLFormElement | null) => void; height: number }) => (
                        <form
                            ref={setRef}
                            onSubmit={handleSubmit}
                            className='currency-selector'
                            data-testid='currency_selector_form'
                        >
                            <Div100vhContainer
                                className={classNames('currency-selector__container', {
                                    'currency-selector__container--no-top-margin':
                                        !has_currency && has_real_account && isMobile(),
                                })}
                                height_offset={getHeightOffset()}
                                is_disabled={isDesktop()}
                            >
                                <ThemedScrollbars height={height}>
                                    {!!reorderCurrencies(fiat)?.length && (
                                        <React.Fragment>
                                            <RadioButtonGroup
                                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                label={localize('Fiat currencies')}
                                                is_fiat
                                                item_count={reorderCurrencies(fiat).length}
                                                description={description}
                                                has_fiat={should_disable_fiat && has_fiat}
                                            >
                                                {reorderCurrencies(fiat).map((currency: FormikValues) => (
                                                    <Field
                                                        key={currency.value}
                                                        component={RadioButton}
                                                        name='currency'
                                                        id={currency.value}
                                                        label={currency.name}
                                                        selected={should_disable_fiat && has_fiat}
                                                    />
                                                ))}
                                            </RadioButtonGroup>
                                            {!!reorderCurrencies(crypto, 'crypto')?.length && <Hr />}
                                        </React.Fragment>
                                    )}
                                    {!!reorderCurrencies(crypto, 'crypto')?.length && (
                                        <React.Fragment>
                                            <RadioButtonGroup
                                                className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                label={localize('Cryptocurrencies')}
                                                item_count={reorderCurrencies(crypto, 'crypto').length}
                                                description={description}
                                            >
                                                {reorderCurrencies(crypto, 'crypto').map((currency: FormikValues) => (
                                                    <Field
                                                        key={currency.value}
                                                        component={RadioButton}
                                                        selected={
                                                            available_crypto_currencies?.filter(
                                                                ({ value }: TCurrencyConfig) => value === currency.value
                                                            )?.length === 0
                                                        }
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
                                    is_center={false}
                                    is_absolute={set_currency || is_appstore}
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
export type { TCurrencySelector };

export default CurrencySelector;
