import { hasInvalidCharacters, isFormattedCardNumber, validFile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { IDENTIFIER_TYPES } from 'Constants/poo-identifier';
import { TPaymentMethodIdentifier } from 'Types';

export const isValidPaymentMethodIdentifier = (
    payment_method_identifier: string,
    identifier_type: TPaymentMethodIdentifier | ''
) => {
    const default_error_message = localize('Enter your full card number');

    if (identifier_type === IDENTIFIER_TYPES.CARD_NUMBER) {
        if (payment_method_identifier.length < 16) {
            return default_error_message;
        } else if (payment_method_identifier.length === 16) {
            return !hasInvalidCharacters(payment_method_identifier) ? null : default_error_message;
        } else if (payment_method_identifier.length > 19) {
            return isFormattedCardNumber(payment_method_identifier) ? null : default_error_message;
        }
        return null;
    }
    return null;
};

export const isValidFile = (file: File) => {
    if (!validFile(file)) {
        return localize("That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only.");
    } else if (file?.size / 1024 > 8000) {
        return localize('That file is too big (only up to 8MB allowed). Please upload another file.');
    }
    return null;
};
