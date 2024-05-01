import { ValidationConstants } from '@deriv-com/utils';
import { CARD_NUMBER, MAX_FILE_SIZE, PAYMENT_METHOD_IDENTIFIER } from 'src/constants';
import {
    TPaymentMethod,
    TPaymentMethodData,
    TPaymentMethodIdentifier,
    TProofOfOwnershipData,
    TProofOfOwnershipErrors,
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
    let formattedId = paymentMethodIdentifier?.replace(/\s/g, '') ?? '';
    if (identifierType === PAYMENT_METHOD_IDENTIFIER.cardNumber) {
        formattedId = maskCardNumber(formattedId);
    } else if (
        PAYMENT_METHOD_IDENTIFIER.email === identifierType ||
        PAYMENT_METHOD_IDENTIFIER.userID === identifierType
    ) {
        return formattedId;
    }
    return formattedId.replace(/(\w{4})/g, '$1 ').trim();
};

const isValidPaymentMethodIdentifier = (paymentMethodIdentifier: string, identifierType: TPaymentMethodIdentifier) => {
    const defaultErrorMessage = 'Enter your full card number';
    if (identifierType === PAYMENT_METHOD_IDENTIFIER.cardNumber) {
        if (paymentMethodIdentifier.length < CARD_NUMBER.minLength) {
            return defaultErrorMessage;
        } else if (paymentMethodIdentifier.length === CARD_NUMBER.minLength) {
            return !ValidationConstants.patterns.invalidFormattedCardNumberCharacters.test(paymentMethodIdentifier)
                ? null
                : defaultErrorMessage;
        } else if (
            paymentMethodIdentifier.length !== CARD_NUMBER.minLength ||
            paymentMethodIdentifier.length > CARD_NUMBER.maxLength
        ) {
            return ValidationConstants.patterns.formattedCardNumber.test(paymentMethodIdentifier)
                ? null
                : defaultErrorMessage;
        }
        return null;
    }
    return null;
};

const isValidFile = (file: File) => {
    if (!ValidationConstants.patterns.fileType.test(file?.type)) {
        return "That file format isn't supported. Please upload .pdf, .png, .jpg, or .jpeg files only.";
    } else if (file?.size / 1024 > MAX_FILE_SIZE) {
        return 'That file is too big (only up to 8MB allowed). Please upload another file.';
    }
    return null;
};

type TVerifyPaymentMethodIdentifierPayload = {
    errors: TProofOfOwnershipErrors;
    paymentMethod: TPaymentMethod;
    paymentMethodData: TProofOfOwnershipData;
    paymentMethodIndex: number;
};

const verifyPaymentMethodIdentifier = ({
    errors,
    paymentMethod,
    paymentMethodData,
    paymentMethodIndex,
}: TVerifyPaymentMethodIdentifierPayload) => {
    const verifyPaymentMethodIdentifier = isValidPaymentMethodIdentifier(
        paymentMethodData.paymentMethodIdentifier.trim(),
        paymentMethodData.identifierType
    );
    if (verifyPaymentMethodIdentifier) {
        errors[paymentMethod as TPaymentMethod] = {
            ...(errors[paymentMethod as TPaymentMethod] ?? {}),
            [paymentMethodIndex]: {
                ...(errors[paymentMethod as TPaymentMethod]?.[paymentMethodIndex] ?? {}),
                paymentMethodIdentifier: verifyPaymentMethodIdentifier,
            },
        };
    } else {
        delete errors[paymentMethod as TPaymentMethod]?.[paymentMethodIndex]?.paymentMethodIdentifier;
    }
};

type TVerifyPaymentMethodFilesUploadedPayload = {
    errors: TProofOfOwnershipErrors;
    file: File;
    fileIndex: number;
    paymentMethod: TPaymentMethod;
    paymentMethodIndex: number;
};

const verifyPaymentMethodFilesUploaded = ({
    errors,
    file,
    fileIndex,
    paymentMethod,
    paymentMethodIndex,
}: TVerifyPaymentMethodFilesUploadedPayload) => {
    if (!file?.name) {
        return;
    }
    const verifyFile = isValidFile(file);
    if (verifyFile) {
        errors[paymentMethod as TPaymentMethod] = {
            ...(errors[paymentMethod as TPaymentMethod] ?? {}),

            [paymentMethodIndex]: {
                ...(errors[paymentMethod as TPaymentMethod]?.[paymentMethodIndex] ?? {}),
                files: {
                    ...(errors[paymentMethod as TPaymentMethod]?.[paymentMethodIndex]?.files ?? []),
                    [fileIndex]: verifyFile,
                },
            },
        };
    } else {
        delete errors?.[paymentMethod as TPaymentMethod]?.[paymentMethodIndex]?.files?.[fileIndex];
    }
};

export const validatePaymentMethods = (values: TProofOfOwnershipFormValue) => {
    const errors = {} as TProofOfOwnershipErrors;

    Object.keys(values).forEach(paymentMethod => {
        const paymentMethodData = values[paymentMethod as TPaymentMethod];
        Object.keys(paymentMethodData).forEach(id => {
            const item = paymentMethodData[id];

            const isPaymentMethodIdentifierProvided =
                item.isGenericPM || !!item?.paymentMethodIdentifier?.trim().length;
            const areFilesUploaded = item?.files?.filter(file => file?.name).length === item.documentsRequired;
            if (areFilesUploaded && !isPaymentMethodIdentifierProvided) {
                errors[paymentMethod as TPaymentMethod] = {
                    ...(errors[paymentMethod as TPaymentMethod] ?? {}),
                    [id]: {
                        ...(errors[paymentMethod as TPaymentMethod]?.[id as unknown as number] ?? {}),
                        paymentMethodIdentifier: 'Please complete this field',
                    },
                };
            } else {
                delete errors[paymentMethod as TPaymentMethod]?.[id as unknown as number]?.paymentMethodIdentifier;
            }

            if (isPaymentMethodIdentifierProvided) {
                verifyPaymentMethodIdentifier({
                    errors,
                    paymentMethod: paymentMethod as TPaymentMethod,
                    paymentMethodData: item,
                    paymentMethodIndex: id as unknown as number,
                });
                if (!areFilesUploaded) {
                    errors[paymentMethod as TPaymentMethod] = {
                        ...(errors[paymentMethod as TPaymentMethod] ?? {}),
                        [id]: {
                            ...(errors[paymentMethod as TPaymentMethod]?.[id as unknown as number] ?? {}),
                            files: {},
                        },
                    };
                }
            }
            item?.files?.forEach((file, fileIndex) =>
                verifyPaymentMethodFilesUploaded({
                    errors,
                    file,
                    fileIndex,
                    paymentMethod: paymentMethod as TPaymentMethod,
                    paymentMethodIndex: id as unknown as number,
                })
            );
        });
    });
    return errors;
};
