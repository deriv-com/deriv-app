import React from 'react';
import { APIProvider } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import AdvertiserName from '../AdvertiserName';

const wrapper = ({ children }: { children: JSX.Element }) => <APIProvider>{children}</APIProvider>;
let mockUseAdvertiserStats = {
    data: {
        fullName: 'Jane Doe',
        name: 'Jane',
        show_name: 0,
    },
    isLoading: true,
};

jest.mock('../../../hooks', () => ({
    ...jest.requireActual('../../../hooks'),
    useAdvertiserStats: jest.fn(() => mockUseAdvertiserStats),
}));

describe('AdvertiserNameStats', () => {
    it('should render loading when data is not available', () => {
        render(<AdvertiserName />, { wrapper });
        expect(screen.queryByTestId('dt_p2p_v2_advertiser_name')).not.toBeInTheDocument();
    });
    it('should render full name', () => {
        mockUseAdvertiserStats = {
            data: {
                fullName: 'Jane Doe',
                name: 'Jane',
                show_name: 1,
            },
            isLoading: false,
        };
        render(<AdvertiserName />, { wrapper });
        expect(screen.queryByText('Jane Doe')).toBeInTheDocument();
    });
});
