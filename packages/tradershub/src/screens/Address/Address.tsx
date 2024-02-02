import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Input, Text, Dropdown } from '@deriv-com/ui';
import Actions from '../../flows/RealAccountSIgnup/SignupWizard/Actions';
import WizardScreenWrapper from '../../flows/RealAccountSIgnup/SignupWizard/WizardScreenWrapper';
import { ACTION_TYPES, useSignupWizardContext } from '../../providers/SignupWizardProvider/SignupWizardContext';
import { useSettings, useStatesList } from '@deriv/api';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';

/**
 * @name Address
 * @description The Address component is used to display the address screen.
 * @example <Address />
 * @returns {React.ReactNode}
 */
const Address = () => {
    const { data: getSettings } = useSettings();
    const country = getSettings?.country_code ?? '';
    const { data: statesList } = useStatesList(country);
    const { dispatch } = useSignupWizardContext();

    const handleSubmit = (values: FormikValues) => {
        dispatch({ payload: { firstName: values.firstName }, type: ACTION_TYPES.SET_PERSONAL_DETAILS });
    };
    return (
        <WizardScreenWrapper heading='Complete your address details'>
            <Formik
                initialValues={{
                    firstName: '',
                }}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <div className='flex-1 overflow-y-auto p-1200'>
                            <div className='flex flex-col'>
                                <Text weight='bold' size='sm'>
                                    Only use an address for which you have proof of residence -
                                </Text>
                                <Text size='sm'>
                                    a recent utility bill (e.g. electricity, water, gas, landline or internet), bank
                                    statement, or government-issued letter with your name and this address.
                                </Text>
                            </div>
                            <div className='flex flex-col items-center self-stretch gap-2000 mt-1500'>
                                <Input label='First line of address*' name='firstName' />
                                <Input label='Second line of address' name='lastName' />
                                <Input label='Town/City*' name='townCity' />
                                <div>
                                    <Dropdown
                                        variant='comboBox'
                                        label='State/Province'
                                        list={statesList}
                                        name='stateProvince'
                                        onSelect={() => {}}
                                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                                    />
                                </div>
                                <Input className='text-body-sm' label='Postal/ZIP Code' name='zipCode' />
                            </div>
                        </div>
                        <Actions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default Address;
