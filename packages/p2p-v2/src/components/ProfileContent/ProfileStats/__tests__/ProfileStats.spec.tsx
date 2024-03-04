import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileStats from '../ProfileStats';

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

let mockProps = {
    advertiserStats: {
        averagePayTime: -1,
        averageReleaseTime: -1,
        buyCompletionRate: 0,
        buyOrdersCount: 0,
        sellCompletionRate: 0,
        sellOrdersCount: 0,
        tradePartners: 0,
        tradeVolume: 0,
    },
};

describe('<ProfileStats />', () => {
    it('should render no results if advertiserStats is empty', () => {
        render(<ProfileStats />);

        expect(screen.queryByText('Buy completion 30d')).not.toBeInTheDocument();
        expect(screen.queryByText('Sell completion 30d')).not.toBeInTheDocument();
        expect(screen.queryByText('Trade volume 30d')).not.toBeInTheDocument();
        expect(screen.queryByText('0.00 USD')).not.toBeInTheDocument();
        expect(screen.queryByText('Avg pay time 30d')).not.toBeInTheDocument();
        expect(screen.queryByText('Avg release time 30d')).not.toBeInTheDocument();
        expect(screen.queryByText('Trade partners')).not.toBeInTheDocument();
    });

    it('should render the ProfileStats component with empty results', () => {
        render(<ProfileStats {...mockProps} />);

        expect(screen.getByText('Buy completion 30d')).toBeInTheDocument();
        expect(screen.getByText('Sell completion 30d')).toBeInTheDocument();
        expect(screen.getByText('Trade volume 30d')).toBeInTheDocument();
        expect(screen.getByText('0.00 USD')).toBeInTheDocument();
        expect(screen.getByText('Avg pay time 30d')).toBeInTheDocument();
        expect(screen.getByText('Avg release time 30d')).toBeInTheDocument();
        expect(screen.getByText('Trade partners')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getAllByText('-')).toHaveLength(4);
    });

    it('should render the ProfileStats component with non-empty results', () => {
        mockProps = {
            advertiserStats: {
                averagePayTime: 10,
                averageReleaseTime: 20,
                buyCompletionRate: 50,
                buyOrdersCount: 10,
                sellCompletionRate: 60,
                sellOrdersCount: 20,
                tradePartners: 30,
                tradeVolume: 100,
            },
        };
        render(<ProfileStats {...mockProps} />);

        expect(screen.getByText('50% (10)')).toBeInTheDocument();
        expect(screen.getByText('60% (20)')).toBeInTheDocument();
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
        expect(screen.getByText('10 min')).toBeInTheDocument();
        expect(screen.getByText('20 min')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
    });
});
