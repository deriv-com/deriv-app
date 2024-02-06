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
    const { handleBlur, handleChange, setFieldValue, values } = useFormikContext<{
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
            <div className='flex flex-col gap-1400'>
                <Input
                    className='w-full text-body-sm'
                    label='Phone number*'
                    name='phoneNumber'
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.phoneNumber}
                />
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    label='Place of birth*'
                    list={residenceList.map(residence => ({
                        text: residence.text,
                        value: residence.value ?? '',
                    }))}
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
                        label='Tax residence*'
                        list={residenceList.map(residence => ({
                            text: residence.text,
                            value: residence.value ?? '',
                        }))}
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
                        className='w-full text-body-sm'
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
                    label='Account opening reason*'
                    list={AccountOpeningReasonList}
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
