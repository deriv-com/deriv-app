import React from 'react';
import { FormikProps, FormikValues, useFormikContext } from 'formik';
import { useSettings } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown } from '@deriv-com/ui';
import { CountrySelector } from '../../components/CountrySelector';
import { FormInputField } from '../../components/FormFields';
import { employmentIndustryList } from '../../constants/financialInformationList';
import { isFieldDisabled } from '../../utils';

export const TaxInformation = () => {
    const formik = useFormikContext();

    if (!formik) {
        throw new Error('PersonalDetails must be used within a Formik component');
    }

    const { data: accountSettings } = useSettings();
    const { values }: FormikProps<FormikValues> = useFormikContext();

    return (
        <div className='lg:max-w-[400px] grid pt-8 space-y-12 grid-col-1'>
            {'taxResidence' in values && (
                <CountrySelector
                    disabled={isFieldDisabled(accountSettings, 'tax_residence')}
                    label='Tax residence*'
                    name='taxResidence'
                />
            )}
            {'taxIdentificationNumber' in values && (
                <FormInputField
                    disabled={isFieldDisabled(accountSettings, 'tax_identification_number')}
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
