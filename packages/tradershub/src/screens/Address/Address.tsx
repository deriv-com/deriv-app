import React from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { WizardScreenActions, WizardScreenWrapper } from '@/flows';
import { ScrollToFieldError } from '@/helpers';
import { address } from '@/utils';
import { useSettings, useStatesList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Dropdown, Input, Text, useDevice } from '@deriv-com/ui';
import {
    ACTION_TYPES,
    useRealAccountCreationContext,
} from '../../providers/RealAccountCreationProvider/RealAccountCreationContext';

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
    const { dispatch, helpers, state } = useRealAccountCreationContext();
    const { isDesktop } = useDevice();

    const handleSubmit = (values: FormikValues) => {
        dispatch({
            payload: {
                firstLineAddress: values.firstLineAddress,
                secondLineAddress: values.secondLineAddress,
                stateProvince: values.stateProvince,
                townCity: values.townCity,
                zipCode: values.zipCode,
            },
            type: ACTION_TYPES.SET_ADDRESS,
        });
        helpers.goToNextStep();
    };

    const initialValues = {
        firstLineAddress: getSettings?.address_line_1 ?? state.firstLineAddress ?? '',
        secondLineAddress: getSettings?.address_line_2 ?? state.secondLineAddress ?? '',
        stateProvince: getSettings?.address_state ?? state.stateProvince ?? '',
        townCity: getSettings?.address_city ?? state.townCity ?? '',
        zipCode: getSettings?.address_postcode ?? state.zipCode ?? '',
    };

    return (
        <WizardScreenWrapper heading='Complete your address details'>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnBlur
                validateOnChange
                validationSchema={address}
            >
                {({ errors, handleBlur, handleChange, setFieldValue, touched, values }) => (
                    <Form className='flex flex-col flex-grow w-full overflow-y-auto'>
                        <ScrollToFieldError />
                        <div className='flex-1 p-16 overflow-y-auto lg:p-24'>
                            <div className='flex flex-col'>
                                <Text size='sm' weight='bold'>
                                    Only use an address for which you have proof of residence -
                                </Text>
                                <Text size='sm'>
                                    a recent utility bill (e.g. electricity, water, gas, landline or internet), bank
                                    statement, or government-issued letter with your name and this address.
                                </Text>
                            </div>
                            <div className='flex flex-col items-center self-stretch gap-16 mt-30'>
                                <Input
                                    className='text-default'
                                    error={Boolean(errors.firstLineAddress && touched.firstLineAddress)}
                                    isFullWidth={!isDesktop}
                                    label='First line of address*'
                                    message={
                                        errors.firstLineAddress && touched.firstLineAddress
                                            ? errors.firstLineAddress
                                            : ''
                                    }
                                    name='firstLineAddress'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.firstLineAddress}
                                />
                                <Input
                                    className='text-default'
                                    isFullWidth={!isDesktop}
                                    label='Second line of address'
                                    name='secondLineAddress'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.secondLineAddress}
                                />
                                <Input
                                    className='text-default'
                                    error={Boolean(errors.townCity && touched.townCity)}
                                    isFullWidth={!isDesktop}
                                    label='Town/City*'
                                    message={errors.townCity && touched.townCity ? errors.townCity : ''}
                                    name='townCity'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.townCity}
                                />
                                <div>
                                    <Dropdown
                                        dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                                        label='State/Province'
                                        list={statesList}
                                        name='stateProvince'
                                        onSelect={selectedItem => {
                                            setFieldValue('stateProvince', selectedItem);
                                        }}
                                        value={values.stateProvince}
                                        variant='comboBox'
                                    />
                                </div>
                                <Input
                                    className='text-default'
                                    isFullWidth={!isDesktop}
                                    label='Postal/ZIP Code'
                                    name='zipCode'
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.zipCode}
                                />
                            </div>
                        </div>
                        <WizardScreenActions />
                    </Form>
                )}
            </Formik>
        </WizardScreenWrapper>
    );
};

export default Address;
