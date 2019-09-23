import classNames        from 'classnames';
import PropTypes         from 'prop-types';
import React             from 'react';
import { Field, Formik } from 'formik';
import { connect }       from 'Stores/connect';
import Icon              from 'Assets/icon.jsx';
import { localize }      from 'App/i18n';
import FormSubmitButton  from './form-submit-button.jsx';
import 'Sass/currency-select-radio.scss';

// Radio input
export const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    ...props
}) => {
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
                    'currency-list__item--current' : props.selected,
                })}
            >
                <div >
                    <Icon
                        icon='IconAccountsCurrency'
                        type={id.toLowerCase()}
                    />
                    <p className='label'>{label}<br />({id})</p>
                </div>
            </label>
        </React.Fragment>
    );
};

// Radio group
export const RadioButtonGroup = ({
    label,
    className,
    children,
    is_title_enabled,
}) => {
    return (
        <div className={className}>
            {is_title_enabled && <h2>{label}</h2>}
            <div className='currency-list__items'>
                {children}
            </div>
        </div>
    );
};

RadioButtonGroup.defaultProps = {
    is_title_enabled: true,
};

export const Hr = () => (
    <div className='currency-hr' />
);

class CurrencySelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fiat_currencies  : [],
            crypto_currencies: [],
        };
    }

    static getDerivedStateFromProps(next_props, next_state) {
        if (next_props.legal_allowed_currencies.length === 0) {
            return next_state;
        }
        const crypto = next_props.legal_allowed_currencies.filter(currency => currency.type === 'crypto');
        const fiat   = next_props.legal_allowed_currencies.filter(currency => currency.type === 'fiat');

        return {
            fiat_currencies  : fiat,
            crypto_currencies: crypto,
        };
    }

    validateCurrencies = (values) => {
        const errors = {};

        if (!values.currency) {
            errors.currency = localize('Select an item');
        }

        return errors;
    }

    render() {
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
                        {this.state.crypto_currencies.length > 0 &&
                        <React.Fragment>
                            <Hr />
                            <RadioButtonGroup
                                id='currency'
                                className='currency-selector__radio-group'
                                label={localize('Crypto currencies')}
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
                        }
                        <FormSubmitButton
                            is_disabled={isSubmitting || !values.currency}
                            label='Next' // Localization will be handled by component
                        />
                    </form>
                )}
            />
        );
    }
}

CurrencySelector.propTypes = {
    controls: PropTypes.object,
    index   : PropTypes.number,
    onSubmit: PropTypes.func,
    value   : PropTypes.any,
};

export default connect(({ client }) => ({
    currencies              : client.currencies_list,
    legal_allowed_currencies: client.upgradeable_currencies,
    selectable_currencies   : client.selectable_currencies,
}))(CurrencySelector);
