import React from 'react';
import { render, screen } from '@testing-library/react';
import WalletMT5CardList from '../wallet-mt5-card-list';
import { APIProvider } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(name => {
        if (name === 'trading_platform_available_accounts') {
            return {
                data: {
                    trading_platform_available_accounts: [
                        {
                            availability: 'Non-EU',
                            icon: 'Derived',
                            market_type: 'gaming',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'svg',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'Derived',
                            market_type: 'gaming',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'vanuatu',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'Financial',
                            market_type: 'financial',
                            name: 'Deriv SVG',
                            platform: 'mt5',
                            shortcode: 'bvi',
                        },
                        {
                            availability: 'Non-EU',
                            icon: 'swapfree',
                            market_type: 'all',
                            name: 'Swap Free',
                            platform: 'mt5',
                            shortcode: 'svg',
                        },
                    ],
                },
            };
        }
        return { data: undefined };
    }),
    useRequest: jest.fn(() => ({
        data: {
            mt5_login_list: [
                {
                    display_login: 'CRW909900',
                    email: '',
                    leverage: '10012123123',
                    login: 'CRW909900',
                    server: 'Deriv-Server',
                    server_description: 'Deriv-Server',
                    type: 'demo',
                },
            ],

            trading_platform_accounts: [
                {
                    account_type: 'financial',
                    email: '',
                    id: 'CRW909900',
                    is_disabled: 0,
                    is_virtual: 1,
                    leverage: '1000',
                    login: 'CRW909900',
                    server: 'Deriv-Server',
                    server_description: 'Deriv-Server',
                    short_title: 'CRW909900',
                    title: 'CRW909900',
                    type: 'demo',
                },
            ],
        },
        mutate: jest.fn,
    })),
}));

jest.mock('@deriv/hooks', () => ({
    useFilteredCFDAccounts: jest.fn(() => ({
        data: {
            synthetic: [
                {
                    account_type: 'synthetic',
                    email: '',
                    id: 'CRW909900',
                    is_disabled: 0,
                    is_virtual: 1,
                    leverage: '1000',
                    login: 'CRW909900',
                    server: 'Deriv-Server',
                    server_description: 'Deriv-Server',
                    short_title: 'CRW909900',
                    title: 'CRW909900',
                    type: 'demo',
                    is_added: true,
                },
            ],
            financial: [
                {
                    account_type: 'financial',
                    email: '',
                    id: 'CRW909900',
                    is_disabled: 0,
                    is_virtual: 1,
                    leverage: '1000',
                    login: 'CRW909001',
                    server: 'Deriv-Server',
                    server_description: 'Deriv-Server',
                    short_title: 'CRW909001',
                    title: 'CRW909900',
                    type: 'demo',
                    is_added: false,
                },
            ],
        },
        isFetchedAfterMount: true,
    })),
}));

jest.mock('../added-mt5-card', () => {
    return {
        __esModule: true,
        default: () => <div>AddedMT5Card</div>,
    };
});

jest.mock('../available-mt5-card', () => {
    return {
        __esModule: true,
        default: () => <div>AvailableMT5Card</div>,
    };
});

describe('WalletMT5CardList', () => {
    it('should render AvailableMT5Card when account is not added', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        render(
            <APIProvider>
                <StoreProvider store={mock}>
                    <WalletMT5CardList />
                </StoreProvider>
            </APIProvider>
        );
        expect(screen.getByText('AvailableMT5Card')).toBeInTheDocument();
    });

    it('should render AddedMT5Card when account is added', () => {
        const mock = mockStore({
            client: { accounts: { CRW909900: { token: '12345' } }, loginid: 'CRW909900' },
        });

        render(
            <APIProvider>
                <StoreProvider store={mock}>
                    <WalletMT5CardList />
                </StoreProvider>
            </APIProvider>
        );

        expect(screen.getByText('AddedMT5Card')).toBeInTheDocument();
    });
});
