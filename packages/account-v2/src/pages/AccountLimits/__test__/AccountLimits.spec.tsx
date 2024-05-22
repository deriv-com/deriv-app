import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAccountLimitsData } from '../../../hooks';
import { AccountLimits } from '../AccountLimits';

jest.mock('../../../hooks/useAccountLimitsData', () => ({
    useAccountLimitsData: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loading...</div>),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

jest.mock('../../../components/DemoMessage', () => ({
    DemoMessage: () => <div>DemoMessage</div>,
}));

const sampleAccountlimits = [
    {
        category: 'header',
        title: 'Trading limits',
        value: 'Limit',
    },
];

describe('AccountLimits', () => {
    it('should render loader when isLoading is true', () => {
        (useAccountLimitsData as jest.Mock).mockReturnValue({
            isLoading: true,
        });

        render(<AccountLimits />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render DemoMessage when isVirtual is true', () => {
        (useAccountLimitsData as jest.Mock).mockReturnValue({
            isLoading: false,
            isVirtual: true,
        });
        render(<AccountLimits />);
        expect(screen.getByText('DemoMessage')).toBeInTheDocument();
    });

    it('should render AccountLimitsTable and AccountLimitsSideNote when accountLimits is not empty', () => {
        (useAccountLimitsData as jest.Mock).mockReturnValue({
            accountLimits: sampleAccountlimits,
            isLoading: false,
            isVirtual: false,
        });
        render(<AccountLimits />);
        expect(screen.getByText('Account limits')).toBeInTheDocument();
        expect(screen.getByText('These are default limits that we apply to your accounts')).toBeInTheDocument();
    });

    it('should return null when accountLimits is empty', () => {
        (useAccountLimitsData as jest.Mock).mockReturnValue({
            accountLimits: [],
            isLoading: false,
            isVirtual: false,
        });
        render(<AccountLimits />);
        expect(screen.queryByText('Account limits')).not.toBeInTheDocument();
    });
});
