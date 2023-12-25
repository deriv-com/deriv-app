import React from 'react';
import { FieldInputProps } from 'formik';
import { Text, Dropdown } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import './terms-of-use.scss';

const getFatcaDeclaration = () => [
    <Localize i18n_default_text='US citizenship or lawful permanent resident (green card) status' key='1' />,
    <Localize i18n_default_text='A US birthplace' key='2' />,
    <Localize
        i18n_default_text='A US residence address or a US correspondence address (including a US PO box)'
        key='3'
    />,
    <Localize
        i18n_default_text='Standing instructions to transfer funds to an account maintained in the United States, or directions regularly received from a US address'
        key='4'
    />,
    <Localize
        i18n_default_text='An “in care of” address or a “hold mail” address that is the sole address with respect to the client'
        key='5'
    />,
    <Localize
        i18n_default_text='A power of attorney or signatory authority granted to a person with a US address.'
        key='6'
    />,
];

const options = () => [
    { text: localize('Yes'), value: '1' },
    { text: localize('No'), value: '0' },
];

type TFATCADeclarationProps = {
    field: FieldInputProps<'0' | '1'>;
} & React.ComponentPropsWithoutRef<typeof Dropdown>;

/**
 * Component that displays the FATCA declaration and a dropdown to select yes or no
 * @name FatcaDeclaration
 * @param field - Formik FieldInputProps
 * @returns React Component
 */
const FatcaDeclaration = ({ field: { value, onChange, name }, ...props }: TFATCADeclarationProps) => (
    <React.Fragment>
        <Text as='h4' size='xs' weight='bold'>
            <Localize i18n_default_text='FATCA declaration' />
        </Text>
        <div className='fatca-declaration__layout'>
            <ol>
                {getFatcaDeclaration().map((item, idx) => (
                    <Text
                        as='li'
                        key={idx} /* Since the list remains constant index can be used */
                        size={isDesktop() ? 'xs' : 'xxs'}
                        className='fatca-declaration__points'
                    >
                        {idx + 1}. {item}
                    </Text>
                ))}
            </ol>
            <Text as='p' size={isDesktop() ? 'xs' : 'xxs'} className='fatca-declaration__points'>
                <Localize
                    i18n_default_text='If any of the above applies to you, select <0>Yes.</0> Otherwise, select <0>No.</0>'
                    components={[<strong key={0} />]}
                />
            </Text>
            <Dropdown
                {...props}
                is_align_text_left
                name={name}
                placeholder={localize('Please select')}
                value={value}
                list={options()}
                className='fatca-declaration__agreement'
                onChange={onChange}
            />
        </div>
    </React.Fragment>
);

export default FatcaDeclaration;
