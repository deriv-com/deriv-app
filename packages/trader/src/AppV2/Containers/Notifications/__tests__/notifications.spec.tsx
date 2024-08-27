import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import ModulesProvider from 'Stores/Providers/modules-providers';
import TraderProviders from '../../../../trader-providers';
import { ReportsStoreProvider } from '../../../../../../reports/src/Stores/useReportsStores';
import Notifications from '../notifications';

const notification_banners = 'NotificationBanners';
const banner_content = 'Accumulators - Volatility 100 (1s) Index';

jest.mock('@deriv-com/quill-ui', () => ({
    ...jest.requireActual('@deriv-com/quill-ui'),
    useNotifications: jest.fn(() => ({
        addBanner: jest.fn(),
        banners: [
            {
                message: banner_content,
                redirectTo: '/contract/11111',
                title: 'Stake: 10.00 USD',
                id: 'mock_id',
            },
        ],
        removeBanner: jest.fn(),
    })),
    NotificationBanners: jest.fn(({ banners }) => (
        <div>
            <p>{notification_banners}</p>
            <p>{banners[0].message}</p>
        </div>
    )),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({
        pathname: '/dtrader',
    })),
}));

describe('Notifications', () => {
    let default_mock_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mock_store = mockStore({});
    });

    const mockNotifications = () => {
        render(
            <TraderProviders store={default_mock_store}>
                <ReportsStoreProvider>
                    <ModulesProvider store={default_mock_store}>
                        <Notifications />
                    </ModulesProvider>
                </ReportsStoreProvider>
            </TraderProviders>
        );
    };

    it('should render notifications if useNotifications returns array with notifications', () => {
        mockNotifications();

        expect(screen.getByText(notification_banners)).toBeInTheDocument();
        expect(screen.getByText(banner_content)).toBeInTheDocument();
    });
});
