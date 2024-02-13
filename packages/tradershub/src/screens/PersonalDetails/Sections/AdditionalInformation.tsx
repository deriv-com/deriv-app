import React from 'react';
import { useFormikContext } from 'formik';
import { useResidenceList } from '@deriv/api';
import { LabelPairedChevronDownMdRegularIcon, StandaloneCircleInfoRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Input, Text } from '@deriv-com/ui';

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
            <Text as='p' className='my-800' weight='bold'>
                Additional information
            </Text>
            <div className='flex flex-col gap-1000'>
                <Input
                    className='text-body-sm'
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
                <div className='flex items-center justify-between gap-800'>
                    <Dropdown
                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
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
                        variant='comboBox'
                    />
                    <StandaloneCircleInfoRegularIcon />
                </div>
                <div className='flex items-center justify-between gap-800'>
                    <Input
                        className='text-body-sm'
                        isFullWidth
                        label='Tax identification number'
                        name='taxIdentificationNumber'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.taxIdentificationNumber}
                    />
                    <StandaloneCircleInfoRegularIcon />
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
            </div>
        </div>
    );
};

export default AdditionalInformation;
