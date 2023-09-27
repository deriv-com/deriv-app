import React from 'react';
import { Autocomplete, DesktopWrapper, MobileWrapper, SelectNative } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { FormikErrors, FormikProps, FormikValues } from 'formik';
import { ResidenceList } from '@deriv/api-types';

type TTaxResidenceSelect = {
    field: { [key: string]: string };
    setFieldValue: FormikProps<FormikValues>['setFieldValue'];
    errors: FormikErrors<{ [key: string]: string }>;
    values: { [key: string]: string };
    is_changeable?: boolean;
    residence_list: ResidenceList;
};

const TaxResidenceSelect = ({
    field,
    errors,
    setFieldValue,
    values,
    is_changeable,
    residence_list,
}: TTaxResidenceSelect) => (
    <React.Fragment>
        <DesktopWrapper>
            <Autocomplete
                {...field}
                data-lpignore='true'
                autoComplete='new-password' // prevent chrome autocomplete
                type='text'
                label={<Localize i18n_default_text='Tax residence*' />}
                error={errors.tax_residence!}
                disabled={!is_changeable}
                id='tax_residence'
                list_items={residence_list}
                onItemSelection={({ value, text }: { value: boolean; text: string }) =>
                    setFieldValue('tax_residence', value ? text : '', true)
                }
                required
            />
        </DesktopWrapper>
        <MobileWrapper>
            <SelectNative
                placeholder={<Localize i18n_default_text='Tax residence*' />}
                label={<Localize i18n_default_text='Tax residence*' />}
                value={values.tax_residence}
                list_items={residence_list}
                id={'tax_residence_mobile'}
                error={errors.tax_residence}
                disabled={!is_changeable}
                use_text={true}
                onChange={e => setFieldValue('tax_residence', e.target.value, true)}
                required
            />
        </MobileWrapper>
    </React.Fragment>
);

export default TaxResidenceSelect;
