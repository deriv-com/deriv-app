import React, { Fragment, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { Modal } from '@/components';
import { useClientCountry, useResidenceList } from '@deriv/api';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Button, Checkbox, Dropdown, Text } from '@deriv-com/ui';
import { TFirstSignupFormValues } from '../FirstSignupWrapper/FirstSignupWrapper';

type TCitizenshipModal = {
    onClickNext: VoidFunction;
};

const CitizenshipModal = ({ onClickNext }: TCitizenshipModal) => {
    const { data: residenceList, isLoading: residenceListLoading } = useResidenceList();
    const { data: clientCountry, isLoading: clientCountryLoading } = useClientCountry();
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);
    const [rerender, setRerender] = useState(false);
    const { values, setFieldValue } = useFormikContext<TFirstSignupFormValues>();
    const isBrazil = values.country === 'br';

    useEffect(() => {
        if (residenceList?.length && clientCountry) {
            setRerender(prev => !prev);
            setFieldValue('country', clientCountry);
        }
    }, [clientCountry, setFieldValue, residenceList]);

    console.log('values = ', values);

    // Add <Loading /> here later when it's created
    if (clientCountryLoading && residenceListLoading) return null;
    // if (residenceListLoading) return null;

    return (
        <Modal className='h-full rounded-default max-w-[328px] md:max-w-[440px]'>
            <Modal.Content className='flex flex-col max-w-[296x] md:max-w-[392px] p-16 space-y-16 md:space-y-24 md:p-24'>
                <Text weight={'bold'}>Select your country and citizenship:</Text>
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage='Country of residence is where you currently live.'
                    label='Country of residence'
                    list={residenceList}
                    name='country'
                    onSelect={selectedItem => {
                        setFieldValue('country', selectedItem);
                    }}
                    value={values.country}
                    variant='comboBox'
                />
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage='Select your citizenship/nationality as it appears on your passport or other government-issued ID.'
                    label='Citizenship'
                    list={residenceList}
                    name='citizenship'
                    onSelect={selectedItem => {
                        setFieldValue('citizenship', selectedItem);
                    }}
                    value={values.citizenship}
                    variant='comboBox'
                />
                {isBrazil && (
                    <div className='flex justify-start space-x-8'>
                        <Checkbox
                            checked={isCheckBoxChecked}
                            label={
                                <Text size='sm'>
                                    I hereby confirm that my request for opening an account with Deriv to trade OTC
                                    products issued and offered exclusively outside Brazil was initiated by me. I fully
                                    understand that Deriv is not regulated by CVM and by approaching Deriv I intend to
                                    set up a relation with a foreign company.
                                </Text>
                            }
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                setIsCheckBoxChecked(event.target.checked)
                            }
                            wrapperClassName='w-auto'
                        />
                    </div>
                )}
                <Button
                    className='w-full md:self-end md:w-fit'
                    disabled={Boolean(!values.country || !values.citizenship || (isBrazil && !isCheckBoxChecked))}
                    onClick={onClickNext}
                >
                    Next
                </Button>
            </Modal.Content>
        </Modal>
    );
};

export default CitizenshipModal;
