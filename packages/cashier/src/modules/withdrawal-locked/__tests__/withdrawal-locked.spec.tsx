import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAccountStatus, useIsAskFinancialRiskApprovalNeeded } from '@deriv/hooks';
import WithdrawalLocked from '../withdrawal-locked';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWithdrawalLocked: jest.fn(),
    useAccountStatus: jest.fn(),
    useIsAskFinancialRiskApprovalNeeded: jest.fn(),
}));

const mockUseAccountStatus = useAccountStatus as jest.MockedFunction<typeof useAccountStatus>;
const mockUseIsAskFinancialRiskApprovalNeeded = useIsAskFinancialRiskApprovalNeeded as jest.MockedFunction<
    typeof useIsAskFinancialRiskApprovalNeeded
>;

describe('<WithdrawalLocked />', () => {
    it('should render ask user to check verification status of POI documents ', () => {
        mockUseAccountStatus.mockReturnValue({
            statuses: {
                needs_verification: {
                    is_poi_needed: true,
                    is_poa_needed: true,
                },
                document: {
                    has_poi_submitted: true,
                    has_poa_submitted: false,
                },
            },
        });

        mockUseIsAskFinancialRiskApprovalNeeded.mockReturnValue({
            is_ask_financial_risk_approval_needed: false,
            isSuccess: true,
        });

        render(<WithdrawalLocked />);

        expect(screen.getByText('Check proof of identity document verification status')).toBeInTheDocument();
    });
    it('should render ask user to upload of POI documents ', () => {
        mockUseAccountStatus.mockReturnValue({
            statuses: {
                needs_verification: {
                    is_poi_needed: true,
                    is_poa_needed: true,
                },
                document: {
                    has_poi_submitted: false,
                    has_poa_submitted: false,
                },
            },
        });

        mockUseIsAskFinancialRiskApprovalNeeded.mockReturnValue({
            is_ask_financial_risk_approval_needed: false,
            isSuccess: true,
        });

        render(<WithdrawalLocked />);

        expect(screen.getByText('Upload a proof of identity to verify your identity')).toBeInTheDocument();
    });
    it('should render ask user to check verification status of POA documents ', () => {
        mockUseAccountStatus.mockReturnValue({
            statuses: {
                needs_verification: {
                    is_poi_needed: false,
                    is_poa_needed: true,
                },
                document: {
                    has_poi_submitted: false,
                    has_poa_submitted: true,
                },
            },
        });

        mockUseIsAskFinancialRiskApprovalNeeded.mockReturnValue({
            is_ask_financial_risk_approval_needed: false,
            isSuccess: true,
        });

        render(<WithdrawalLocked />);

        expect(screen.getByText('Check proof of address document verification status')).toBeInTheDocument();
    });
    it('should render ask user to upload of POA documents ', () => {
        mockUseAccountStatus.mockReturnValue({
            statuses: {
                needs_verification: {
                    is_poi_needed: false,
                    is_poa_needed: true,
                },
                document: {
                    has_poi_submitted: false,
                    has_poa_submitted: false,
                },
            },
        });

        mockUseIsAskFinancialRiskApprovalNeeded.mockReturnValue({
            is_ask_financial_risk_approval_needed: false,
            isSuccess: true,
        });

        render(<WithdrawalLocked />);

        expect(screen.getByText('Upload a proof of address to verify your address')).toBeInTheDocument();
    });
});
