import React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import { useVerifyEmail } from '@deriv/api';
import useGetEmailVerificationOTP from '../useGetEmailVerificationOTP';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useVerifyEmail: jest.fn(),
}));

const mock_response = {
    data: {
        verify_email: 1,
        msg_type: 'verify_email',
    },
    mutate: jest.fn(),
};

const mock_store = mockStore({
    client: {
        email: 'johndoe@regentmarkets.com',
    },
});

const mock_called_value = { type: 'phone_number_verification', verify_email: 'johndoe@regentmarkets.com' };

describe('useGetEmailVerificationOTP', () => {
    it('should call mutate with correct payload for SMS request and return correct response', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>{children}</StoreProvider>
        );
        (useVerifyEmail as jest.Mock).mockReturnValueOnce(mock_response);
        const { result } = renderHook(() => useGetEmailVerificationOTP(), { wrapper });

        result.current.requestEmailVerificationOTP();

        expect(result.current.verifyEmail).toHaveBeenCalledWith(mock_called_value);
    });
});
