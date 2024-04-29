import React from 'react';
import { waitFor } from '@testing-library/react';
import { usePaymentAgentWithdrawal } from '@deriv/api-v2';
import { renderHook } from '@testing-library/react-hooks';
import PaymentAgentWithdrawalProvider, { usePaymentAgentWithdrawalContext } from '../PaymentAgentWithdrawalProvider';

const mockedUsePaymentAgentWithdrawal = usePaymentAgentWithdrawal as jest.MockedFunction<
    typeof usePaymentAgentWithdrawal
>;

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveAccount: jest.fn(() => ({
        data: {
            currency: 'USD',
            balance: 1000,
            currency_config: {
                fractional_digits: 2,
            },
            loginid: 'CR7654321',
        },
    })),
    usePaymentAgentWithdrawal: jest.fn(() => ({
        isLoading: false,
        mutateAsync: jest.fn().mockResolvedValue({
            paymentagent_name: 'Payment Agent Name',
            paymentagent_withdraw: 2,
        }),
    })),
}));

describe('PaymentAgentWithdrawalProvider', () => {
    let mockedSetVerificationCode: jest.MockedFunction<typeof jest.fn>;

    beforeEach(() => {
        mockedSetVerificationCode = jest.fn();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <PaymentAgentWithdrawalProvider setVerificationCode={mockedSetVerificationCode} verificationCode='code'>
            {children}
        </PaymentAgentWithdrawalProvider>
    );

    it('should return proper confirmation and `try_successful` status when requestTryPaymentAgentWithdrawal was fired', async () => {
        const { result } = renderHook(() => usePaymentAgentWithdrawalContext(), { wrapper });

        result.current.requestTryPaymentAgentWithdrawal({ amount: 100, paymentagent_loginid: 'CR1234567' });

        await waitFor(() => {
            expect(result.current.withdrawalConfirm).toEqual({
                amount: '100',
                clientID: 'CR7654321',
                currency: 'USD',
                paymentAgentID: 'CR1234567',
                paymentAgentName: 'Payment Agent Name',
            });

            expect(result.current.withdrawalStatus).toBe('try_successful');
        });
    });

    it('should return proper receipt and `successful` status when requestPaymentAgentWithdrawal was fired', async () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUsePaymentAgentWithdrawal.mockReturnValueOnce({
            mutateAsync: jest.fn().mockResolvedValue({
                paymentagent_name: 'Payment Agent Name',
                paymentagent_withdraw: 1,
            }),
        });

        const { result } = renderHook(() => usePaymentAgentWithdrawalContext(), { wrapper });

        result.current.requestPaymentAgentWithdrawal({
            amount: 100,
            paymentAgentEmail: 'myemail@test.com',
            paymentAgentPhoneNumbers: [{ phone_number: '375257225775' }],
            paymentAgentUrls: [{ url: 'https;//mywebsite.com' }],
            paymentagent_loginid: 'CR1234567',
        });

        await waitFor(() => {
            expect(result.current.withdrawalReceipt).toEqual({
                amount: '100',
                currency: 'USD',
                paymentAgentEmail: 'myemail@test.com',
                paymentAgentName: 'Payment Agent Name',
                paymentAgentPhoneNumbers: [{ phone_number: '375257225775' }],
                paymentAgentUrls: [{ url: 'https;//mywebsite.com' }],
            });
            expect(result.current.withdrawalStatus).toBe('successful');
        });
    });

    it('should proper reset payment agent withdrawal attempt', () => {
        const { result } = renderHook(() => usePaymentAgentWithdrawalContext(), { wrapper });

        result.current.resetPaymentAgentWithdrawal();

        expect(result.current.withdrawalConfirm).toEqual({
            amount: '',
            clientID: '',
            currency: undefined,
            paymentAgentID: '',
            paymentAgentName: '',
        });
        expect(result.current.withdrawalReceipt).toEqual({
            amount: '',
            currency: undefined,
            paymentAgentEmail: '',
            paymentAgentName: '',
            paymentAgentPhoneNumbers: [],
            paymentAgentUrls: [],
        });
        expect(result.current.withdrawalStatus).toBe('idle');
        expect(mockedSetVerificationCode).toHaveBeenCalledWith('');
    });
});
