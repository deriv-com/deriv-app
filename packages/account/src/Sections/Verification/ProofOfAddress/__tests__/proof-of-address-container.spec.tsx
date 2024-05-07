import React from 'react';
import merge from 'lodash.merge';
import { screen, render } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ProofOfAddressContainer from '../proof-of-address-container';
import { BrowserRouter } from 'react-router-dom';
import { useKycAuthStatus } from '../../../../hooks';
import { AUTH_STATUS_CODES } from '@deriv/shared';

type TKYCAuthStatusResponse = Partial<ReturnType<typeof useKycAuthStatus>>;

const mock_kyc_auth_status_response: TKYCAuthStatusResponse = {
    kyc_auth_status: {
        address: { status: 'none' },
        identity: { status: 'none' },
    },
    isLoading: false,
    isSuccess: false,
    reFetchKycAuthStatus: jest.fn(),
};

jest.mock('../../../../hooks', () => ({
    useKycAuthStatus: jest.fn(() => mock_kyc_auth_status_response),
}));

describe('ProofOfAddressContainer', () => {
    const store = mockStore({});

    const mergeResponse = (override: TKYCAuthStatusResponse) => merge(mock_kyc_auth_status_response, override);

    const renderComponent = (store_config = store) =>
        render(
            <BrowserRouter>
                <StoreProvider store={store_config}>
                    <ProofOfAddressContainer />
                </StoreProvider>
            </BrowserRouter>
        );

    it('should render POA pending status screen with Continue trading button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.PENDING },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your document is being reviewed, please check back in 1-3 days/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /continue trading/i })).toBeInTheDocument();
    });

    it('should render POA pending status screen with POI required button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.PENDING },
                identity: { status: AUTH_STATUS_CODES.NONE },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your document is being reviewed, please check back in 1-3 days/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Proof of identity/i })).toBeInTheDocument();
    });

    it('should render POA verified status screen with Continue trading button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.VERIFIED },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your proof of address is verified/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /continue trading/i })).toBeInTheDocument();
    });

    it('should render POA verified status screen with POI required button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.VERIFIED },
                identity: { status: AUTH_STATUS_CODES.REJECTED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/Your proof of address is verified/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Proof of identity/i })).toBeInTheDocument();
    });

    it('should render POA expired status screen with Resubmit button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.EXPIRED },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/New proof of address is needed/i)).toBeInTheDocument();
        expect(screen.getByText(/Your document for proof of address is expired/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resubmit/i })).toBeInTheDocument();
    });

    it('should render POA rejected status screen with Resubmit button', () => {
        const mockResponse = mergeResponse({
            kyc_auth_status: {
                address: { status: AUTH_STATUS_CODES.REJECTED },
                identity: { status: AUTH_STATUS_CODES.VERIFIED },
            },
        });

        (useKycAuthStatus as jest.Mock).mockReturnValueOnce(mockResponse);
        renderComponent();

        expect(screen.getByText(/We could not verify your proof of address/i)).toBeInTheDocument();
        expect(screen.getByText(/Please check your email for details/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Resubmit/i })).toBeInTheDocument();
    });
});
