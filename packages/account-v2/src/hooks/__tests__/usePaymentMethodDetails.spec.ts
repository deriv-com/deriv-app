import { useGetAccountStatus } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import { TPaymentMethod, TPaymentMethodInfo } from 'src/types';
import { usePaymentMethodDetails } from '../usePaymentMethodDetails';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useGetAccountStatus: jest.fn(),
}));

describe('usePaymentMethodDetails', () => {
    const mockData = {
        other: {
            documentsRequired: 3,
            identifier: 'none',
            inputLabel: null,
            isGenericPM: true,
            items: [
                {
                    documents_required: 3,
                    payment_method: 'UPI',
                },
            ],
            paymentMethod: 'upi',
        },
        skrill: {
            documentsRequired: 2,
            identifier: 'email_address',
            inputLabel: 'Email address',
            isGenericPM: false,
            items: [
                {
                    documents_required: 2,
                    payment_method: 'SKRILL',
                },
            ],
            paymentMethod: 'skrill',
        },
        visa: {
            documentsRequired: 1,

            identifier: 'card_number',
            inputLabel: 'Card number',
            isGenericPM: false,
            items: [
                {
                    documents_required: 1,
                    payment_method: 'VISA',
                },
            ],
            paymentMethod: 'visa',
        },
    };

    type TMockData = keyof typeof mockData;

    it('should return ownershipStatus and paymentMethodData', () => {
        (useGetAccountStatus as jest.Mock).mockReturnValue({
            data: {
                authentication: {
                    ownership: {
                        requests: [
                            {
                                documents_required: 1,
                                payment_method: 'VISA',
                            },
                            {
                                documents_required: 2,
                                payment_method: 'SKRILL',
                            },
                        ],
                        status: 'VERIFIED',
                    },
                },
            },
            isLoading: false,
        });

        const { result } = renderHook(() => usePaymentMethodDetails());
        const { ownershipStatus, paymentMethodData } = result.current;
        expect(ownershipStatus).toBe('verified');

        Object.keys(paymentMethodData).forEach(payment => {
            const { documentsRequired, identifier, inputLabel, isGenericPM, items, paymentMethod } = paymentMethodData[
                payment as TPaymentMethod
            ] as TPaymentMethodInfo;
            expect({ documentsRequired, identifier, inputLabel, isGenericPM, items, paymentMethod }).toEqual(
                mockData[payment as TMockData]
            );
        });
    });

    it('should return details of default payment method when payment method is not configured', () => {
        (useGetAccountStatus as jest.Mock).mockReturnValue({
            data: {
                authentication: {
                    ownership: {
                        requests: [
                            {
                                documents_required: 3,
                                payment_method: 'UPI',
                            },
                        ],
                        status: 'VERIFIED',
                    },
                },
            },
            isLoading: false,
        });

        const { result } = renderHook(() => usePaymentMethodDetails());
        const { paymentMethodData } = result.current;

        Object.keys(paymentMethodData).forEach(payment => {
            const { documentsRequired, identifier, inputLabel, isGenericPM, items, paymentMethod } = paymentMethodData[
                payment as TPaymentMethod
            ] as TPaymentMethodInfo;
            expect({ documentsRequired, identifier, inputLabel, isGenericPM, items, paymentMethod }).toEqual(
                mockData.other
            );
        });
    });

    it('should populate items with multiple requests for the same payment method', () => {
        (useGetAccountStatus as jest.Mock).mockReturnValue({
            data: {
                authentication: {
                    ownership: {
                        requests: [
                            {
                                documents_required: 1,
                                payment_method: 'VISA',
                            },
                            {
                                documents_required: 1,
                                payment_method: 'VISA',
                            },
                        ],
                        status: 'VERIFIED',
                    },
                },
            },
            isLoading: false,
        });

        const { result } = renderHook(() => usePaymentMethodDetails());
        const { paymentMethodData } = result.current;

        const { items } = paymentMethodData.visa as TPaymentMethodInfo;
        expect(items).toHaveLength(2);
    });
});
