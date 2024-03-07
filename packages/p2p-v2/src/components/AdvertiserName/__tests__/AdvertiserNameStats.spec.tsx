import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import AdvertiserNameStats from '../AdvertiserNameStats';

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

type TMockUseAdvertiserStats = {
    data?: {
        blocked_by_count?: number;
        daysSinceJoined?: number;
        rating_average?: number;
        rating_count?: number;
        recommended_average?: number;
    };
    isLoading: boolean;
};
let mockUseAdvertiserStats: Partial<TMockUseAdvertiserStats> = {
    data: {
        blocked_by_count: 0,
        daysSinceJoined: 0,
        rating_average: 0,
        rating_count: 0,
        recommended_average: 0,
    },
    isLoading: false,
};

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

describe('AdvertiserNameStats', () => {
    it('should render correct advertiser stats', () => {
        mockUseAdvertiserStats = {
            data: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_average: 4.4,
                rating_count: 29,
                recommended_average: 3.3,
            },
            isLoading: false,
        };
        render(<AdvertiserNameStats />, { wrapper });
        expect(screen.queryByText('1')).toBeInTheDocument();
        expect(screen.queryByText('Joined 22d')).toBeInTheDocument();
        expect(screen.queryByText('(29 ratings)')).toBeInTheDocument();
    });
    it('should render correct advertiser stats based on availability', () => {
        mockUseAdvertiserStats = {
            data: {
                blocked_by_count: 1,
                daysSinceJoined: 22,
                rating_count: 29,
            },
            isLoading: false,
        };
        render(<AdvertiserNameStats />, { wrapper });
        expect(screen.queryByText('Not rated yet')).toBeInTheDocument();
    });
});
