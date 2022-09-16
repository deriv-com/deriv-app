import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Field } from 'formik';
import { Autocomplete, Icon } from '@deriv/components';
import { localize } from 'Components/i18next';
import './currency-dropdown.scss';

const CurrencyDropdown = ({ className, default_value, list, onSelect }) => {
    const filtered_currency_list = list.filter(item => item.has_adverts);

    return (
        <Formik enableReinitialize initialValues={{ currency: '' }}>
            {({ setFieldValue }) => (
                <Field name='currency'>
                    {({ field }) => (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className={classNames('currency-dropdown', className)}
                            data-lpignore='true'
                            historyValue={default_value}
                            is_list_visible
                            leading_icon={<Icon className='currency-dropdown__search-icon' icon='IcSearch' />}
                            list_items={filtered_currency_list}
                            not_found_text={
                                list.filter(item => item.text.toLowerCase() === field.value && !item.has_adverts)
                                    .length === 1
                                    ? localize('No ads for this currency.')
                                    : localize('No results for "{{value}}".', { value: field.value })
                            }
                            onItemSelection={({ value }) => {
                                if (value) onSelect?.(value);
                            }}
                            placeholder={localize('Search currency')}
                            trailing_icon={
                                field.value ? (
                                    <Icon
                                        icon='IcCloseCircle'
                                        color='secondary'
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

CurrencyDropdown.propTypes = {
    className: PropTypes.string,
    default_value: PropTypes.string,
    list: PropTypes.array,
    onSelect: PropTypes.func,
};

export default CurrencyDropdown;
