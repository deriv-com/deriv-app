import { ValidationConstants } from '@deriv-com/utils';
import { CARD_NUMBER, PAYMENT_METHOD_IDENTIFIER } from 'src/constants';
import {
    TPaymentMethod,
    TPaymentMethodData,
    TPaymentMethodIdentifier,
    TProofOfOwnershipData,
    TProofOfOwnershipFormValue,
} from 'src/types';

const defaultValue: TProofOfOwnershipData = {
    documentsRequired: 0,
    files: [],
    id: 0,
    identifierType: 'none',
    isGenericPM: false,
    paymentMethodIdentifier: '',
};

export const generatePOOInitialValues = (paymentMethodData: TPaymentMethodData) => {
    const paymentMethods = Object.keys(paymentMethodData) as TPaymentMethod[];

    return paymentMethods.reduce<TProofOfOwnershipFormValue>((acc, paymentMethod) => {
        const documentsRequired = paymentMethodData[paymentMethod]?.documentsRequired ?? 0;
        const items = paymentMethodData[paymentMethod]?.items;
        const identifierType = paymentMethodData[paymentMethod]?.identifier ?? 'none';
        const isGenericPM = paymentMethodData[paymentMethod]?.isGenericPM ?? false;
        acc[paymentMethod] = {};
        items?.forEach(item => {
            acc[paymentMethod][item.id as number] = {
                ...defaultValue,
                documentsRequired,
                id: item.id as number,
                identifierType,
                isGenericPM,
            };
        });
        return acc;
    }, {} as TProofOfOwnershipFormValue);
};

const maskCardNumber = (cardNumber: string) => {
    if (
        cardNumber.length !== CARD_NUMBER.minLength ||
        (cardNumber.length === CARD_NUMBER.minLength &&
            ValidationConstants.patterns.invalidFormattedCardNumberCharacters.test(cardNumber))
    ) {
        return cardNumber;
    }
    return `${cardNumber.substring(0, 6)}XXXXXX${cardNumber.substring(12)}`;
};

export const formatIdentifier = (identifierType: TPaymentMethodIdentifier, paymentMethodIdentifier?: string) => {
    const formattedId = paymentMethodIdentifier?.replace(/\s/g, '') ?? '';
    if (identifierType === PAYMENT_METHOD_IDENTIFIER.cardNumber) {
        return maskCardNumber(formattedId);
    } else if (
        PAYMENT_METHOD_IDENTIFIER.email === identifierType ||
        PAYMENT_METHOD_IDENTIFIER.userID === identifierType
    ) {
        return formattedId;
    }
    return formattedId.replace(/(\w{4})/g, '$1 ').trim();
};
