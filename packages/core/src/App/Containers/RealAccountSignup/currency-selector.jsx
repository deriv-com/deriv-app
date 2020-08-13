import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik } from 'formik';
import {
    AutoHeightWrapper,
    FormSubmitButton,
    Div100vhContainer,
    MobileWrapper,
    Modal,
    Popover,
    Icon,
    ThemedScrollbars,
} from '@deriv/components';
import { getCurrencyDisplayCode, isMobile, isDesktop } from '@deriv/shared';

import { connect } from 'Stores/connect';
import { Localize, localize } from '@deriv/translations';
import { splitValidationResultTypes } from 'App/Containers/RealAccountSignup/helpers/utils';
import 'Sass/currency-select-radio.scss';

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
                    {/^UST$/i.test(id) && (
                        <Popover
                            alignment='top'
                            icon='info'
                            disable_message_icon
                            zIndex={9999}
                            className='currency-list__popover'
                            message={localize(
                                'Deriv currently supports Tether (USDT). Please deposit USDT from your Omni Layer-enabled wallet into your Deriv account.'
                            )}
                        />
                    )}
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
export const RadioButtonGroup = ({ label, className, children, is_title_enabled, is_fiat }) => {
    return (
        <div className={className}>
            {is_title_enabled && <h2 className={classNames(`${className}--is-header`)}>{label}</h2>}
            <div className='currency-list__items'>{children}</div>
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

export const reorderFiatCurrencies = list => {
    // The order should be custom
    // [USD, EUR, GBP, AUD]
    const order = ['USD', 'EUR', 'GBP', 'AUD'];
    return list.sort((a, b) => {
        if (order.indexOf(a.value) < order.indexOf(b.value)) {
            return -1;
        }
        if (order.indexOf(a.value) > order.indexOf(b.value)) {
            return 1;
        }
        return 0;
    });
};

class CurrencySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fiat_currencies: [],
            crypto_currencies: [],
        };
    }

    static getDerivedStateFromProps(next_props, next_state) {
        if (next_props.legal_allowed_currencies.length === 0) {
            return next_state;
        }
        const crypto = next_props.legal_allowed_currencies.filter(currency => currency.type === 'crypto');
        const fiat = next_props.legal_allowed_currencies.filter(currency => currency.type === 'fiat');

        return {
            fiat_currencies: reorderFiatCurrencies(fiat),
            crypto_currencies: crypto,
        };
    }

    handleValidate = values => {
        const { errors } = splitValidationResultTypes(this.props.validate(values));
        return errors;
    };

    render() {
        const { has_currency, has_real_account } = this.props;

        return (
            <Formik
                initialValues={this.props.value}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                validate={this.handleValidate}
            >
                {({
                    handleSubmit,
                    // setFieldValue,
                    // setFieldTouched,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                }) => (
                    <AutoHeightWrapper default_height={200}>
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
                                    <MobileWrapper>
                                        {has_real_account && (
                                            <div className='account-wizard__set-currency'>
                                                {!has_currency && (
                                                    <p>
                                                        <Localize i18n_default_text='You have an account without an assigned currency. Please choose a currency to trade with this account.' />
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </MobileWrapper>
                                    <ThemedScrollbars is_bypassed={isMobile()} height={`${height - 77}px`}>
                                        <RadioButtonGroup
                                            id='currency'
                                            className='currency-selector__radio-group'
                                            label={localize('Fiat currencies')}
                                            is_fiat
                                            value={values.currency}
                                            error={errors.currency}
                                            touched={touched.currency}
                                        >
                                            {this.state.fiat_currencies.map(currency => (
                                                <Field
                                                    key={currency.value}
                                                    component={RadioButton}
                                                    name='currency'
                                                    id={currency.value}
                                                    label={currency.name}
                                                />
                                            ))}
                                        </RadioButtonGroup>
                                        {this.state.crypto_currencies.length > 0 && (
                                            <React.Fragment>
                                                <Hr />
                                                <RadioButtonGroup
                                                    id='currency'
                                                    className='currency-selector__radio-group'
                                                    label={localize('Cryptocurrencies')}
                                                    value={values.currency}
                                                    error={errors.currency}
                                                    touched={touched.currency}
                                                >
                                                    {this.state.crypto_currencies.map(currency => (
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
                                        is_disabled={isSubmitting || !values.currency}
                                        is_center={!has_currency}
                                        is_absolute={isMobile() && has_currency}
                                        has_cancel
                                        onCancel={this.props.onCancel}
                                        cancel_label={localize('Cancel')}
                                        label={!has_currency ? localize('Set currency') : localize('Next')}
                                    />
                                </Modal.Footer>
                            </form>
                        )}
                    </AutoHeightWrapper>
                )}
            </Formik>
        );
    }
}

CurrencySelector.propTypes = {
    controls: PropTypes.object,
    has_currency: PropTypes.bool,
    has_real_account: PropTypes.bool,
    index: PropTypes.number,
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
