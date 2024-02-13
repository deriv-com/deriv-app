import React, { Fragment } from 'react';
import { useFormikContext } from 'formik';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Text } from '@deriv-com/ui';

const fatcaDeclaration = [
    'US citizenship or lawful permanent resident (green card) status',
    'A US birthplace',
    'A US residence address or a US correspondence address (including a US PO box)',
    'Standing instructions to transfer funds to an account maintained in the United States, or directions regularly received from a US address',
    'An “in care of” address or a “hold mail” address that is the sole address with respect to the client',
    'A power of attorney or signatory authority granted to a person with a US address',
];

const FatcaDeclaration = () => {
    const { errors, setFieldValue, touched, values } = useFormikContext<{
        fatcaDeclaration: string;
    }>();
    return (
        <Fragment>
            <Text size='sm' weight='bold'>
                FATCA declaration
            </Text>
            <Text className='space-y-300' size='sm'>
                {fatcaDeclaration.map((item, index) => (
                    <div key={item}>
                        {index + 1}. {item}
                    </div>
                ))}
            </Text>
            <Text size='sm'>
                If any of the above applies to you, select <span className='font-bold'>Yes</span>. Otherwise, select{' '}
                <span className='font-bold'>No</span>.
            </Text>
            <div>
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage={touched.fatcaDeclaration && errors.fatcaDeclaration}
                    label='Please select*'
                    list={[
                        { text: 'Yes', value: 'yes' },
                        { text: 'No', value: 'no' },
                    ]}
                    name='fatcaDeclaration'
                    onSelect={selectedItem => {
                        setFieldValue('fatcaDeclaration', selectedItem);
                    }}
                    value={values.fatcaDeclaration}
                    variant='comboBox'
                />
            </div>
        </Fragment>
    );
};

export default FatcaDeclaration;
