import React from 'react';
import classNames from 'classnames';
import { Field, Formik, FormikHandlers, FormikState } from 'formik';
import { WebsiteStatus } from '@deriv/api-types';
import { AutoHeightWrapper, FormSubmitButton, Div100vhContainer, Modal, ThemedScrollbars } from '@deriv/components';
import { getPlatformSettings, reorderCurrencies, getAddressDetailsFields } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import RadioButton from './radio-button';
import RadioButtonGroup from './radio-button-group';
import { splitValidationResultTypes } from '../real-account-signup/helpers/utils';

export const Hr = () => <div className='currency-hr' />;

const CURRENCY_TYPE: Record<string, 'crypto' | 'fiat'> = {
    CRYPTO: 'crypto',
    FIAT: 'fiat',
};

export type TCurrencySelectorFormProps = {
    currency: string;
};

type TCurrencySelectorExtend = {
    getCurrentStep: () => number;
    goToNextStep: () => void;
    goToStep: (step: number) => void;
    goToPreviousStep: () => void;
    has_cancel: boolean;
    has_wallet_account: boolean;
    is_virtual: boolean;
    onCancel: (current_step: number, goToPreviousStep: () => void) => void;
    onSave: (current_step: number, values: TCurrencySelectorFormProps) => void;
    onSubmit: (
        current_step: number | null,
        values: TCurrencySelectorFormProps,
        action: (isSubmitting: boolean) => void,
        next_step: () => void
    ) => void;
    set_currency: boolean;
    validate: (values: TCurrencySelectorFormProps) => TCurrencySelectorFormProps;
    value: TCurrencySelectorFormProps;
};

type TCurrencySelector = React.HTMLAttributes<HTMLInputElement | HTMLLabelElement> & TCurrencySelectorExtend;

/**
 * Currency selector component to select the Account currency
 * @name CurrencySelector
 * @param getCurrentStep - Get the current step
 * @param goToNextStep - Go to the next step
 * @param goToStep - Go to a specific step
 * @param goToPreviousStep - Go to the previous step
 * @param has_cancel - Has cancel button
 * @param has_wallet_account - Has wallet account
 * @param is_virtual - Is virtual account
 * @param onCancel - To handle click on cancel button
 * @param onSave - To handle click on save button
 * @param onSubmit - To handle click on submit button
 * @param set_currency - Is current set
 * @param alidate - To validate the form
 * @param alue - Value of the form
 * @returns React node
 */
