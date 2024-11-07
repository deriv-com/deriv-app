import * as Yup from 'yup';
import { ValidationConstants } from '@deriv-com/utils';
import { localize } from '@deriv-com/translations';

const temptPhoneNumberValidation = /^[0-9]{5,15}$/;

const phoneNumberSchema = (isCountryCodeDropdownEnabled: boolean) =>
    Yup.string().matches(
        isCountryCodeDropdownEnabled ? temptPhoneNumberValidation : ValidationConstants.patterns.phoneNumber,
        localize('Enter a valid phone number.')
    );

export const validatePhoneNumber = (
    phone_number: string,
    setErrorMessage: (value: string) => void,
    setIsDisabledRequestButton: (value: boolean) => void,
    isCountryCodeDropdownEnabled: boolean
) => {
    phoneNumberSchema(isCountryCodeDropdownEnabled)
        .validate(phone_number)
        .then(() => {
            setErrorMessage('');
            setIsDisabledRequestButton(false);
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch(({ errors }: any) => {
            setErrorMessage(errors);
            setIsDisabledRequestButton(true);
        });
};
