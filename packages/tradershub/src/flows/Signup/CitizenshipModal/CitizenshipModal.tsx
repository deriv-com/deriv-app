import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { isCVMEnabled } from '@/helpers';
import { useClientCountry, useResidenceList } from '@deriv/api-v2';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Button, Checkbox, Dropdown, Text } from '@deriv-com/ui';
import { TSignupFormValues } from '../SignupWrapper/SignupWrapper';

type TCitizenshipModal = {
    onClickNext: VoidFunction;
};

const CitizenshipModal = ({ onClickNext }: TCitizenshipModal) => {
    const { data: residenceList, isLoading: residenceListLoading } = useResidenceList();
    const { data: clientCountry, isLoading: clientCountryLoading } = useClientCountry();
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);
    const { values, setFieldValue } = useFormikContext<TSignupFormValues>();
    const isCheckboxVisible = isCVMEnabled(values.country);

    useEffect(() => {
        if (residenceList?.length && clientCountry && values.country === '') {
            setFieldValue('country', clientCountry);
        }
    }, [clientCountry, setFieldValue, residenceList, values.country]);

    // Add <Loading /> here later when it's created
    if (clientCountryLoading && residenceListLoading) return null;

    return (
        <div className='h-full rounded-default max-w-[328px] lg:max-w-[440px] bg-system-light-primary-background'>
            <div className='flex flex-col p-16 space-y-16 lg:space-y-24 lg:p-24'>
                <Text weight='bold'>Select your country and citizenship:</Text>
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
                {isCheckboxVisible && (
                    <Checkbox
                        checked={isCheckBoxChecked}
                        label={
                            <Text size='sm'>
                                I hereby confirm that my request for opening an account with Deriv to trade OTC products
                                issued and offered exclusively outside Brazil was initiated by me. I fully understand
                                that Deriv is not regulated by CVM and by approaching Deriv I intend to set up a
                                relation with a foreign company.
                            </Text>
                        }
                        labelClassName='flex-1'
                        name='cvmCheckbox'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsCheckBoxChecked(event.target.checked)
                        }
                        wrapperClassName='w-auto'
                    />
                )}
                <Button
                    className='w-full lg:self-end lg:w-fit'
                    disabled={Boolean(
                        !values.country || !values.citizenship || (isCheckboxVisible && !isCheckBoxChecked)
                    )}
                    onClick={onClickNext}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default CitizenshipModal;
