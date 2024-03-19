import React from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';
import { CountrySelector } from '../../components/CountrySelector';
import { FormInputField } from '../../components/FormFields';
import { employmentIndustryList } from '../../constants/financialInformationList';

export const TaxInformation = () => {
    const { data: accountSettings } = useSettings();
    const { values }: FormikProps<FormikValues> = useFormikContext();

    const isFieldDisabled = (fieldName: string) => {
        return accountSettings?.immutable_fields?.includes(fieldName);
    };

    return (
        <div className='lg:max-w-[400px] grid pt-8 space-y-12 grid-col-1'>
            {'taxResidence' in values && (
                <CountrySelector
                    disabled={isFieldDisabled('tax_residence')}
                    label='Tax residence*'
                    name='taxResidence'
                />
            )}
            {'taxIdentificationNumber' in values && (
                <FormInputField
                    disabled={isFieldDisabled('tax_identification_number')}
                    isFullWidth
                    label='Tax identification number*'
                    name='taxIdentificationNumber'
                />
            )}
            {'employmentStatus' in values && (
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    label='Employment status'
                    list={employmentIndustryList}
                    name='employmentStatus'
                    /*eslint-disable @typescript-eslint/no-empty-function */
                    onSelect={() => {}}
                />
            )}
        </div>
    );
};
