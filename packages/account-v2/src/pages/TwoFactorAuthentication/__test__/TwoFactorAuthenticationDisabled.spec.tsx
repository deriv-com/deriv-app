import React from 'react';
import { useAuthorize, useIsTwoFactorAuthenticationEnabled, useTwoFactorAuthentication } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import { TwoFactorAuthenticationDisabled } from '../TwoFactorAuthenticationDisabled';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useAuthorize: jest.fn(),
    useIsTwoFactorAuthenticationEnabled: jest.fn(),
    useTwoFactorAuthentication: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isTablet: false })),
}));

const mockUseTwoFactorAuthentication = useTwoFactorAuthentication as jest.MockedFunction<
    typeof useTwoFactorAuthentication
>;
const mockuseIsTwoFactorAuthenticationEnabled = useIsTwoFactorAuthenticationEnabled as jest.MockedFunction<
    typeof useIsTwoFactorAuthenticationEnabled
>;
const mockUseAuthorize = useAuthorize as jest.MockedFunction<typeof useAuthorize>;

describe('TwoFactorAuthenticationDisabled', () => {
    it('should render the loader when isLoading is true', () => {
        const mockMutate = jest.fn();
        (mockUseTwoFactorAuthentication as jest.Mock).mockReturnValue({
            isLoading: true,
            mutate: mockMutate,
        });
        (mockUseAuthorize as jest.Mock).mockReturnValue({
            data: undefined,
        });
        (mockuseIsTwoFactorAuthenticationEnabled as jest.Mock).mockReturnValue({
            data: false,
        });

        render(<TwoFactorAuthenticationDisabled />);

        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });
    it('should call mutate to generate the secretKey when the component is rendered', () => {
        const mockMutate = jest.fn();
        (mockUseTwoFactorAuthentication as jest.Mock).mockReturnValue({
            isLoading: true,
            mutate: mockMutate,
        });
        (mockUseAuthorize as jest.Mock).mockReturnValue({
            data: undefined,
        });
        (mockuseIsTwoFactorAuthenticationEnabled as jest.Mock).mockReturnValue({
            data: false,
        });
        render(<TwoFactorAuthenticationDisabled />);
        expect(mockMutate).toHaveBeenCalledWith({ totp_action: 'generate' });
    });
});
