import React from 'react';
import { Field, FormikHelpers, FormikValues, useFormikContext } from 'formik';
import { Icon, Input } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { TCountryListProps } from 'Types';

type TFormikContext = {
    setFieldValue?: FormikHelpers<FormikValues>['setFieldValue'];
    values: FormikValues;
};
type TPreferredCountriesSelectorProps = {
    country_list: TCountryListProps;
};

const PreferredCountriesSelector = ({ country_list }: TPreferredCountriesSelectorProps) => {
    const { setFieldValue, values }: TFormikContext = useFormikContext<TFormikContext>();
    const { showModal } = useModalManagerContext();
    const countries = Object.keys(country_list).map(key => ({
        text: country_list[key]?.country_name,
        value: key,
    }));

    const getSelectedCountriesText = () => {
        const eligible_countries = values.eligible_countries;
        if (eligible_countries?.length === countries.length) {
            return localize('All countries');
        }

        return eligible_countries?.map((value: string) => country_list[value]?.country_name).join(', ');
    };

    return (
        <Field>
            {({ field }: FormikValues) => (
                <Input
                    {...field}
                    className='preferred-countries-selector'
                    field_className='preferred-countries-selector__input'
                    onClick={() => {
                        showModal({
                            key: 'PreferredCountriesModal',
                            props: {
                                country_list: countries,
                                eligible_countries: values.eligible_countries,
                                onApply: value => {
                                    setFieldValue('eligible_countries', [...value]);
                                    getSelectedCountriesText();
                                },
                            },
                        });
                    }}
                    readOnly
                    trailing_icon={<Icon icon='IcChevronRight' />}
                    type='text'
                    value={getSelectedCountriesText()}
                />
            )}
        </Field>
    );
};

export default PreferredCountriesSelector;
