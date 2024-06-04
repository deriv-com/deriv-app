import React from 'react';
import { useKycAuthStatus, useResidenceList } from '@deriv/api-v2';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AUTH_STATUS_CODES, POI_SERVICE } from '../../../../constants';
import { usePOIInfo } from '../../../../hooks';
import { ProofOfIdentity } from '../POI';

const mockKycAuthStatusResponse = {
    isLoading: false,
    kyc_auth_status: {
        address: {
            status: AUTH_STATUS_CODES.NONE,
        },
        identity: {
            service: '',
            status: AUTH_STATUS_CODES.NONE,
        },
    },
};

jest.mock('@deriv/api-v2', () => ({
    useIdentityDocumentVerificationAdd: jest.fn().mockReturnValue({ mutateAsync: jest.fn() }),
    useKycAuthStatus: jest.fn().mockReturnValue(mockKycAuthStatusResponse),
    useResidenceList: jest.fn().mockReturnValue({ data: [] }),
    useSettings: jest.fn().mockReturnValue({ data: {}, isLoading: false, mutation: { mutateAsync: jest.fn() } }),
}));

jest.mock('../../../../hooks', () => ({
    usePOIInfo: jest.fn().mockReturnValue({ isLoading: false, kycAuthStatus: {} }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn().mockReturnValue({ isMobile: false }),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: jest.fn(),
    }),
}));

describe('POI', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render loader', () => {
        (useKycAuthStatus as jest.Mock).mockImplementation(() => ({
            ...mockKycAuthStatusResponse,
            isLoading: true,
        }));
        render(<ProofOfIdentity />);
        expect(screen.getByTestId('dt_derivs-loader')).toBeInTheDocument();
    });

    it('should render VerificationStatus for IDV when status is verified', async () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({
            isLoading: false,
            kyc_auth_status: {
                address: {
                    status: AUTH_STATUS_CODES.NONE,
                },
                identity: {
                    service: POI_SERVICE.idv,
                    status: AUTH_STATUS_CODES.VERIFIED,
                },
            },
        });
        render(<ProofOfIdentity />);

        expect(await screen.findByText('ID verification passed')).toBeInTheDocument();
    });

    it('should render VerificationStatus for IDV when status is pending', async () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({
            isLoading: false,
            kyc_auth_status: {
                address: {
                    status: AUTH_STATUS_CODES.NONE,
                },
                identity: {
                    service: POI_SERVICE.onfido,
                    status: AUTH_STATUS_CODES.PENDING,
                },
            },
        });
        render(<ProofOfIdentity />);

        expect(
            await screen.findByText("We'll review your documents and notify you of its status within 5 minutes.")
        ).toBeInTheDocument();
    });

    it('should render IDV when the country supporting IDV is selected', async () => {
        (useKycAuthStatus as jest.Mock).mockReturnValue({
            isLoading: false,
            kyc_auth_status: {
                address: {
                    status: AUTH_STATUS_CODES.NONE,
                },
                identity: {
                    service: POI_SERVICE.onfido,
                    status: AUTH_STATUS_CODES.NONE,
                },
            },
        });
        (useResidenceList as jest.Mock).mockReturnValue({ data: [{ text: 'Country 1', value: 'country1' }] });
        (usePOIInfo as jest.Mock).mockReturnValue({
            isLoading: false,
            kycAuthStatus: { identity: { available_services: ['idv'] } },
        });
        render(<ProofOfIdentity />);

        expect(screen.getByText('In which country was your document issued?')).toBeInTheDocument();
        const elCountrySelector = screen.getByRole('combobox', { name: /Country/ });
        const elNextButton = screen.getByRole('button', { name: /Next/ });
        userEvent.click(elCountrySelector);
        userEvent.click(screen.getByText('Country 1'));

        await waitFor(() => {
            userEvent.click(elNextButton);
        });

        expect(screen.getByText('Identity verification')).toBeInTheDocument();
    });

    it('should render CountrySelector with an error messag when status is rejected with Error code is expired', () => {
        (useKycAuthStatus as jest.Mock).mockReturnValueOnce({
            isLoading: false,
            kyc_auth_status: {
                address: {
                    status: AUTH_STATUS_CODES.NONE,
                },
                identity: {
                    service: POI_SERVICE.idv,
                    status: AUTH_STATUS_CODES.EXPIRED,
                },
            },
        });
        (useResidenceList as jest.Mock).mockReturnValueOnce({ data: [{ text: 'Country 1', value: 'country1' }] });

        render(<ProofOfIdentity />);

        expect(screen.getByText('In which country was your document issued?')).toBeInTheDocument();
        expect(screen.getByText('Your identity document has expired.')).toBeInTheDocument();
    });
});
