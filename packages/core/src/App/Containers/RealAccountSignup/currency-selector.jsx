import classNames from 'classnames';
import { Div100vhContainer, MobileWrapper, Icon, ThemedScrollbars } from '@deriv/components';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik } from 'formik';
import { isMobile, isDesktop } from '@deriv/shared/utils/screen';
import { connect } from 'Stores/connect';
import { Localize, localize } from '@deriv/translations';
import FormSubmitButton from './form-submit-button.jsx';
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
                    <Icon icon={`IcCurrency-${id.toLowerCase()}`} />
                    <p className='label'>
                        {label}
                        <br />({id})
                    </p>
                </div>
            </label>
        </React.Fragment>
    );
};

// Radio group
export const RadioButtonGroup = ({ label, className, children, is_title_enabled }) => {
    return (
        <div className={className}>
            {is_title_enabled && <h2>{label}</h2>}
            <div className='currency-list__items'>{children}</div>
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

    validateCurrencies = values => {
        const errors = {};

        if (!values.currency) {
            errors.currency = localize('Select an item');
        }

        return errors;
    };

    render() {
        const { has_currency, has_real_account } = this.props;
        return (
            <Formik
                initialValues={{
                    currency: this.props.value.currency,
                }}
                onSubmit={(values, actions) => {
                    this.props.onSubmit(this.props.index, values, actions.setSubmitting);
                }}
                validate={this.validateCurrencies}
                render={({
                    handleSubmit,
                    // setFieldValue,
                    // setFieldTouched,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit} className='currency-selector'>
                        <Div100vhContainer
                            className={classNames('currency-selector__container', {
                                'currency-selector__container--no-top-margin':
                                    !has_currency && has_real_account && isMobile(),
                            })}
                            height_offset={!has_currency && has_real_account ? '129px' : '199px'}
                            is_disabled={isDesktop()}
                        >
                            <MobileWrapper>
                                {has_real_account && (
                                    <div className='account-wizard__set-currency'>
                                        {!has_currency && (
                                            <p>
                                                <Localize i18n_default_text='You have an account that do not have currency assigned. Please choose a currency to trade with this account.' />
                                            </p>
                                        )}
                                        <h2>
                                            <Localize i18n_default_text='Please choose your currency' />
                                        </h2>
                                    </div>
                                )}
                            </MobileWrapper>
                            <ThemedScrollbars
                                is_native={isMobile()}
                                autohide
                                style={{
                                    height: 'calc(100% - 50px)',
                                }}
                            >
                                <RadioButtonGroup
                                    id='currency'
                                    className='currency-selector__radio-group'
                                    label={localize('Fiat currencies')}
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
                        <FormSubmitButton
                            is_absolute
                            is_disabled={isSubmitting || !values.currency}
                            is_center={!has_currency || isMobile()}
                            label={!has_real_account && isMobile() ? localize('Next') : localize('Set currency')}
                        />
                    </form>
                )}
            />
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