const CurrencySelector = observer(
    ({
        getCurrentStep,
        goToNextStep,
        goToStep,
        onSubmit,
        onSave,
        onCancel,
        goToPreviousStep,
        set_currency,
        validate,
        has_cancel = false,
        has_wallet_account,
        value,
    }: TCurrencySelector) => {
        const { client, ui, traders_hub } = useStore();

        const {
            currency,
            has_active_real_account: has_real_account,
            upgradeable_currencies: legal_allowed_currencies,
            available_crypto_currencies,
            is_dxtrade_allowed,
            is_mt5_allowed,
            has_fiat,
            accounts,
        } = client;

        const { is_eu_user } = traders_hub;

        const has_currency = Boolean(currency);

        const { real_account_signup, real_account_signup_target, resetRealAccountSignupParams, is_desktop, is_mobile } =
            ui;

        // Wrapped with String() to avoid type mismatch
        const crypto = legal_allowed_currencies.filter(
            selected_currency => String(selected_currency.type) === CURRENCY_TYPE.CRYPTO
        );

        // Wrapped with String() to avoid type mismatch
        const fiat = legal_allowed_currencies.filter(
            selected_currency => String(selected_currency.type) === CURRENCY_TYPE.FIAT
        );
        const [is_bypass_step, setIsBypassStep] = React.useState<boolean>(false);

        const should_disable_fiat = !!Object.values(accounts).filter(
            item => item.landing_company_shortcode === real_account_signup_target
        ).length;

        const handleCancel = (values: TCurrencySelectorFormProps) => {
            const current_step = getCurrentStep() - 1;
            onSave(current_step, values);
            onCancel(current_step, goToPreviousStep);
        };

        const handleValidate = (values: TCurrencySelectorFormProps) => {
            const { errors } = splitValidationResultTypes(validate(values));
            return errors;
        };

        // In case of form error bypass to update personal data
        React.useEffect(() => {
            if (real_account_signup?.error_code) {
                setIsBypassStep(true);
            }
        }, [real_account_signup?.error_code]);

        React.useEffect(() => {
            if (is_bypass_step && real_account_signup?.error_details) {
                const keys = Object.keys(real_account_signup?.error_details);
                const route_to_address_details = Object.keys(getAddressDetailsFields()).filter(item =>
                    keys.includes(item)
                );
                if (route_to_address_details?.length > 0) {
                    goToStep(3);
                } else {
                    goToNextStep();
                }
                resetRealAccountSignupParams();
                setIsBypassStep(false);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [is_bypass_step]);

        const getHeightOffset = () => {
            if (!has_currency && has_real_account) {
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
            const dmt5_label = is_eu_user ? localize('CFDs') : localize('Deriv MT5');
            const platform_name_dxtrade = getPlatformSettings('dxtrade').name;

            if (is_eu_user && is_mt5_allowed) {
                return (
                    <Localize
                        i18n_default_text="Enjoy a seamless trading experience with the selected fiat account. Please note that once you've made your first deposit or created a real {{dmt5_label}} account, your account currency cannot be changed."
                        values={{ dmt5_label }}
                    />
                );
            } else if (is_dxtrade_allowed && is_mt5_allowed) {
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
        }, [is_eu_user, is_dxtrade_allowed, is_mt5_allowed]);

        return (
            <Formik
                initialValues={value}
                onSubmit={(values, actions) => {
                    onSubmit(getCurrentStep ? getCurrentStep() - 1 : null, values, actions.setSubmitting, goToNextStep);
                }}
                validate={handleValidate}
            >
                {({ handleSubmit, values }: FormikState<TCurrencySelectorFormProps> & FormikHandlers) => (
                    <AutoHeightWrapper default_height={450}>
                        {({
                            setRef,
                            height,
                        }: {
                            setRef: (instance: HTMLFormElement | null) => void;
                            height: number;
                        }) => (
                            <form
                                ref={setRef}
                                onSubmit={handleSubmit}
                                className='currency-selector'
                                data-testid='currency_selector_form'
                            >
                                <Div100vhContainer
                                    className={classNames('currency-selector__container', {
                                        'currency-selector__container--no-top-margin':
                                            !has_currency && has_real_account && is_mobile,
                                    })}
                                    height_offset={getHeightOffset()}
                                    is_disabled={is_desktop}
                                >
                                    <ThemedScrollbars height={height}>
                                        {!!fiat?.length && (
                                            <React.Fragment>
                                                <RadioButtonGroup
                                                    className='currency-selector__radio-group currency-selector__radio-group--with-margin'
                                                    label={localize('Fiat currencies')}
                                                    is_fiat
                                                    item_count={fiat.length}
                                                    description={description}
                                                    has_fiat={should_disable_fiat && has_fiat}
                                                >
                                                    {reorderCurrencies(fiat).map(
                                                        (avbl_currency: WebsiteStatus['currencies_config']) => (
                                                            <Field
                                                                key={avbl_currency.value}
                                                                component={RadioButton}
                                                                name='currency'
                                                                id={avbl_currency.value}
                                                                label={avbl_currency.name}
                                                                selected={should_disable_fiat && has_fiat}
                                                            />
                                                        )
                                                    )}
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
                                                    {reorderCurrencies(crypto, 'crypto').map(avbl_currency => (
                                                        <Field
                                                            key={avbl_currency.value}
                                                            component={RadioButton}
                                                            selected={
                                                                available_crypto_currencies?.filter(
                                                                    (crypto_data: WebsiteStatus['currencies_config']) =>
                                                                        crypto_data.value === avbl_currency.value
                                                                )?.length === 0
                                                            }
                                                            name='currency'
                                                            id={avbl_currency.value}
                                                            label={avbl_currency.name}
                                                        />
                                                    ))}
                                                </RadioButtonGroup>
                                            </React.Fragment>
                                        )}
                                    </ThemedScrollbars>
                                </Div100vhContainer>
                                <Modal.Footer has_separator is_bypassed={is_mobile}>
                                    <FormSubmitButton
                                        className={
                                            set_currency
                                                ? 'currency-selector--set-currency'
                                                : 'currency-selector--deriv-account'
                                        }
                                        is_disabled={!values.currency}
                                        is_center={false}
                                        is_absolute={set_currency}
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
    }
);

export default CurrencySelector;
