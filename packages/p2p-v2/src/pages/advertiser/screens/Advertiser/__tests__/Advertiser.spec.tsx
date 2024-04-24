import React from 'react';
import { APIProvider, AuthProvider } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Advertiser from '../Advertiser';

const mockUseHistory = {
    location: { search: '?id=123' },
    push: jest.fn(),
};

const mockUseLocation = {
    state: { from: '' },
};

const wrapper = ({ children }: { children: JSX.Element }) => (
    <APIProvider>
        <AuthProvider>{children}</AuthProvider>
    </APIProvider>
);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => mockUseHistory,
    useLocation: () => mockUseLocation,
    useParams: () => ({ advertiserId: '123' }),
}));

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    p2p: {
        advertiser: {
            useGetInfo: jest.fn(() => ({
                data: {
                    advertiser_info: {
                        id: '123',
                    },
                },
            })),
        },
    },
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

jest.mock('@/components', () => ({
    ...jest.requireActual('@/components'),
    ProfileContent: () => <div>ProfileContent</div>,
}));

jest.mock('../../AdvertiserAdvertsTable', () => ({
    AdvertiserAdvertsTable: () => <div>AdvertiserAdvertsTable</div>,
}));

describe('<Advertiser />', () => {
    it('should render the Advertiser page component', () => {
        render(<Advertiser />, { wrapper });

        expect(screen.getByText('Advertiser’s page')).toBeInTheDocument();
        expect(screen.getByText('ProfileContent')).toBeInTheDocument();
        expect(screen.getByText('AdvertiserAdvertsTable')).toBeInTheDocument();
    });

    it('should call navigate back to buy-sell page when the back button is clicked', () => {
        render(<Advertiser />, { wrapper });
        const backButton = screen.getByTestId('dt_p2p_v2_page_return_btn');
        userEvent.click(backButton);
        expect(mockUseHistory.push).toHaveBeenCalledWith('/cashier/p2p-v2/buy-sell');
    });

    it('should call navigate back to my-profile page when the back button is clicked', () => {
        mockUseLocation.state.from = 'MyProfile';
        render(<Advertiser />, { wrapper });
        const backButton = screen.getByTestId('dt_p2p_v2_page_return_btn');
        userEvent.click(backButton);
        expect(mockUseHistory.push).toHaveBeenCalledWith('/cashier/p2p-v2/my-profile?tab=My+counterparties');
    });
});
