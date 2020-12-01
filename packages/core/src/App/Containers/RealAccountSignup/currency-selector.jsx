import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik } from 'formik';
import {
    AutoHeightWrapper,
    FormSubmitButton,
    Div100vhContainer,
    Modal,
    Popover,
    Icon,
    ThemedScrollbars,
} from '@deriv/components';
import { getCurrencyDisplayCode, isMobile, isDesktop, reorderCurrencies, PlatformContext } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { Localize, localize } from '@deriv/translations';
import { splitValidationResultTypes } from 'App/Containers/RealAccountSignup/helpers/utils';
import 'Sass/currency-select-radio.scss';

const USTPopover = ({ id }) => {
    let popover_message;
    if (/^UST$/i.test(id)) {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether on Omnilayer (USDT) is a version of Tether, a digital token issued on blockchains and holds a value pegged to 1 USD at all times.<0 /><0 />USDT is built on the bitcoin blockchain via Omni Layer, a platform for digital assets and currencies that run in the bitcoin network.'
                }
                components={[<br key={0} />]}
            />
        );
    } else {
        popover_message = (
            <Localize
                i18n_default_text={
                    'Tether as an ERC20 token (eUSDT) is a version of Tether that is hosted on Ethereum, an open software platform where anyone can build and deploy decentralised applications.'
                }
            />
        );
    }

    return (
        <Popover
            alignment='top'
            icon='info'
            disable_message_icon
            zIndex={9999}
            className='currency-list__popover'
            message={popover_message}
        />
    );
};

// Radio input
export const RadioButton = ({ field: { name, value, onChange, onBlur }, id, label, className, ...props }) => {
    return (
        <React.Fragment>
            <input
                name={name}
                id={id}
                type='radio'
                value={id} // could be something else for output?
                checked={id === value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={props.selected}
                className={classNames('currency-list__radio-button')}
                {...props}
            />
            <label
                htmlFor={id}
                className={classNames('currency-list__item', {
                    'currency-list__item--selected': id === value,
                    'currency-list__item--current': props.selected,
                })}
            >
                <div>
                    <Icon className='currency-list__icon' icon={`IcCurrency-${id.toLowerCase()}`} />
                    {/^(UST|eUSDT)$/i.test(id) && <USTPopover id={id} />}
                    <div className='label currency-list__item-text'>
                        {label}
                        <br />({getCurrencyDisplayCode(id)})
                    </div>
                </div>
            </label>
        </React.Fragment>
    );
};

// Radio group
export const RadioButtonGroup = ({ label, className, children, is_title_enabled, is_fiat, item_count }) => {
    return (
        <div className={className}>
            {is_title_enabled && (
                <h2
                    className={classNames(`${className}--is-header`, {
                        'currency-selector__is-crypto': !is_fiat,
                    })}
                >
                    {label}
                </h2>
            )}
            <div
                className={classNames('currency-list__items', {
                    'currency-list__items__center': item_count < 4,
                    'currency-list__items__is-fiat': is_fiat,
                    'currency-list__items__is-crypto': !is_fiat,
                })}
            >
                {children}
            </div>
            {is_fiat && (
                <p className='currency-selector__description'>
                    <Localize i18n_default_text='You will not be able to change currency once you have made a deposit' />
                </p>
            )}
        </div>
    );
};

RadioButtonGroup.defaultProps = {
    is_title_enabled: true,
};

export const Hr = () => <div className='currency-hr' />;

const CurrencySelector = ({
    has_currency,
    has_real_account,
    bypass_to_personal,
    legal_allowed_currencies,
    validate,
    goToNextStep,
    onSubmit,
    getCurrentStep,
    set_currency,
    ...props
}) => {
    const { is_deriv_crypto } = React.useContext(PlatformContext);
    const crypto = legal_allowed_currencies.filter(currency => currency.type === 'crypto');
    const fiat = legal_allowed_currencies.filter(currency => currency.type === 'fiat');

    const handleValidate = values => {
        const { errors } = splitValidationResultTypes(validate(values));
        return errors;
    };

    // In case of form error bypass to update personal data
    if (bypass_to_personal) goToNextStep();
    return (
        <Formik
            initialValues={props.value}
            onSubmit={(values, actions) => {
                onSubmit(getCurrentStep ? getCurrentStep() - 1 : null, values, actions.setSubmitting, goToNextStep);
            }}
            validate={handleValidate}
        >
            {({ handleSubmit, values, errors, touched, isSubmitting }) => (
                <AutoHeightWrapper default_height={310}>
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

export default connect(({ client }) => ({
    currencies: client.currencies_list,
    has_currency: !!client.currency,
    has_real_account: client.has_active_real_account,
    legal_allowed_currencies: client.upgradeable_currencies,
    selectable_currencies: client.selectable_currencies,
}))(CurrencySelector);
