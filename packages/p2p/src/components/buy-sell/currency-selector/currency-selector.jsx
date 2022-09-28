import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Field, Formik } from 'formik';
import { Autocomplete, Icon } from '@deriv/components';
import { localize } from 'Components/i18next';

const CurrencySelector = ({ className, default_value, list, onSelect }) => {
    const filtered_currency_list = list.filter(item => item.is_default || item.has_adverts);

    return (
        <Formik enableReinitialize initialValues={{ currency: '' }}>
            {({ setFieldValue }) => (
                <Field name='currency'>
                    {({ field }) => (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className={classNames('currency-selector', className)}
                            data-lpignore='true'
                            historyValue={default_value}
                            is_list_visible
                            leading_icon={<Icon className='currency-selector__search-icon' icon='IcSearch' />}
                            list_items={filtered_currency_list}
                            not_found_text={
                                list.filter(
                                    item => item.text.toLowerCase() === field.value.toLowerCase() && !item.has_adverts
                                ).length === 1
                                    ? localize('No ads for this currency.')
                                    : localize('No results for "{{value}}".', {
                                          value: field.value,
                                          interpolation: { escapeValue: false },
                                      })
                            }
                            onItemSelection={({ value }) => {
                                if (value) onSelect?.(value);
                            }}
                            placeholder={localize('Search')}
                            trailing_icon={
                                field.value ? (
                                    <Icon
                                        color='secondary'
                                        icon='IcCloseCircle'
                                        onClick={() => {
                                            setFieldValue('currency', '');
                                        }}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            type='text'
                        />
                    )}
                </Field>
            )}
        </Formik>
    );
};

CurrencySelector.propTypes = {
    className: PropTypes.string,
    default_value: PropTypes.string,
    list: PropTypes.array,
    onSelect: PropTypes.func,
};

export default CurrencySelector;
