import React from 'react';
import { render, screen } from '@testing-library/react';
import WithdrawalLocked from '../withdrawal-locked';

const mockUseWithdrawalLocked = {
    is_poi_needed: true,
    has_poi_submitted: true,
    is_poa_needed: true,
    has_poa_submitted: false,
    is_ask_financial_risk_approval_needed: true,
};

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useWithdrawalLocked: jest.fn(() => mockUseWithdrawalLocked),
}));

describe('<WithdrawalLocked />', () => {
    it('should render ask user to check verification status of POI documents ', () => {
        mockUseWithdrawalLocked.is_poi_needed = true;
        mockUseWithdrawalLocked.has_poi_submitted = true;

        render(<WithdrawalLocked />);

        expect(screen.getByText('Check proof of identity document verification status')).toBeInTheDocument();
    });
    it('should render ask user to upload of POI documents ', () => {
        mockUseWithdrawalLocked.is_poi_needed = true;
        mockUseWithdrawalLocked.has_poi_submitted = false;

        render(<WithdrawalLocked />);

        expect(screen.getByText('Upload a proof of identity to verify your identity')).toBeInTheDocument();
    });
    it('should render ask user to check verification status of POA documents ', () => {
        mockUseWithdrawalLocked.is_poa_needed = true;
        mockUseWithdrawalLocked.has_poa_submitted = true;

        render(<WithdrawalLocked />);

        expect(screen.getByText('Check proof of address document verification status')).toBeInTheDocument();
    });
    it('should render ask user to upload of POA documents ', () => {
        mockUseWithdrawalLocked.is_poa_needed = true;
        mockUseWithdrawalLocked.has_poa_submitted = false;

        render(<WithdrawalLocked />);

        expect(screen.getByText('Upload a proof of address to verify your address')).toBeInTheDocument();
    });
});
