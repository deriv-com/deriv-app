import React from 'react';
import { useFormikContext } from 'formik';
import { useResidenceList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon, StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Divider, Dropdown, Input, Text } from '@deriv-com/ui';
import TaxInfoConfirmation from './TaxInfoConfirmation';

const AccountOpeningReasonList = [
    {
        text: 'Hedging',
        value: 'Hedging',
    },
    {
        text: 'Income Earning',
        value: 'Income Earning',
    },
    {
        text: 'Speculative',
        value: 'Speculative',
    },
    {
        text: 'Peer-to-peer exchange',
        value: 'Peer-to-peer exchange',
    },
];

const AdditionalInformation = () => {
    const { errors, handleBlur, handleChange, setFieldValue, touched, values } = useFormikContext<{
        accountOpeningReason: string;
        dateOfBirth: string;
        phoneNumber: string;
        placeOfBirth: string;
        taxIdentificationNumber: string;
        taxResidence: string;
    }>();
    const { data: residenceList } = useResidenceList();

    // need UI fixes for the below Dropdowns from deriv-ui

    return (
        <div>
            <div className='flex items-center gap-16'>
                <Text as='p' className='my-16 shrink-0' weight='bold'>
                    Additional information
                </Text>
                <Divider className='w-full' color='#F2F3F4' />
            </div>
            <div className='flex flex-col gap-20'>
                <Input
                    className='text-default'
                    error={Boolean(errors.phoneNumber && touched.phoneNumber)}
                    isFullWidth
                    label='Phone number*'
                    message={touched.phoneNumber && errors.phoneNumber}
                    name='phoneNumber'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phoneNumber}
                />
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage={touched.placeOfBirth && errors.placeOfBirth}
                    label='Place of birth*'
                    list={residenceList.map(residence => ({
                        text: residence.text,
                        value: residence.value ?? '',
                    }))}
                    listHeight='sm'
                    name='placeOfBirth'
                    onSelect={selectedItem => {
                        setFieldValue('placeOfBirth', selectedItem);
                    }}
                    value={values.placeOfBirth}
                    variant='comboBox'
                />
                <div className='flex justify-between gap-16'>
                    <Dropdown
                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                        errorMessage={touched.taxResidence && errors.taxResidence}
                        label='Tax residence'
                        list={residenceList.map(residence => ({
                            text: residence.text,
                            value: residence.value ?? '',
                        }))}
                        listHeight='sm'
                        name='taxResidence'
                        onSelect={selectedItem => {
                            setFieldValue('taxResidence', selectedItem);
                        }}
                        value={values.taxResidence}
                        variant='prompt'
                    />
                    <div className='pt-6'>
                        <StandaloneCircleInfoRegularIcon />
                    </div>
                </div>
                <div className='flex justify-between gap-16'>
                    <Input
                        className='text-sm'
                        error={Boolean(errors.taxIdentificationNumber && touched.taxIdentificationNumber)}
                        isFullWidth
                        label='Tax identification number'
                        message={touched.taxIdentificationNumber && errors.taxIdentificationNumber}
                        name='taxIdentificationNumber'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.taxIdentificationNumber}
                    />
                    <div className='pt-6'>
                        <StandaloneCircleInfoRegularIcon />
                    </div>
                </div>
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage={touched.accountOpeningReason && errors.accountOpeningReason}
                    label='Account opening reason*'
                    list={AccountOpeningReasonList}
                    listHeight='sm'
                    name='accountOpeningReason'
                    onSelect={selectedItem => {
                        setFieldValue('accountOpeningReason', selectedItem);
                    }}
                    value={values.accountOpeningReason}
                    variant='comboBox'
                />
                {values.taxIdentificationNumber && values.taxResidence && <TaxInfoConfirmation />}
            </div>
        </div>
    );
};

export default AdditionalInformation;
