import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import { Autocomplete, Icon } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';

type TBuySellHeaderCurrencySelectorListProps = Array<{
    display_name: string;
    has_adverts: boolean;
    is_default: boolean;
    text: string;
}>;

type TBuySellHeaderCurrencySelectorProps = {
    default_value: string;
    list: TBuySellHeaderCurrencySelectorListProps;
    onSelect: (v: string) => void;
};

const BuySellHeaderCurrencySelector = ({ default_value, list, onSelect }: TBuySellHeaderCurrencySelectorProps) => {
    const getSortedList = (list_items: TBuySellHeaderCurrencySelectorListProps) => {
        const sorted_list = list_items.filter(list_item => list_item.is_default || list_item.has_adverts);
        const index = sorted_list.findIndex(item => item.text === default_value);

        if (index) {
            const value = sorted_list.splice(index, 1);
            if (value) sorted_list.splice(0, 0, value[0]);
        }

        return sorted_list;
    };
    const [filtered_currency_list, setFilteredCurrencyList] = React.useState(getSortedList(list));

    return (
        <Formik enableReinitialize initialValues={{ currency: '' }}>
            {({ setFieldValue }) => (
                <Field name='currency'>
                    {({ field }: FieldProps) => (
                        <Autocomplete
                            {...field}
                            autoComplete='off'
                            className='buy-sell-header-currency-selector'
                            data-lpignore='true'
                            historyValue={default_value}
                            is_list_visible
                            leading_icon={
                                <Icon className='buy-sell-header-currency-selector__search-icon' icon='IcSearch' />
                            }
                            list_height={isMobile() ? '100%' : '288px'}
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
                            onSearch={(value: string, list_items: TBuySellHeaderCurrencySelectorListProps) => {
                                return list_items.filter(
                                    item =>
                                        item.display_name.toLowerCase().includes(value) ||
                                        item.text.toLowerCase().includes(value)
                                );
                            }}
                            placeholder={localize('Search')}
                            trailing_icon={
                                field.value ? (
                                    <Icon
                                        color='secondary'
                                        icon='IcCloseCircle'
                                        onClick={() => {
                                            setFieldValue('currency', '');
                                            setFilteredCurrencyList(getSortedList(list));
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

export default BuySellHeaderCurrencySelector;
